import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  message,
  Row,
  Typography,
} from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { useContext } from 'react';
import { Context } from '../context/Context';
import { LOGOUT } from '../constants/actionTypes';

function UnavailablePage() {
  const { dispatch } = useContext(Context);

  const handleSubmit = (values) => {
    if (values.length === 24) {
      message.warning('This function has not been implemented yet :(');
    } else {
      message.error(`Invalid key: ${values.key} - Please try again...`);
    }
  };

  const handleGoBack = () => {
    localStorage.removeItem('storedSelectedChiller');
    localStorage.removeItem('storedSensorsAndColors');
    dispatch({ type: LOGOUT });
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
                style={{ cursor: 'pointer' }}
                onClick={handleGoBack}
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
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  width: '600px',
                }}
              >
                <center>
                  <Typography.Text style={{ fontSize: '24px' }}>
                    No Chillers Assigned
                  </Typography.Text>
                  <br />
                  <Typography.Text style={{ fontSize: '14px' }}>
                    - Below are some options -
                  </Typography.Text>
                </center>
                <br />
                <Alert
                  message='Enter Registration Key'
                  description='Enter the key given to you by technical support to assign your chiller.'
                  type='success'
                  showIcon
                  action={
                    <div style={{ marginBottom: '-14px' }}>
                      <Form name='help request form' onFinish={handleSubmit}>
                        <Form.Item
                          name='key'
                          rules={[
                            {
                              required: true,
                              message: 'Please enter a key!',
                            },
                          ]}
                        >
                          <Input
                            prefix={<KeyOutlined />}
                            placeholder='Registration Key'
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type='primary'
                            htmlType='submit'
                            style={{ width: '100%' }}
                            loading={false}
                          >
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  }
                />
                <br />
                <Alert
                  message='Contact Chiller Admin'
                  description='Chiller admins can also add their chillers to your account.'
                  type='success'
                  showIcon
                />
                <br />
                <Alert
                  message='Demo the Website'
                  description='Use default credientials - test : pass'
                  type='success'
                  showIcon
                />
                <br />
                <center>
                  <Button type='link' onClick={handleGoBack}>
                    Go Back
                  </Button>
                </center>
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

export default UnavailablePage;
