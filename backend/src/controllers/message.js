import User from "../models/user.js";
import Message from "../models/message.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import cloudinary from "../lib/cloudinary.js";

export const getContacts = async(req, res) => {

    try {
        const userid = req.user._id;
        const allContacts = await User.find({_id : {$ne: userid}}).select("-password")
        res.status(200).json(allContacts);
    } catch (error) {
        console.log("Error in getContacts controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}
export const getContactMessage = async(req, res) => {

    try {
        const userid = req.user._id;
        const contactid = req.params.contactid;

        const messages = await Message.find(
            {$or: [
                { senderId: userid, receiverId: contactid },
                { senderId: contactid, receiverId: userid },
            ]}
        )


        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getContactMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}
export const sendMessage = async(req, res) => {

    try {
        const userid = req.user._id;
        const contactid = req.params.contactid;
        const {text, image} = req.body;

        let imageUrl = null
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId: userid,
            receiverId: contactid,
            text,
            image: imageUrl
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(contactid);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}