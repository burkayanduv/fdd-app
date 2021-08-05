import { Button, Form, Input, message, Select } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function OperatorUpdateChillerForm({ operatorChillerData }) {
  const onUpdateChiller = async (values) => {
    if (
      (values.x !== undefined && values.y !== undefined) ||
      values.connectionStatus !== undefined
    ) {
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        const masterToken = process.env.REACT_APP_MASTER_TOKEN;
        const chosenChiller = operatorChillerData.find(
          (chiller) => chiller.chillerName === values.chillerName
        );
        let updatedChiller = {};
        if (values.location !== undefined) {
          updatedChiller = {
            ...updatedChiller,
            location: {
              type: 'Point',
              coordinates: [values.x, values.y],
            },
          };
        }
        if (values.connectionStatus !== undefined) {
          updatedChiller = {
            ...updatedChiller,
            connectionStatus: values.connectionStatus,
          };
        }
        const res = await axios.put(`${apiURL}/chiller/${chosenChiller._id}`, {
          ...updatedChiller,
          userToken,
          masterToken,
        });
        message.success(`Updated chiller: ${res.data.chillerName}...`);
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        message.error(`${error.name} - ${error.message}.`);
      }
    } else {
      message.error('Chiller Update Form does not contain any new values.');
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  return (
    <Form
      name='updateChillerForm'
      onFinish={onUpdateChiller}
      onFinishFailed={onSubmitFailed}
      className='chillerSubForm'
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item label='Chiller Name' name='chillerName'>
        <Select>
          {operatorChillerData.map((chiller) => (
            <Select.Option
              key={chiller.chillerName}
              value={chiller.chillerName}
            >
              {chiller.chillerName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label='Latitude'
        name='x'
        rules={[{ message: 'Please enter a valid X coordinate!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Longitude'
        name='y'
        rules={[{ message: 'Please enter a valid Y coordinate!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label='Connection Status' name='connectionStatus'>
        <Select>
          <Select.Option key='none' value='none'>
            none
          </Select.Option>
          <Select.Option key='ok' value='ok'>
            ok
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item noStyle>
        <Button
          type='primary'
          htmlType='submit'
          style={{
            display: 'flex',
            float: 'right',
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

OperatorUpdateChillerForm.propTypes = {
  operatorChillerData: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
};
