const router = require('express').Router();
const dotenv = require('dotenv');
const axios = require('axios');
const Chiller = require('../models/Chiller');
const SensorData = require('../models/SensorData');
const RefLoadPred = require('../models/RefLoadPred');

dotenv.config();

// REFRESH REFLOAD PREDICTIONS
router.post('/', async (req, res) => {
  const { userToken, chillerId } = req.body;
  if (userToken === process.env.USER_TOKEN) {
    try {
      const endDate = new Date(Date.now());
      let startDate = null;
      if (chillerId) {
        const queriedPred = await RefLoadPred.find({ chillerId })
          .sort({ sensorDataTime: -1 })
          .limit(1);
        if (Object.keys(queriedPred).length === 0) {
          startDate = new Date(0);
        } else {
          startDate = new Date(queriedPred[0].sensorDataTime);
        }
        const queriedSensorData = await SensorData.find({
          chillerId,
          createdAt: { $gt: startDate, $lte: endDate },
        });
        if (queriedSensorData.length !== 0) {
          const createdAts = queriedSensorData.map((row) => ({
            sensorDataTime: row.createdAt,
          }));
          const refLoadPred = await axios.post(
            `${process.env.AI_MODULE_URL}/api`,
            JSON.stringify(queriedSensorData),
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const refLoadObjs = refLoadPred.data.preds.map((val) => ({
            refLoad: val,
          }));
          const refLoadData = createdAts.map((row, index) => ({
            ...Object.assign(row, refLoadObjs[index]),
            chillerId,
          }));
          const savedRefLoadPred = await RefLoadPred.insertMany(refLoadData);
          const diagnosisTime =
            refLoadData[refLoadData.length - 1].sensorDataTime;
          const chillerRefLoad = refLoadData[refLoadData.length - 1].refLoad;
          let healthStatus;
          if (chillerRefLoad > 85) {
            healthStatus = 'normal';
          } else {
            healthStatus = `refleak_${Math.round(chillerRefLoad)}%`;
          }
          await Chiller.findByIdAndUpdate(chillerId, {
            $set: {
              healthStatus,
              diagnosisTime,
            },
          });
          res.status(200).json(savedRefLoadPred);
        } else {
          res.status(204).json('Prediction already up to date.');
        }
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

// QUERY REFLOAD DATA
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
        const queriedSensorData = await SensorData.find({ chillerId })
          .sort({ createdAt: -1 })
          .limit(1);
        resData = await RefLoadPred.find({
          chillerId,
          sensorDataTime: { $lte: queriedSensorData[0].createdAt },
        })
          .sort({ sensorDataTime: -1 })
          .limit(Number(dataLimit));
        res.status(200).json(resData);
      } else if (chillerId && startDate !== null && endDate !== null) {
        resData = await RefLoadPred.find({
          chillerId,
          sensorDataTime: { $gte: startDate, $lte: endDate },
        }).sort({ sensorDataTime: -1 });
        res.status(200).json(resData);
      } else if (chillerId) {
        resData = await RefLoadPred.find({ chillerId });
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
