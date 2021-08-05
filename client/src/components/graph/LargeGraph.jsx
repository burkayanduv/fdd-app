import { Line } from '@ant-design/charts';
import { message } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

export default function LargeGraph({
  data,
  selectedSensorsAndColors,
  isRealtime,
  selectedChillerId,
}) {
  // this is to cause rerender when data changes
  const [dataState, setDataState] = useState(data);
  const [newData, setNewData] = useState({});

  // function to fetch real time data and append to dataset
  const fetchRealTime = async (chillerId) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const getToken = process.env.REACT_APP_GET_TOKEN;
      const res = await axios.get(
        `${apiURL}/sensor/?chiller=${chillerId}&limit=1&getToken=${getToken}`
      );
      setNewData(res.data[0]);
    } catch (error) {
      message.error(`${error.name} - (sensor) - ${error.message}`);
    }
  };

  // fetch data when realtime switch state changes
  const refreshIntervalId = useRef(null);
  useEffect(() => {
    if (isRealtime) {
      message.success('Realtime database connection is on...');
      refreshIntervalId.current = setInterval(
        fetchRealTime,
        5000,
        selectedChillerId
      );
    } else {
      clearInterval(refreshIntervalId.current);
    }
  }, [isRealtime]);

  useEffect(() => {
    if (Object.keys(newData).length === 0) return;
    const newSensorData = dataState;
    newSensorData.push(newData);
    newSensorData.shift();
    setDataState(newSensorData);
  }, [newData]);

  const dataArray = [];
  const colorsArray = [];
  dataState.forEach((row) => {
    Object.entries(selectedSensorsAndColors).forEach(([key, value]) => {
      const singleSensor = {};
      singleSensor.time = row.createdAt;
      singleSensor.value = row[key];
      singleSensor.category = key;
      dataArray.push(singleSensor);
      colorsArray.push(value);
    });
  });

  const minData = dataArray.reduce((prev, curr) =>
    prev.value < curr.value ? prev : curr
  );

  const maxData = dataArray.reduce((prev, curr) =>
    prev.value > curr.value ? prev : curr
  );

  const maxGraph = maxData.value + (maxData.value - minData.value) * 0.1;
  const minGraph = minData.value - (maxData.value - minData.value) * 0.1;

  const timedData = dataArray.map(({ time: timeString, ...rest }) => ({
    time: new Date(timeString).toLocaleString('en-GB'),
    ...rest,
  }));

  const config = {
    data: timedData,
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    color: colorsArray,
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

LargeGraph.propTypes = {
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
      AI_RefLoad: PropTypes.number,
    })
  ).isRequired,
  selectedSensorsAndColors: PropTypes.shape({
    key: PropTypes.string,
  }).isRequired,
  isRealtime: PropTypes.bool.isRequired,
  selectedChillerId: PropTypes.string.isRequired,
};
