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
        // // Validate email format (organization email)
        // if (!email || !email.includes('@')) {
        //     return res.status(400).json({ message: "Valid organization email required" });
        // }

        const userFound = await userModel.findOne({ email });
        if(userFound) { return res.status(400).json({ message: "User already registered" })};

        const user = await userModel.create({ email, password });
        
        // Generate verification token
        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken, user.anonymousName);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue with signup even if email fails
        }

        // Auth
        const { accessToken, refreshToken } = generateTokens(user._id);
        await saveRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            user: user.getPublicProfile(),
            message: "Account created. Please check your email to verify your account.",
            requiresVerification: true
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
                user: user.getPublicProfile(),
                message: "User logged in successfully",
                requiresVerification: !user.isEmailVerified
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

//* EMAIL VERIFICATION Controller
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: "Verification token required" });
        }

        // Hash the token to compare with stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await userModel.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: "Invalid or expired verification token. Please request a new one." 
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.anonymousName);
        } catch (emailError) {
            console.error('Welcome email failed:', emailError);
        }

        res.status(200).json({
            message: "Email verified successfully! You can now access the feedback system.",
            user: user.getPublicProfile()
        });
    } catch (error) {
        console.error("Email verification error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

//* RESEND VERIFICATION EMAIL Controller
export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Generate new verification token
        const verificationToken = user.generateVerificationToken();
        await user.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken, user.anonymousName);

        res.status(200).json({
            message: "Verification email sent successfully. Please check your inbox."
        });
    } catch (error) {
        console.error("Resend verification error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

//* GET PROFILE Controller
export const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.getPublicProfile());
    } catch (error) {
        console.error("Get profile error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};