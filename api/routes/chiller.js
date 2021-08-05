const router = require('express').Router();
const dotenv = require('dotenv');
const Chiller = require('../models/Chiller');
const User = require('../models/User');
const SensorData = require('../models/SensorData');

dotenv.config();

// CREATE CHILLER
router.post('/', async (req, res) => {
  const { masterToken, ...others } = req.body;
  if (masterToken === process.env.MASTER_TOKEN) {
    const newChiller = new Chiller(others);
    try {
      const savedChiller = await newChiller.save();
      res.status(200).json(savedChiller);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

// UPDATE CHILLER
router.put('/:id', async (req, res) => {
  try {
    const { userName, userToken, masterToken, ...others } = req.body;
    if (userToken === process.env.USER_TOKEN) {
      const queriedChiller = await Chiller.findById(req.params.id);
      if (
        queriedChiller.admins.includes(userName) ||
        masterToken === process.env.MASTER_TOKEN
      ) {
        try {
          const updatedChiller = await Chiller.findByIdAndUpdate(
            req.params.id,
            {
              $set: others,
            },
            { new: true }
          );
          res.status(200).json(updatedChiller);
        } catch (err) {
          res.status(500).json(err);
        }
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

// DELETE CHILLER
router.delete('/:id', async (req, res) => {
  try {
    if (req.query.masterToken === process.env.MASTER_TOKEN) {
      const queriedChiller = await Chiller.findById(req.params.id);
      try {
        await User.updateMany(
          {},
          {
            $pull: { chillers: queriedChiller.chillerName },
          },
          { new: true }
        );
        const queriedSensorData = await SensorData.find({
          chillerId: queriedChiller._id,
        });
        if (queriedSensorData.length !== 0) {
          await queriedSensorData.delete();
        }
        await queriedChiller.delete();
        res.status(200).json('Chiller has been deleted...');
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json('Not authorized to access the API...');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET CHILLER
router.get('/:id', async (req, res) => {
  if (req.body.getToken === process.env.GET_TOKEN) {
    try {
      const queriedChiller = await Chiller.findById(req.params.id);
      res.status(200).json(queriedChiller);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

// QUERY CHILLER
router.get('/', async (req, res) => {
  if (req.query.getToken === process.env.GET_TOKEN) {
    const chillerName = req.query.chiller;
    const username = req.query.user;
    try {
      if (chillerName) {
        const chiller = await Chiller.findOne({ chillerName });
        res.status(200).json(chiller);
      } else if (username === '/') {
        const chillers = await Chiller.find();
        res.status(200).json(chillers);
      } else if (username) {
        const chillers = await Chiller.find({ users: username });
        res.status(200).json(chillers);
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
