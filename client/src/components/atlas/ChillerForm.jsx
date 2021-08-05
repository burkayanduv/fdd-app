import { useContext } from 'react';
import axios from 'axios';
import { Button, Card, Form, Input, message, Select, Switch } from 'antd';
import PropTypes from 'prop-types';
import { Context } from '../../context/Context';
import '../../styles/componentStyles/chillerForm.less';
import {
  UPDATE_FAILURE,
  UPDATE_START,
  UPDATE_SUCCESS,
} from '../../constants/actionTypes';

export default function ChillerForm({
  isAdmin,
  chillerUsers,
  selectedChiller,
}) {
  const { user, dispatch } = useContext(Context);

  const onAddUser = async (values) => {
    if (
      isAdmin &&
      values.username !== undefined &&
      values.switch !== undefined
    ) {
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        let adminsList;
        if (
          values.switch &&
          !selectedChiller.admins.includes(values.username)
        ) {
          adminsList = [...selectedChiller.admins, values.username];
        } else {
          adminsList = [...selectedChiller.admins];
        }
        let usersList;
        if (!selectedChiller.users.includes(values.username)) {
          usersList = [...selectedChiller.users, values.username];
        } else {
          usersList = [...selectedChiller.users];
        }
        const res = await axios.put(
          `${apiURL}/chiller/${selectedChiller._id}`,
          {
            ...selectedChiller,
            users: usersList,
            admins: adminsList,
            userName: user.username,
            userToken,
          }
        );
        await axios.put(`${apiURL}/user/?user=${values.username}`, {
          chillerName: selectedChiller.chillerName,
          userToken,
          mode: 'ADD',
        });
        if (values.switch) {
          message.success(
            `Registered ${values.username} to ${res.data.chillerName} as admin...`
          );
        } else {
          message.success(
            `Registered ${values.username} to ${res.data.chillerName}...`
          );
        }
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        message.error(`${error.name} - ${error.message}.`);
      }
    }
  };

  const onRenameChiller = async (values) => {
    if (isAdmin && values.chillerName !== undefined) {
      dispatch({ type: UPDATE_START });
      const updatedUser = {
        ...user,
        chillers: user.chillers.map((mappedChiller) =>
          mappedChiller === selectedChiller.chillerName
            ? values.chillerName
            : mappedChiller
        ),
      };
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        await axios.put(`${apiURL}/chiller/${selectedChiller._id}`, {
          ...selectedChiller,
          chillerName: values.chillerName,
          userName: user.username,
          userToken,
        });
        await axios.put(`${apiURL}/rename`, {
          userToken,
          userName: user.username,
          oldName: selectedChiller.chillerName,
          newName: values.chillerName,
        });
        message.success(
          `Renamed ${selectedChiller.chillerName} to ${values.chillerName}...`
        );
        dispatch({ type: UPDATE_SUCCESS, payload: updatedUser });
        localStorage.removeItem('storedSelectedChiller');
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        message.error(`${error.name} - ${error.message}.`);
        dispatch({ type: UPDATE_FAILURE });
      }
    }
  };
  const onRemoveUser = async (values) => {
    if (
      isAdmin &&
      values.username !== undefined &&
      values.username !== user.username
    ) {
      const newAdminsList = selectedChiller.admins;
      const adminIndex = selectedChiller.admins.indexOf(values.username);
      if (adminIndex > -1) {
        newAdminsList.splice(adminIndex, 1);
      }
      const newUsersList = selectedChiller.users;
      const userIndex = selectedChiller.users.indexOf(values.username);
      if (userIndex > -1) {
        newUsersList.splice(userIndex, 1);
      }
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        const res = await axios.put(
          `${apiURL}/chiller/${selectedChiller._id}`,
          {
            ...selectedChiller,
            users: newUsersList,
            admins: newAdminsList,
            userName: user.username,
            userToken,
          }
        );
        await axios.put(`${apiURL}/user/?user=${values.username}`, {
          chillerName: selectedChiller.chillerName,
          userToken,
          mode: 'REMOVE',
        });
        message.success(
          `Removed ${values.username} from ${res.data.chillerName}...`
        );
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        message.error(`${error.name} - ${error.message}.`);
      }
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  return (
    <>
      <Card
        type='inner'
        size='small'
        title='Add User'
        className='chillerFormInnerCard'
      >
        <Form
          name='addUserForm'
          onFinish={onAddUser}
          onFinishFailed={onSubmitFailed}
          className='chillerSubForm'
        >
          <Form.Item
            label='Username'
            name='username'
            rules={[{ message: 'Please enter a valid username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{
              textAlign: 'right',
            }}
          >
            <Form.Item
              label='Admin Rights'
              name='switch'
              valuePropName='checked'
              initialValue={false}
            >
              <Switch />
            </Form.Item>
            <Button type='primary' htmlType='submit' disabled={!isAdmin}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        type='inner'
        size='small'
        title='Rename Chiller'
        className='chillerFormInnerCard'
      >
        <Form
          name='renameChillerForm'
          onFinish={onRenameChiller}
          onFinishFailed={onSubmitFailed}
          className='chillerSubForm'
        >
          <Form.Item
            label='Chiller Name'
            name='chillerName'
            rules={[{ message: 'Please enter a chiller name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{
              textAlign: 'right',
            }}
          >
            <Button type='primary' htmlType='submit' disabled={!isAdmin}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        type='inner'
        size='small'
        title='Remove User'
        className='chillerFormInnerCard'
        style={{ marginBottom: '9px' }}
      >
        <Form
          name='removeUserForm'
          onFinish={onRemoveUser}
          onFinishFailed={onSubmitFailed}
          className='chillerSubForm'
        >
          <Form.Item label='Username' name='username'>
            <Select>
              {chillerUsers.map((chillerUser) => (
                <Select.Option key={chillerUser} value={chillerUser}>
                  {chillerUser}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            style={{
              textAlign: 'right',
            }}
          >
            <Button type='primary' htmlType='submit' disabled={!isAdmin}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

ChillerForm.propTypes = {
  isAdmin: PropTypes.bool,
  chillerUsers: PropTypes.arrayOf(PropTypes.string),
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

ChillerForm.defaultProps = {
  isAdmin: false,
  chillerUsers: [],
};
