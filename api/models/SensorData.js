const mongoose = require('mongoose');

const SensorDataSchema = new mongoose.Schema(
  {
    chillerId: {
      type: String,
      required: true,
    },
    cond_SatRfgtTemp: {
      type: Number,
    },
    cond_DischSatTemp: {
      type: Number,
    },
    cond_DischSubc: {
      type: Number,
    },
    cond_RfgtPress: {
      type: Number,
    },
    cond_DiffRfgtPress: {
      type: Number,
    },
    cond_SubcLiqTemp: {
      type: Number,
    },
    cond_SubcLiqPress: {
      type: Number,
    },
    cond_FanDischTemp: {
      type: Number,
    },
    comp_SuctPress: {
      type: Number,
    },
    comp_DiffPress: {
      type: Number,
    },
    comp_MassFlow: {
      type: Number,
    },
    comp_DischTemp: {
      type: Number,
    },
    comp_DischSupe: {
      type: Number,
    },
    comp_CompCurrent: {
      type: Number,
    },
    evap_SatRfgtTemp: {
      type: Number,
    },
    evap_RfgtPoolTemp: {
      type: Number,
    },
    evap_RfgtPress: {
      type: Number,
    },
    evap_ApprchTemp: {
      type: Number,
    },
    evap_EntWtrTemp: {
      type: Number,
    },
    evap_LvgWtrTemp: {
      type: Number,
    },
    evap_WtrFlowEsti: {
      type: Number,
    },
    evap_OutdoorAirTemp: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('SensorData', SensorDataSchema);
