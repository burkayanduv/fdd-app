import { Checkbox, List, Select } from 'antd';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { FundFilled } from '@ant-design/icons';

export default function SensorGraphList({
  dataRow,
  selectedSensorsAndColors,
  setSelectedSensorsAndColors,
}) {
  const dataArray = [];
  const initialSensorColorsArray = {};
  Object.keys(dataRow).forEach((key) => {
    if (!['_id', 'chillerId', 'createdAt', 'updatedAt', '__v'].includes(key)) {
      dataArray.push(key);
      initialSensorColorsArray[key] = '#bfbfbf';
    }
  });

  const [colorsMatchingSensors, setColorsMatchingSensors] = useState(
    initialSensorColorsArray
  );

  // assing colors
  const colorsArray = [
    '#f5222d',
    '#fa541c',
    '#fa8c16',
    '#faad14',
    '#fadb14',
    '#a0d911',
    '#52c41a',
    '#13c2c2',
    '#1890ff',
    '#2f54eb',
    '#722ed1',
    '#eb2f96',
    '#bfbfbf',
  ];

  const handleCheckbox = (e) => {
    if (
      e.target.checked &&
      !Object.keys(selectedSensorsAndColors).includes(e.target.name)
    ) {
      setSelectedSensorsAndColors({
        ...selectedSensorsAndColors,
        [e.target.name]: colorsMatchingSensors[e.target.name],
      });
    } else if (
      !e.target.checked &&
      Object.keys(selectedSensorsAndColors).includes(e.target.name)
    ) {
      const { [e.target.name]: _, ...reducedSensorsAndColors } =
        selectedSensorsAndColors;
      setSelectedSensorsAndColors(reducedSensorsAndColors);
    }
  };

  const handleDropDown = (e, key) => {
    setColorsMatchingSensors({
      ...colorsMatchingSensors,
      [key]: e,
    });
    if (Object.keys(selectedSensorsAndColors).includes(key)) {
      setSelectedSensorsAndColors({
        ...selectedSensorsAndColors,
        [key]: e,
      });
    }
  };

  const initialSensorAndColors = {};
  Object.entries(selectedSensorsAndColors).forEach(([key, value]) => {
    const coloredIcon = <FundFilled style={{ color: value, fontSize: 16 }} />;
    initialSensorAndColors[key] = coloredIcon;
  });

  return (
    <List
      bordered
      dataSource={dataArray}
      renderItem={(item) => (
        <List.Item>
          <Checkbox
            defaultChecked={
              Object.keys(initialSensorAndColors).includes(item) && true
            }
            name={item}
            onChange={handleCheckbox}
          >
            {item}
          </Checkbox>
          <div style={{ float: 'right' }}>
            <Select
              key={item}
              bordered={false}
              defaultValue={
                Object.keys(initialSensorAndColors).includes(item) &&
                initialSensorAndColors[item]
              }
              onChange={(e) => handleDropDown(e, item)}
            >
              {colorsArray.map((key) => {
                const menuIcon = (
                  <FundFilled style={{ color: key, fontSize: 16 }} />
                );
                return (
                  <Select.Option key={key} value={key}>
                    {menuIcon}
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        </List.Item>
      )}
    />
  );
}

SensorGraphList.propTypes = {
  dataRow: PropTypes.shape({
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
    cond_DiffRfgtPress: PropTypes.number,
    cond_SubcLiqTemp: PropTypes.number,
    cond_SubcLiqPress: PropTypes.number,
    cond_FanDischTemp: PropTypes.number,
    evap_SatRfgtTemp: PropTypes.number,
    evap_RfgtPoolTemp: PropTypes.number,
    evap_RfgtPress: PropTypes.number,
    evap_ApprchTemp: PropTypes.number,
    evap_EntWtrTemp: PropTypes.number,
    evap_LvgWtrTemp: PropTypes.number,
    evap_WtrFlowEsti: PropTypes.number,
    evap_OutdoorAirTemp: PropTypes.number,
  }).isRequired,
  selectedSensorsAndColors: PropTypes.objectOf(PropTypes.string).isRequired,
  setSelectedSensorsAndColors: PropTypes.func.isRequired,
};
