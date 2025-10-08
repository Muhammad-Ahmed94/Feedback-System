import jwt from 'jsonwebtoken';
import userModel from '../model/user.model.js';

// Protect routes - verify JWT token
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.accessTokenCookie;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.ACCESSTOKEN_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await userModel.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.userId = user._id;
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

// Verify email before accessing certain routes
export const requireVerifiedEmail = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.user.isEmailVerified) {
            return res.status(403).json({ 
                message: "Please verify your email before accessing this feature",
                requiresVerification: true
            });
        }

        next();
    } catch (error) {
        console.error("Error in requireVerifiedEmail middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin only middleware
export const adminOnly = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied - Admin only" });
        }

        next();
    } catch (error) {
        console.error("Error in adminOnly middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};