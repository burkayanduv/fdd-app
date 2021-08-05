const router = require('express').Router();
const dotenv = require('dotenv');
const User = require('../models/User');
const Chiller = require('../models/Chiller');

dotenv.config();

// RENAME CHILLER
router.put('/', async (req, res) => {
  try {
    const { userToken, userName, oldName, newName, masterToken } = req.body;
    if (userToken === process.env.USER_TOKEN) {
      const queriedChiller = await Chiller.findOne({ chillerName: newName });
      if (
        queriedChiller.admins.includes(userName) ||
        masterToken === process.env.MASTER_TOKEN
      ) {
        const updatedUsers = await User.updateMany(
          { chillers: oldName },
          { $set: { 'chillers.$': newName } },
          { new: true }
        );
        res.status(200).json(updatedUsers);
      } else {
        res.status(401).json('Only admin can update the chiller...');
      }
    } else {
      res.status(401).json('Not authorized to access the API...');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
