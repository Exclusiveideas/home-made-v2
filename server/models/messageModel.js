const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the userModel
    required: true,
  },
  chatRoomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ChatRoom', // Reference to the chatRoomModel
    required: true,
  }
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;
