import { Button, Form, message, Select } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function OperatorDeleteUserForm({ operatorUserData }) {
  const onDeleteUser = async (values) => {
    try {
      const chosenUser = operatorUserData.find(
        (user) => user.username === values.username
      );
      const apiURL = process.env.REACT_APP_API_URL;
      const userToken = process.env.REACT_APP_USER_TOKEN;
      await axios.delete(
        `${apiURL}/user/${chosenUser._id}?userToken=${userToken}`
      );
      message.success(`Deleted user: ${values.username} from the system...`);
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      message.error(`${error.name} - ${error.message}.`);
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  return (
    <Form
      name='deleteUserForm'
      onFinish={onDeleteUser}
      onFinishFailed={onSubmitFailed}
      className='chillerSubForm'
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item label='Userame' name='username'>
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
          danger
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

OperatorDeleteUserForm.propTypes = {
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
