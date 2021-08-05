import { Drawer, Menu, Typography } from 'antd';
import {
  BranchesOutlined,
  LineChartOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MailOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import PropTypes from 'prop-types';
import '../styles/componentStyles/sidebarMenu.less';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { LOGOUT } from '../constants/actionTypes';

export default function SidebarMenu({ isVisible, onClose }) {
  const { dispatch } = useContext(Context);

  const handleLogout = () => {
    localStorage.removeItem('storedSelectedChiller');
    localStorage.removeItem('storedSensorsAndColors');
    dispatch({ type: LOGOUT });
  };

  const location = useLocation();

  return (
    <Drawer
      placement='left'
      closable={false}
      onClose={onClose}
      visible={isVisible}
    >
      <Link to='/'>
        <div className='sidebarIcon'>
          <img
            src={`${process.env.PUBLIC_URL}/assets/icon/icon.png`}
            height='100%'
            alt='icon'
            style={{ cursor: 'pointer' }}
            href='/'
          />
        </div>
      </Link>
      <Menu
        theme='dark'
        mode='inline'
        defaultSelectedKeys={[location.pathname]}
      >
        <Menu.Item
          key='/'
          icon={<EnvironmentOutlined style={{ fontSize: '150%' }} />}
          className='menuItem'
        >
          <Link to='/'>
            <Typography.Text className='sidebarText'>
              Chiller Selection
            </Typography.Text>
          </Link>
        </Menu.Item>
        <Menu.Item
          key='/home'
          icon={<BranchesOutlined style={{ fontSize: '150%' }} />}
          className='menuItem'
        >
          <Link to='/home'>
            <Typography.Text className='sidebarText'>
              Chiller Dashboard
            </Typography.Text>
          </Link>
        </Menu.Item>
        <Menu.Item
          key='/graph'
          icon={<LineChartOutlined style={{ fontSize: '150%' }} />}
          className='menuItem'
        >
          <Link to='/graph'>
            <Typography.Text className='sidebarText'>
              Data Graph
            </Typography.Text>
          </Link>
        </Menu.Item>
        <Menu.Item
          key='/about'
          icon={<InfoCircleOutlined style={{ fontSize: '150%' }} />}
          className='menuItem'
        >
          <Typography.Text className='sidebarText'>About</Typography.Text>
        </Menu.Item>
        <Menu.Item
          key='/contact'
          icon={<MailOutlined style={{ fontSize: '150%' }} />}
          className='menuItem'
        >
          <Link
            to={{ pathname: 'https://www.linkedin.com/in/burkayanduv/' }}
            target='_blank'
          >
            <Typography.Text className='sidebarText'>Contact</Typography.Text>
          </Link>
        </Menu.Item>
        <Menu.Item
          key='6'
          icon={<LogoutOutlined style={{ fontSize: '150%' }} />}
          className='menuItem'
          onClick={handleLogout}
        >
          <Typography.Text className='sidebarText'>Logout</Typography.Text>
        </Menu.Item>
      </Menu>
    </Drawer>
  );
}

SidebarMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
