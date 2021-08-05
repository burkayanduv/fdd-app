import { Form, Button, DatePicker, InputNumber, message } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function DataQueryForm({
  isNewQuery,
  setIsNewQuery,
  fetchSensorData,
  selectedChiller,
}) {
  const [limitDisabled, setLimitDisabled] = useState(false);
  const [rangeDisabled, setRangeDisabled] = useState(false);

  const onFinish = (values) => {
    if (
      !(values.range === undefined || values.range === null) &&
      !(values.limit === undefined || values.limit === null)
    ) {
      message.error('Please choose only one option to query.');
    } else if (
      !(values.range === undefined || values.range === null) ||
      !(values.limit === undefined || values.limit === null)
    ) {
      if (!(values.limit === undefined || values.limit === null)) {
        try {
          fetchSensorData(selectedChiller._id, values.limit);
          message.success(
            `Queried ${selectedChiller.chillerName} with data limit: ${values.limit}`
          );
        } catch (error) {
          message.error(`${error.name} - ${error.message}.`);
        }
      } else {
        try {
          fetchSensorData(
            selectedChiller._id,
            20,
            values.range[0]._d,
            values.range[1]._d
          );
          message.success(
            `Queried ${selectedChiller.chillerName} within the specified dates.`
          );
        } catch (error) {
          message.error(`${error.name} - ${error.message}.`);
        }
      }
    } else {
      message.error('Query option is not chosen.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error(`Form submission error - ${errorInfo}.`);
  };

  const handleNumberChange = (value) => {
    if (value) {
      setIsNewQuery(true);
      setRangeDisabled(true);
    } else {
      setIsNewQuery(false);
      setRangeDisabled(false);
    }
  };

  const handleRangeChange = (value) => {
    if (value === null) {
      setIsNewQuery(false);
      setLimitDisabled(false);
    } else {
      setIsNewQuery(true);
      setLimitDisabled(true);
    }
  };

  return (
    <Form
      name='sensordata-query-form'
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size='small'
      style={{ marginBottom: '-16px' }}
    >
      <Form.Item label='Time' name='range'>
        <DatePicker.RangePicker
          showTime
          allowClear
          disabled={rangeDisabled}
          onChange={handleRangeChange}
        />
      </Form.Item>
      <Form.Item label='Last'>
        <Form.Item name='limit' noStyle>
          <InputNumber
            min={20}
            max={100}
            onChange={handleNumberChange}
            disabled={limitDisabled}
          />
        </Form.Item>
        <span className='ant-form-text'> # of rows</span>
      </Form.Item>
      <Form.Item
        style={{ float: 'right', marginRight: '2px', marginBottom: '0px' }}
      >
        <Button type='primary' htmlType='submit' disabled={!isNewQuery}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

DataQueryForm.propTypes = {
  isNewQuery: PropTypes.bool.isRequired,
  setIsNewQuery: PropTypes.func.isRequired,
  fetchSensorData: PropTypes.func.isRequired,
  selectedChiller: PropTypes.shape({
    location: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    users: PropTypes.arrayOf(PropTypes.string),
    admins: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
    chillerName: PropTypes.string,
    connectionStatus: PropTypes.string,
    healthStatus: PropTypes.string,
    diagnosisTime: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    __v: PropTypes.number,
  }).isRequired,
};
