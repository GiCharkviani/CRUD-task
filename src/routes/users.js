const express = require('express');
const router = express.Router();
const { addUser, getUserById, getUsers, updateUser, patchUser, removeUser } = require('../services/users');
const User = require('../models/user');
const fs = require('fs');
const genPath = require('../shared/path');
const avatar = require('../middlewares/avatar');
const fileMid = require('../middlewares/fileMid');

// clear image
const clearImage = (user) => {
  if (user.avatar) {
    const splitter = user.avatar.split('/');
    const fileName = splitter[splitter.length - 1];
    const filePath = genPath(fileName);

    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => err);
    }
  }
};

// Routes
router.post('/', fileMid, avatar, async (req, res, next) => {
  const { username, email, age, phone, filePath } = req.body;

  const userModel = new User(username, email, filePath, age, phone);
  try {
    const [userAdded] = await addUser(userModel);

    res.status(201).json(userAdded);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const { params } = req;

  try {
    const user = await getUserById(params.id);
    if (!user) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }
    res.status(201).json(user);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await getUsers();
    if (users.length < 1) {
      const error = new Error('Users not found!');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(users);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.put('/:id', fileMid, avatar, async (req, res, next) => {
  const { username, email, age, phone, filePath } = req.body;
  const { params } = req;

  const userModel = new User(username, email, filePath, age, phone);

  try {
    const user = await getUserById(params.id);

    const [updatedUser] = await updateUser(params.id, userModel);

    if (!updatedUser) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    clearImage(user);

    res.status(200).json({ updatedUser });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.patch('/:id', fileMid, avatar, async (req, res, next) => {
  const { username, email, age, phone, filePath } = req.body;
  const { params } = req;

  const userModel = new User(username, email, filePath, age, phone);

  try {
    const user = await getUserById(params.id);

    const patchedUser = await patchUser(params.id, userModel);

    if (!patchedUser) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    clearImage(user);

    res.status(200).json(patchedUser);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { params } = req;
  try {
    const [removedUser] = await removeUser(params.id);

    if (!removedUser) {
      const error = new Error('User not found!');
      error.statusCode = 404;
      throw error;
    }

    clearImage(removedUser);

    res.status(200).json(removedUser);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
});
const PREFIX = '/user';
module.exports = [PREFIX, router];
