import { Button, Card, Col, Layout, Row } from 'antd';
import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SidebarMenu from '../components/SidebarMenu';
import PageHeader from '../components/PageHeader';
import ChillerTable from '../components/atlas/ChillerTable';
import ChillerForm from '../components/atlas/ChillerForm';
import PageFooter from '../components/PageFooter';
import ChillerMap from '../components/atlas/ChillerMap';
import { Context } from '../context/Context';
import ChillerHealth from '../components/ChillerHealth';
import ChillerInfo from '../components/atlas/ChillerInfo';

function AtlasPage({
  selectedChiller,
  handleSelectChiller,
  handleLinkSelectChiller,
  chillerData,
  updateRefLoadPreds,
}) {
  // user context
  const { user } = useContext(Context);

  // sidebar states and functions
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // chiller users and admin state
  const [chillerUsers, setChillerUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // assign chiller users and whether is admin
  useEffect(() => {
    if (Object.keys(selectedChiller).length === 0) return;
    setChillerUsers(selectedChiller.users);
    setIsAdmin(selectedChiller.admins.includes(user.username));
  }, [selectedChiller]);

  return (
    <Layout>
      <SidebarMenu isVisible={sidebarVisible} onClose={closeSidebar} />
      <Layout>
        <PageHeader showSidebar={openSidebar} />
        <Layout.Content>
          <Row style={{ margin: '8px' }}>
            <Col xxl={{ span: 6, order: 1 }} xs={{ span: 24, order: 2 }}>
              <Card
                title='Chiller Info'
                size='small'
                className='cardWrapper'
                extra={<Link to='/home'>{selectedChiller.chillerName}</Link>}
              >
                <ChillerInfo selectedChiller={selectedChiller} />
              </Card>
              <Card
                title='Chiller Admin'
                size='small'
                className='cardWrapper'
                extra={<Link to='/home'>{selectedChiller.chillerName}</Link>}
              >
                <ChillerForm
                  isAdmin={isAdmin}
                  chillerUsers={chillerUsers}
                  selectedChiller={selectedChiller}
                />
              </Card>
            </Col>
            <Col xxl={{ span: 12, order: 2 }} xs={{ span: 24, order: 1 }}>
              <div
                style={{
                  marginTop: '9px',
                  marginBottom: '9px',
                  height: 'calc(100vh - 133px)',
                }}
              >
                <ChillerMap
                  chillerData={chillerData}
                  handleClick={handleSelectChiller}
                  selectedChiller={selectedChiller.chillerName}
                />
              </div>
              <PageFooter />
            </Col>
            <Col xxl={{ span: 6, order: 3 }} xs={{ span: 24, order: 3 }}>
              <Card
                title='Chiller Health'
                size='small'
                className='cardWrapper'
                extra={
                  <Button
                    type='link'
                    size='small'
                    onClick={() => updateRefLoadPreds(selectedChiller._id)}
                  >
                    Refresh
                  </Button>
                }
              >
                <ChillerHealth selectedChiller={selectedChiller} />
              </Card>
              <Card
                title='Chiller List'
                size='small'
                className='cardWrapper'
                style={{
                  height: '729px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                }}
              >
                <ChillerTable
                  chillerData={chillerData}
                  handleClick={handleLinkSelectChiller}
                />
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default AtlasPage;

AtlasPage.propTypes = {
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
  }),
  handleSelectChiller: PropTypes.func.isRequired,
  handleLinkSelectChiller: PropTypes.func.isRequired,
  chillerData: PropTypes.arrayOf(
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
  updateRefLoadPreds: PropTypes.func.isRequired,
};

AtlasPage.defaultProps = {
  selectedChiller: {
    chillerName: '',
    users: [],
    admins: [],
  },
};
