const mongoose = require('mongoose');

const RefLoadPredSchema = new mongoose.Schema(
  {
    sensorDataTime: {
      type: Date,
      required: true,
    },
    refLoad: {
      type: Number,
      required: true,
    },
    chillerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RefLoadPred', RefLoadPredSchema);
