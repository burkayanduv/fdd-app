const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).json('Username not found!');
    } else {
      await bcrypt.compare(
        req.body.password,
        user.password,
        (err, response) => {
          if (err) {
            res.status(400).json(err);
          }
          if (response) {
            const { password, ...others } = user._doc;
            res.status(200).json(others);
          } else {
            res.status(400).json('Wrong password!');
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
