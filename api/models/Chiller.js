const mongoose = require('mongoose');

const ChillerSchema = new mongoose.Schema(
  {
    chillerName: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    connectionStatus: {
      type: String,
    },
    healthStatus: {
      type: String,
    },
    diagnosisTime: {
      type: Date,
    },
    users: [
      {
        type: String,
      },
    ],
    admins: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chiller', ChillerSchema);
