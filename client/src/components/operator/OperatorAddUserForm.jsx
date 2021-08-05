import { Button, Form, message, Select } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function OperatorAddUserForm({
  operatorChillerData,
  operatorUserData,
}) {
  const onAddChiller = async (values) => {
    const chosenChiller = operatorChillerData.find(
      (chiller) => chiller.chillerName === values.chillerName
    );
    if (!chosenChiller.users.includes(values.username)) {
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        const masterToken = process.env.REACT_APP_MASTER_TOKEN;
        const res = await axios.put(`${apiURL}/chiller/${chosenChiller._id}`, {
          users: [...chosenChiller.users, values.username],
          admins: [...chosenChiller.admins, values.username],
          userToken,
          masterToken,
        });
        await axios.put(`${apiURL}/user/?user=${values.username}`, {
          chillerName: values.chillerName,
          userToken,
          mode: 'ADD',
        });
        message.success(
          `Registered ${values.username} to chiller ${res.data.chillerName}...`
        );
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        message.error(`${error.name} - ${error.message}.`);
      }
    } else {
      message.error(
        `${values.username} is already a user of ${values.chillerName}.`
      );
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  return (
    <Form
      name='addUserForm'
      onFinish={onAddChiller}
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
      <Form.Item label='Username' name='username'>
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

OperatorAddUserForm.propTypes = {
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
