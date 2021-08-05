import { Line } from '@ant-design/charts';
import PropTypes from 'prop-types';

export default function MultiLineChart({ data }) {
  const dataArray = [];
  data.forEach(
    ({
      createdAt: createdAtVal,
      cond_SatRfgtTemp: condSatRfgtTempVal,
      cond_DischSatTemp: condDischSatTempVal,
      comp_DischTemp: compDischTempVal,
      evap_SatRfgtTemp: evapSatRfgtTempVal,
      evap_RfgtPoolTemp: evapRfgtPoolTempVal,
    }) => {
      const singleSensor1 = {};
      singleSensor1.time = createdAtVal;
      singleSensor1.value = condSatRfgtTempVal;
      singleSensor1.category = 'cond_SatRfgtTemp';
      const singleSensor2 = {};
      singleSensor2.time = createdAtVal;
      singleSensor2.value = condDischSatTempVal;
      singleSensor2.category = 'cond_DischSatTemp';
      const singleSensor3 = {};
      singleSensor3.time = createdAtVal;
      singleSensor3.value = compDischTempVal;
      singleSensor3.category = 'comp_DischTemp';
      const singleSensor4 = {};
      singleSensor4.time = createdAtVal;
      singleSensor4.value = evapSatRfgtTempVal;
      singleSensor4.category = 'evap_SatRfgtTemp';
      const singleSensor5 = {};
      singleSensor5.time = createdAtVal;
      singleSensor5.value = evapRfgtPoolTempVal;
      singleSensor5.category = 'evap_RfgtPoolTemp';

      dataArray.push(
        singleSensor1,
        singleSensor2,
        singleSensor3,
        singleSensor4,
        singleSensor5
      );
    }
  );

  const minData = dataArray.reduce((prev, curr) =>
    prev.value < curr.value ? prev : curr
  );

  const maxData = dataArray.reduce((prev, curr) =>
    prev.value > curr.value ? prev : curr
  );

  const maxGraph = maxData.value + (maxData.value - minData.value) * 0.1;
  const minGraph = minData.value - (maxData.value - minData.value) * 0.1;

  const timedData = dataArray.map(({ time: timeString, ...rest }) => ({
    time: new Date(timeString).toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    ...rest,
  }));

  const config = {
    data: timedData,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    color: ['#e8b339', '#854eca', '#e87040', '#6abe39', '#3c9ae8'],
    smooth: true,
    xAxis: {
      range: [0, 1],
    },
    yAxis: {
      grid: {
        line: { style: { opacity: 0.1 } },
      },
      range: [0.1, 1],
      minLimit: Math.floor(minGraph),
      maxLimit: Math.ceil(maxGraph),
    },
    legend: false,
  };

  return <Line {...config} />;
}

MultiLineChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      chillerId: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      __v: PropTypes.number,
      comp_CompCurrent: PropTypes.number,
      comp_DiffPress: PropTypes.number,
      comp_DischSupe: PropTypes.number,
      comp_DischTemp: PropTypes.number,
      comp_MassFlow: PropTypes.number,
      comp_SuctPress: PropTypes.number,
      cond_SatRfgtTemp: PropTypes.number,
      cond_DischSatTemp: PropTypes.number,
      cond_DischSubc: PropTypes.number,
      cond_RfgtPress: PropTypes.number,
      cond_DiffRfgtPres: PropTypes.number,
      cond_SubcLiqTemp: PropTypes.number,
      cond_SubcLiqPress: PropTypes.number,
      cond_FanDischTemp: PropTypes.number,
      evap_SatRfgtTemp: PropTypes.number,
      evap_RfgtPoolTemp: PropTypes.number,
      evap_RfgtPress: PropTypes.number,
      evap_ApprchTemp: PropTypes.number,
      evap_EntWtrTemp: PropTypes.number,
      evap_LvgWtrTemp: PropTypes.number,
      evap_WtrFlowEst: PropTypes.number,
      evap_OutdoorAirTempi: PropTypes.number,
    })
  ).isRequired,
};
