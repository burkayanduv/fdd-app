const router = require('express').Router();
const dotenv = require('dotenv');
const SensorData = require('../models/SensorData');

dotenv.config();

// CREATE SENSOR DATA
router.post('/', async (req, res) => {
  const { sensorToken, ...others } = req.body;
  if (sensorToken === process.env.SENSOR_TOKEN) {
    const newSensorData = new SensorData(others);
    try {
      const savedSensorData = await newSensorData.save();
      res.status(200).json(savedSensorData);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('Not authorized to access the API...');
  }
});

// QUERY SENSOR DATA
router.get('/', async (req, res) => {
  if (req.query.getToken === process.env.GET_TOKEN) {
    const chillerId = req.query.chiller;
    const dataLimit = req.query.limit;
    let startDate = null;
    let endDate = null;
    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    }
    try {
      let resData;
      if (chillerId && dataLimit) {
        resData = await SensorData.find({ chillerId })
          .sort({ createdAt: -1 })
          .limit(Number(dataLimit));
        res.status(200).json(resData);
      } else if (chillerId && startDate !== null && endDate !== null) {
        resData = await SensorData.find({
          chillerId,
          createdAt: { $gte: startDate, $lte: endDate },
        }).sort({ createdAt: -1 });
        res.status(200).json(resData);
      } else if (chillerId) {
        resData = await SensorData.find({ chillerId });
        res.status(200).json(resData);
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
