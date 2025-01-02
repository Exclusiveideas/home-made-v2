const router = require("express").Router();
const { MessageModel, ChatRoomModel } = require("../models");


// Create a Message
router.post('/create', async (req, res) => {
    const { senderID, member, chatRoomID } = req.body; // time is replace with createdAt
  
    try {
      // Check if the chatroom exists
      const chatRoom = await ChatRoomModel.findById(chatRoomID);
  
      if (!chatRoom) {
        return res.status(404).json({ message: "Chatroom not found" });
      }
  
      // Create a new message
      const newMessage = new MessageModel({
        senderID,
        member,
        chatRoomID
      });
  
      const savedMessage = await newMessage.save();
  
      // Add the message to the chatroom's messages array
      chatRoom.messages.push(savedMessage._id);
      await chatRoom.save();
  
      res.status(201).json(savedMessage);
  
    } catch (err) {
      res.status(500).json({ message: "Error creating message", error: err.message });
    }
  });
  

module.exports = router;