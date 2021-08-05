import { useContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Row, Col, Form, Input, Button, Checkbox, Layout, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
} from '../constants/actionTypes';
import { Context } from '../context/Context';

export default function LoginPage() {
  const { dispatch } = useContext(Context);
  const location = useLocation();
  const history = useHistory();

  const [error, setError] = useState(false);
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async ({ username, password }) => {
    setIsLoading(true);
    dispatch({ type: LOGIN_START });
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          username,
          password,
        }
      );
      setIsLoading(false);
      dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    } catch (err) {
      setIsLoading(false);
      setError(true);
      setResponse('Login error, please try again...');
      dispatch({ type: LOGIN_FAILURE });
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      setIsLoading(false);
      history.push('/login');
    } catch (err) {
      setIsLoading(false);
      setError(true);
      setResponse('Oops, something went wrong...');
    }
  };

  return (
    <Layout
      style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/SJTU-bg.jpg)`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Layout.Header
        className='pageHeader'
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      >
        <Row>
          <Col span={12} offset={6} className='title'>
            <div className='titleWrapper'>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/logo.png`}
                height='100%'
                alt='logo'
              />
            </div>
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content>
        <Row
          align='middle'
          style={{
            height: '100vh',
            marginTop: '-80px',
            marginBottom: '-40px',
          }}
        >
          <Col span={14} offset={5}>
            <Row justify='center'>
              <Card
                title={location.pathname === '/login' ? 'Login' : 'Register'}
                headStyle={{ textAlign: 'center' }}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  width: '300px',
                }}
              >
                <Form
                  name='loginRegisterForm'
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={
                    location.pathname === '/login'
                      ? handleLogin
                      : handleRegister
                  }
                >
                  <Form.Item
                    name='username'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter a username!',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder='Username' />
                  </Form.Item>
                  {location.pathname === '/register' && (
                    <Form.Item
                      name='email'
                      rules={[
                        {
                          required: true,
                          type: 'email',
                          message: 'Please enter a valid email!',
                        },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder='Email' />
                    </Form.Item>
                  )}
                  <Form.Item
                    name='password'
                    rules={[
                      {
                        required: true,
                        message: 'Please enter a password!',
                      },
                    ]}
                  >
                    <Input
                      prefix={<LockOutlined />}
                      type='password'
                      placeholder='Password'
                    />
                  </Form.Item>
                  {location.pathname === '/login' && (
                    <Form.Item>
                      <Form.Item
                        name='remember'
                        valuePropName='checked'
                        noStyle
                      >
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>

                      <a style={{ float: 'right' }} href='/register'>
                        Forgot password
                      </a>
                    </Form.Item>
                  )}
                  <Form.Item>
                    <Button
                      type='primary'
                      htmlType='submit'
                      style={{ width: '100%' }}
                      loading={isLoading}
                    >
                      {location.pathname === '/login' ? 'Login' : 'Sign up'}
                    </Button>
                  </Form.Item>
                  {error && (
                    <Form.Item style={{ color: '#cf1322' }}>
                      {response}
                    </Form.Item>
                  )}
                  {location.pathname === '/login' ? (
                    <Form.Item>
                      Don&apos;t have an account?{' '}
                      <a href='/register'>Register</a>
                    </Form.Item>
                  ) : (
                    <Form.Item>
                      Already have an account? <a href='/login'>Log in</a>
                    </Form.Item>
                  )}
                </Form>
              </Card>
            </Row>
          </Col>
        </Row>
      </Layout.Content>
      <Layout.Footer
        style={{
          padding: '10px',
          textAlign: 'center',
          position: 'fixed',
          bottom: '0',
          left: '50%',
          marginLeft: '-150px',
          width: '300px',
          backgroundColor: 'rgba(0,0,0,0)',
        }}
      >
        Created by Burkay Anduv © 2021
      </Layout.Footer>
    </Layout>
  );
}
