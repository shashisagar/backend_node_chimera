const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const {ChatMessage} = require('../models/chatMessage');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['firstName', 'lastName','email', 'password','phone']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'firstName', 'lastName','email','phone']));
});

router.get('/getUser/:id', auth, async (req, res) => {
  const users = await User.find({"_id": {$ne: req.user._id}}).sort('name');
  res.send(users);
});

router.get('/getMessages/:toId/:fromId', auth, async (req, res) => {
  const query = {
    $or : [
        { $and : [ { toId: req.params.toId  }, { fromId: req.params.fromId } ] },
        { $and : [ { fromId: req.params.toId }, {toId: req.params.fromId } ] }
    ]
  }
  const messages = await ChatMessage.find(query).sort('created_at');
  res.send(messages);
});

module.exports = router; 
