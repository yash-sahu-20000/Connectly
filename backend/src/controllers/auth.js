import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js"
import bcrypt from "bcryptjs";


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      generateToken(user._id, res);
  
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    } catch (error) {
      console.log("Error in login controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const signup = async (req, res) => {
    const {fullName, email,password} = req.body

    try {
        if (fullName==null || email==null || password==null) {
            return res.status(400).json({error: "All fields are required"})
        }
        if (password.length < 6){
            return res.status(400).json({error: "Password should be at least 6 characters long"})
        }
    
        const user = await User.findOne({email: email});
        if (user) return res.status(400).json({error: "User already exists"})

        const salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash(password, salt)
    
        const newUser = new User({fullName, email, password: hashedPassword});
        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: 'https://res.cloudinary.com/dcute6a59/image/upload/v1736864791/l48cggrpmlgoipiwxc5s.jpg',
              });
        }else{
            res.status(400).json({error: "Failed to register user"})
        }
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error: "Server error"})        
    }
}

export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const updateProfile = async (req, res) => {
  try {
    const {profilePic} = req.body
    const userId = req.user._id
  
    if (!profilePic){
      return res.status(400).json({message: "Profile picture is required"})
    }
  
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId, {$set: {profilePic: uploadResponse.secure_url}}, {new: true})
  
    res.status(200).json(updatedUser);
    
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" });
  }
}

export const checkAuth = (req, res) => {
  try {
    if (req.user) {
      res.status(200).json( req.user );
    } else { 
      res.status(200).json({ isAuthenticated: false });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};