import User from "../models/user.js";
import jwt from 'jsonwebtoken'

export const verifyUser = async(req, res, next) => {
    const token = req.cookies.jwt;

    try {
        if (!token) {
          return res.status(401).json({ message: "Unauthorized - No Token found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
        return res.status(403).json({ message: "Unauthorized - Invalid Token" });
        }
        
        const user = await User.findOne({_id: decoded.userid}).select("-password");

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Error in verifyUser middleware", error.message);
        return res.status(500).json({ message: "Server error" });        
    }

};
