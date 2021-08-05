import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Layout,
  Row,
  Col,
  Menu,
  Dropdown,
  Button,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import {
  MenuFoldOutlined,
  UserOutlined,
  InfoCircleOutlined,
  EditOutlined,
  LogoutOutlined,
  MailOutlined,
  LockOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import '../styles/componentStyles/pageHeader.less';
import { Context } from '../context/Context';
import { LOGOUT } from '../constants/actionTypes';

export default function PageHeader({ showSidebar }) {
  const { user, dispatch } = useContext(Context);

  // handle user logout
  const handleLogout = () => {
    localStorage.removeItem('storedSelectedChiller');
    localStorage.removeItem('storedSensorsAndColors');
    dispatch({ type: LOGOUT });
  };

  // modal states
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // handle edit user
  const onEditUser = async (values) => {
    if (values.email !== undefined || values.password !== undefined) {
      setConfirmLoading(true);
      try {
        const apiURL = process.env.REACT_APP_API_URL;
        const userToken = process.env.REACT_APP_USER_TOKEN;
        let updatedUser = {};
        if (values.email !== undefined) {
          updatedUser = {
            ...updatedUser,
            email: values.email,
          };
        }
        if (values.password !== undefined) {
          updatedUser = {
            ...updatedUser,
            password: values.password,
          };
        }
        const res = await axios.put(`${apiURL}/user/${user._id}`, {
          ...updatedUser,
          userToken,
        });
        message.success(`Updated user: ${res.data.username}...`);
        setVisible(false);
        setConfirmLoading(false);
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        setConfirmLoading(false);
        message.error(`${error.name} - ${error.message}.`);
      }
    } else {
      message.error('Edit User Form does not contain any new values.');
    }
  };

  const onSubmitFailed = (values) => {
    message.error(`Form submission error for values: ${values}.`);
  };

  // handle modal
  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  // profile menu
  const profileMenu = (
    <Menu className='avatarMenu'>
      <Menu.Item key='1' className='avatarMenuItem'>
        <Button type='link'>Info</Button>
        &nbsp;&nbsp;&nbsp;
        <InfoCircleOutlined style={{ color: '#E8B339' }} />
      </Menu.Item>
      <Menu.Item key='2' className='avatarMenuItem'>
        <Button type='link' onClick={showModal}>
          Edit
        </Button>
        &nbsp;&nbsp;&nbsp;
        <EditOutlined style={{ color: '#E8B339' }} />
      </Menu.Item>
      <Menu.Item key='3' className='avatarMenuItem'>
        <Button type='link' onClick={handleLogout}>
          Logout
        </Button>
        &nbsp;&nbsp;&nbsp;
        <LogoutOutlined style={{ color: '#E8B339' }} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className='pageHeader'>
      <Row>
        <Col span={6}>
          <MenuFoldOutlined className='trigger' onClick={showSidebar} />
        </Col>
        <Col span={12} className='title'>
          <Link to='/'>
            <div className='titleWrapper'>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                height='100%'
                alt='logo'
              />
            </div>
          </Link>
        </Col>
        <Col span={6} className='avatar'>
          <Dropdown
            overlay={profileMenu}
            placement='bottomRight'
            trigger={['click']}
            className='avatarIcon'
          >
            <UserOutlined />
          </Dropdown>
        </Col>
      </Row>
      <Modal
        title='Change Email or Password'
        visible={visible}
        footer={null}
        closeIcon={<CloseOutlined onClick={handleCancel} />}
      >
        <Form
          name='editUserForm'
          onFinish={onEditUser}
          onFinishFailed={onSubmitFailed}
        >
          <Form.Item
            name='email'
            rules={[
              {
                type: 'email',
                message: 'Please enter a valid email!',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder='Email' />
          </Form.Item>
          <Form.Item name='password'>
            <Input
              prefix={<LockOutlined />}
              type='password'
              placeholder='Password'
            />
          </Form.Item>
          <Form.Item noStyle>
            <Button type='primary' htmlType='submit' isLoading={confirmLoading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout.Header>
  );
}

PageHeader.propTypes = {
  showSidebar: PropTypes.func.isRequired,
};
