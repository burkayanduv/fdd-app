import { Button, Form, Input, message, Select } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function OperatorAddChillerForm({ operatorUserData }) {
  const onAddChiller = async (values) => {
    if (
      operatorUserData.findIndex((user) => user.username === values.admin) !==
      -1
    ) {
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        const masterToken = process.env.REACT_APP_MASTER_TOKEN;
        const res = await axios.post(`${apiURL}/chiller/`, {
          chillerName: values.chillerName,
          admins: [values.admin],
          users: [values.admin],
          location: {
            type: 'Point',
            coordinates: [values.x, values.y],
          },
          connectionStatus: 'none',
          healthStatus: 'none',
          diagnosisTime: '',
          masterToken,
        });
        await axios.put(`${apiURL}/user/?user=${values.admin}`, {
          chillerName: values.chillerName,
          userToken,
          mode: 'ADD',
        });
        message.success(`Registered ${res.data.chillerName} to the system...`);
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        message.error(`${error.name} - ${error.message}.`);
      }
    } else {
      message.error(`User not found: ${values.admin}.`);
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  return (
    <Form
      name='addChillerForm'
      onFinish={onAddChiller}
      onFinishFailed={onSubmitFailed}
      className='chillerSubForm'
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item
        label='Chiller Name'
        name='chillerName'
        rules={[{ message: 'Please enter a valid chiller name!' }]}
      >
        <Input />
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
      <Form.Item label='Admin' name='admin'>
        <Select>
          {operatorUserData.map((user) => (
            <Select.Option key={user.username} value={user.username}>
              {user.username}
            </Select.Option>
          ))}
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

OperatorAddChillerForm.propTypes = {
  operatorUserData: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      password: PropTypes.string,
      chillers: PropTypes.arrayOf(PropTypes.string),
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      __v: PropTypes.number,
    })
  ).isRequired,
};
