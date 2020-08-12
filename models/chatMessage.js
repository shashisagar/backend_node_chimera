const Joi = require('joi');
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  fromId: {
    type: String,
    required: true
  },
  toId: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 2048,
  },
  is_read: {
    type: Number,
    required: true
  },
  created_date : {
    type: Date,
    default: Date.now 
  }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

function validateChatMessage(chatMessage) {
  const schema = {
    fromId: Joi.string().required(),
    toId: Joi.string().required(),
    is_read : Joi.number().integer().required(),
    message: Joi.string().min(1).max(2048).required()
  };

  return Joi.validate(chatMessage, schema);
}

exports.ChatMessage = ChatMessage; 
exports.validate = validateChatMessage;