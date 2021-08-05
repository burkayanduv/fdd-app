import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Layout, message, Row } from 'antd';
import axios from 'axios';
import { Context } from '../context/Context';
import { LOGOUT } from '../constants/actionTypes';
import PageFooter from '../components/PageFooter';
import OperatorChillerList from '../components/operator/OperatorChillerList';
import OperatorUserList from '../components/operator/OperatorUserList';
import OperatorAddChillerForm from '../components/operator/OperatorAddChillerForm';
import OperatorDeleteChillerForm from '../components/operator/OperatorDeleteChillerForm';
import OperatorUpdateChillerForm from '../components/operator/OperatorUpdateChillerForm';
import OperatorAddUserForm from '../components/operator/OperatorAddUserForm';
import OperatorDeleteUserForm from '../components/operator/OperatorDeleteUserForm';

function OperatorPage() {
  const { dispatch } = useContext(Context);

  const handleGoBack = () => {
    localStorage.removeItem('storedSelectedChiller');
    localStorage.removeItem('storedSensorsAndColors');
    dispatch({ type: LOGOUT });
  };

  const [operatorUserData, setOperatorUserData] = useState([]);
  const [operatorChillerData, setOperatorChillerData] = useState([]);

  const fetchUsersAndChillersList = async () => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const getToken = process.env.REACT_APP_GET_TOKEN;
      const res1 = await axios.get(
        `${apiURL}/user/?user=/&getToken=${getToken}`
      );
      setOperatorUserData(res1.data);
      const res2 = await axios.get(
        `${apiURL}/chiller/?user=/&getToken=${getToken}`
      );
      setOperatorChillerData(res2.data);
    } catch (error) {
      message.error(`${error.name} - (sensor) - ${error.message}.`);
    }
  };

  useEffect(() => {
    fetchUsersAndChillersList();
  }, []);

  return (
    <Layout>
      <Layout.Header className='pageHeader'>
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
          <Col span={6}>
            <div
              style={{
                justifyContent: 'center',
                textAlign: 'right',
                marginRight: '16px',
              }}
            >
              <Button type='link' onClick={handleGoBack} size='large'>
                Logout
              </Button>
            </div>
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content>
        <Row style={{ margin: '8px' }}>
          <Col xxl={{ span: 6, order: 1 }} xs={{ span: 24, order: 2 }}>
            <Card
              title='Users List'
              size='small'
              className='cardWrapper'
              style={{ height: '873px' }}
            >
              <OperatorUserList userData={operatorUserData} />
            </Card>
          </Col>
          <Col xxl={{ span: 12, order: 2 }} xs={{ span: 24, order: 1 }}>
            <Row>
              <Col span={24}>
                <Card
                  title='Add User to a Chiller'
                  size='small'
                  className='cardWrapper'
                >
                  <OperatorAddUserForm
                    operatorUserData={operatorUserData}
                    operatorChillerData={operatorChillerData}
                  />
                </Card>

                <Card
                  title='Add Chiller'
                  size='small'
                  className='cardWrapper'
                  style={{ marginTop: '-2px' }}
                >
                  <OperatorAddChillerForm operatorUserData={operatorUserData} />
                </Card>

                <Card
                  title='Update Chiller'
                  size='small'
                  className='cardWrapper'
                  style={{ marginTop: '-2px' }}
                >
                  <OperatorUpdateChillerForm
                    operatorChillerData={operatorChillerData}
                  />
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: '-10px', marginBottom: '-6px' }}>
              <Col span={12}>
                <Card title='Delete User' size='small' className='cardWrapper'>
                  <OperatorDeleteUserForm operatorUserData={operatorUserData} />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title='Delete Chiller'
                  size='small'
                  className='cardWrapper'
                >
                  <OperatorDeleteChillerForm
                    operatorChillerData={operatorChillerData}
                  />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <PageFooter />
              </Col>
            </Row>
          </Col>
          <Col xxl={{ span: 6, order: 3 }} xs={{ span: 24, order: 3 }}>
            <Card
              title='Chillers List'
              size='small'
              className='cardWrapper'
              style={{ height: '873px' }}
            >
              <OperatorChillerList chillerData={operatorChillerData} />
            </Card>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}

export default OperatorPage;
