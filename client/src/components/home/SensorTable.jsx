import { Button, Table, Tag } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function SensorTable({
  dataRow,
  selectedComponent,
  handleClick,
  handleComponentClick,
}) {
  const [filteredComponent, setFilteredComponent] = useState({ component: [] });

  const dataArray = [];
  Object.keys(dataRow).forEach((key, index) => {
    if (!['_id', 'chillerId', 'createdAt', 'updatedAt', '__v'].includes(key)) {
      const [componentName, sensorName] = key.split('_');
      let componentLong;
      if (componentName === 'comp') {
        componentLong = 'Compressor';
      } else if (componentName === 'cond') {
        componentLong = 'Condenser';
      } else {
        componentLong = 'Evaporator';
      }

      const singleSensor = {};
      singleSensor.key = index;
      singleSensor.name = sensorName;
      singleSensor.component = componentLong;
      singleSensor.data = dataRow[key];
      singleSensor.time = dataRow.createdAt;
      singleSensor.status = dataRow[key] === '' ? 'error' : 'ok';
      dataArray.push(singleSensor);
    }
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Button
          style={{ paddingRight: '0px', paddingLeft: '0px' }}
          type='link'
          onClick={(e) => handleClick(e, text)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'component',
      key: 'component',
      render: (text) => (
        <Button
          style={{ paddingRight: '0px', paddingLeft: '0px' }}
          type='link'
          onClick={(e) => handleComponentClick(e, text)}
        >
          {text}
        </Button>
      ),
      filters: [
        {
          text: 'Compressor',
          value: 'Compressor',
        },
        {
          text: 'Condenser',
          value: 'Condenser',
        },
        {
          text: 'Evaporator',
          value: 'Evaporator',
        },
      ],
      onFilter: (value, record) => record.component.indexOf(value) === 0,
      filterMultiple: false,
      filteredValue: filteredComponent.component,
    },
    {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text) => (
        <>
          {new Date(text).toLocaleString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text) => (
        <>
          {[text].map((s) => {
            const color = s === 'ok' ? 'green' : 'volcano';
            const tag = s === 'ok' ? 'active' : 'error';
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  function onChange(filters) {
    setFilteredComponent(filters);
  }

  useEffect(() => {
    if (selectedComponent !== '')
      setFilteredComponent({ component: [selectedComponent] });
  }, [selectedComponent]);

  return (
    <Table
      columns={columns}
      dataSource={dataArray}
      onChange={onChange}
      pagination={{ pageSize: 8 }}
    />
  );
}

SensorTable.propTypes = {
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
  selectedComponent: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleComponentClick: PropTypes.func.isRequired,
};
