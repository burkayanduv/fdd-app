const router = require('express').Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const Chiller = require('../models/Chiller');

dotenv.config();

// UPDATE
router.put('/:id', async (req, res) => {
  const { userToken, ...others } = req.body;
  if (userToken === process.env.USER_TOKEN) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      others.password = await bcrypt.hash(others.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: others,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

// ADD/REMOVE CHILLER TO USER
router.put('/', async (req, res) => {
  const username = req.query.user;
  const { userToken, chillerName, mode } = req.body;
  if (userToken === process.env.USER_TOKEN) {
    try {
      let updatedUser;
      if (mode.toUpperCase() === 'ADD') {
        updatedUser = await User.updateOne(
          { username },
          {
            $addToSet: { chillers: chillerName },
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } else if (mode.toUpperCase() === 'REMOVE') {
        updatedUser = await User.updateOne(
          { username },
          {
            $pull: { chillers: chillerName },
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } else {
        updatedUser = 'Mode should be: ADD or REMOVE';
        res.status(400).json(updatedUser);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  if (req.query.userToken === process.env.USER_TOKEN) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Chiller.updateMany(
          { users: { $elemMatch: { $eq: user.username } } },
          {
            $pull: { users: user.username, admins: user.username },
          },
          { new: true }
        );
        await Chiller.find({
          admins: user.username,
        });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json('User not found!');
    }
  } else {
    res.status(401).json('You can only delete your own account...');
  }
});

// GET USER
router.get('/:id', async (req, res) => {
  if (req.body.getToken === process.env.GET_TOKEN) {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

// QUERY USER
router.get('/', async (req, res) => {
  if (req.query.getToken === process.env.GET_TOKEN) {
    const username = req.query.user;
    const chillerName = req.query.chiller;
    try {
      if (username === '/') {
        const users = await User.find();
        const usersDocs = users.map((user) => user._doc);
        const usersList = usersDocs.map(({ password, ...others }) => others);
        res.status(200).json(usersList);
      } else if (username) {
        const user = await User.findOne({ username });
        const { password, ...others } = user._doc;
        res.status(200).json(others);
      } else if (chillerName) {
        const users = await User.find({ chillers: chillerName });
        const usersDocs = users.map((user) => user._doc);
        const usersList = usersDocs.map(({ password, ...others }) => others);
        res.status(200).json(usersList);
      } else {
        res.status(401).json('Requested query not valid...');
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

module.exports = router;
