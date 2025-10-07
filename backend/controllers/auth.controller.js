import jwt from 'jsonwebtoken';

import userModel from "../model/user.model.js";
import { redis } from '../lib/redis.js';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESSTOKEN_SECRET, {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESHTOKEN_SECRET, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
}

const saveRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_Token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60);
};

const setCookies = async (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessTokenCookie", accessToken, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie("refreshTokenCookie", refreshToken, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
}

//* SIGNUP  Controller
export const signup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userFound = await userModel.findOne({ email });
        if(userFound) { return res.status(400).json({ message: "User already registered" })};

        const user = await userModel.create({ email, password });
        
        // Auth
        const { accessToken, refreshToken } = generateTokens(user._id);

        // Save refresh token to redis for immediate access
        await saveRefreshToken(user._id, refreshToken);

        // Create cookes
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                password: user.password,
                role: user.role
            },
            message: "New user created successfully"
        })
    } catch (error) {
        console.error("Signup error", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

//* LOGIN  Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) { return res.status(400).json({ message: "Email & password required to login" }) };

        const user = await userModel.findOne({ email });
        if(user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id);
            await saveRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role
                },
                message: "User logged in successfully"
            })
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
        
    } catch (error) {
        console.error("Login failed", error.message)
        res.status(500).json({ message: "Internal server error" });
    }


}

//* LOGOUT  Controller
export const logout = async (req, res) => {
    try {
        const tokenExist = req.cookies.refreshTokenCookie;

        if(tokenExist) {
            const decoded = jwt.verify(tokenExist, process.env.REFRESHTOKEN_SECRET);
            await redis.del(`refresh_Token:${decoded.userId}`);
        }

        res.clearCookie("accessTokenCookie");
        res.clearCookie("refreshTokenCookie");
        res.status(200).json({ message: "Logout successfull" });

    } catch (error) {
        console.error("Could not log out", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}
