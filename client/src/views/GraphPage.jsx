import { Card, Col, Layout, Row, Skeleton, Switch, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DataQueryForm from '../components/graph/DataQueryForm';
import FetchStatusChart from '../components/graph/FetchStatusChart';
import LargeGraph from '../components/graph/LargeGraph';
import PageFooter from '../components/PageFooter';
import PageHeader from '../components/PageHeader';
import SelectChillerForm from '../components/SelectChillerForm';
import SensorGraphList from '../components/graph/SensorGraphList';
import SidebarMenu from '../components/SidebarMenu';
import useLocalStorage from '../functions/useLocalStorage';

function GraphPage({
  selectedChiller,
  sensorData,
  isLoading,
  fetchSensorData,
  handleFormSelectChiller,
  defaultSelectedSensor,
}) {
  // sidebar states and functions
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // sensor and color selection state
  const [selectedSensorsAndColors, setSelectedSensorsAndColors] = useState({});
  const [selectedSensorsAndColorsLocal, setSelectedSensorsAndColorsLocal] =
    useLocalStorage('storedSensorsAndColors', '');

  const handleSetSelectedSensorsAndColors = (newState) => {
    setSelectedSensorsAndColors(newState);
    setSelectedSensorsAndColorsLocal(JSON.stringify(newState));
  };

  // new query request prepared in form
  const [isNewQuery, setIsNewQuery] = useState(false);

  // state for drawing graphs
  const [isParsing, setIsParsing] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // state for real-time data fetching
  const [isRealtime, setIsRealtime] = useState(false);

  // fetch data when chiller changes and loading chiller also use locally stored selected sensors colors
  useEffect(() => {
    if (isLoading) {
      fetchSensorData(selectedChiller._id, 20);
    } else if (isParsing) {
      if (selectedSensorsAndColorsLocal !== '') {
        setSelectedSensorsAndColors(JSON.parse(selectedSensorsAndColorsLocal));
      }
      setIsParsing(false);
    } else {
      if (
        (defaultSelectedSensor !== '' &&
          Object.keys(selectedSensorsAndColors).length === 0) ||
        (defaultSelectedSensor !== '' &&
          !Object.keys(selectedSensorsAndColors).includes(
            defaultSelectedSensor
          ))
      ) {
        handleSetSelectedSensorsAndColors({
          ...selectedSensorsAndColors,
          [defaultSelectedSensor]: '#854eca',
        });
      }
      setIsReady(true);
    }
  }, [selectedChiller, isLoading, isParsing]);

  // main chart component
  let mainChart;
  if (Object.keys(selectedSensorsAndColors).length === 0) {
    mainChart = (
      <div
        style={{
          height: '680px',
          width: '1296px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>Please select the values to be displayed...</p>
      </div>
    );
  } else if (isLoading) {
    mainChart = (
      <div
        style={{
          height: '680px',
          width: '1296px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p>Loading...</p>
      </div>
    );
  } else {
    mainChart = (
      <LargeGraph
        data={sensorData}
        selectedSensorsAndColors={selectedSensorsAndColors}
        isRealtime={isRealtime}
        selectedChillerId={selectedChiller._id}
      />
    );
  }

  // skeleton for list
  const skeletonListRow = [...Array(17).keys()]
    .slice(1)
    .map((e) => (
      <Skeleton.Input
        key={e}
        active
        size='small'
        style={{ width: 192, marginTop: '21px' }}
      />
    ));

  return (
    <Layout>
      <SidebarMenu isVisible={sidebarVisible} onClose={closeSidebar} />
      <Layout>
        <PageHeader showSidebar={openSidebar} />
        <Layout.Content>
          <Row style={{ margin: '8px' }}>
            <Col xxl={{ span: 4, order: 1 }} xs={{ span: 24, order: 2 }}>
              <Card
                title='Chiller Selection'
                size='small'
                className='cardWrapper'
                style={{ height: '120px' }}
              >
                {!isReady || isRealtime ? (
                  <div style={{ marginTop: '16px' }}>
                    <Skeleton.Input
                      style={{ width: 224 }}
                      active
                      size='large'
                    />
                  </div>
                ) : (
                  <Card type='inner'>
                    <SelectChillerForm
                      selectedChillerName={selectedChiller.chillerName}
                      handleFormSelectChiller={handleFormSelectChiller}
                    />
                  </Card>
                )}
              </Card>
              <Card
                title='Sensor Selection'
                size='small'
                className='cardWrapper'
                style={{
                  overflow: 'auto',
                  height: '745px',
                }}
              >
                {!isReady || isRealtime ? (
                  <div>{skeletonListRow}</div>
                ) : (
                  <SensorGraphList
                    dataRow={sensorData[sensorData.length - 1]}
                    selectedSensorsAndColors={selectedSensorsAndColors}
                    setSelectedSensorsAndColors={
                      handleSetSelectedSensorsAndColors
                    }
                  />
                )}
              </Card>
            </Col>
            <Col xxl={{ span: 20, order: 2 }} xs={{ span: 24, order: 1 }}>
              <Row>
                <div
                  style={{
                    height: '657px',
                    width: '100%',
                    marginTop: '30px',
                    marginBottom: '30px',
                    marginRight: '10px',
                    margingLeft: '10px',
                    paddingRight: '30px',
                    paddingLeft: '10px',
                  }}
                >
                  {' '}
                  {isReady && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        float: 'right',
                        marginRight: '30px',
                        marginBottom: '-50px',
                        marginTop: '30px',
                        position: 'relative',
                        zIndex: '1',
                      }}
                    >
                      <Typography.Text style={{ fontSize: '14px' }}>
                        Real-time Data
                      </Typography.Text>
                      &nbsp; &nbsp; &nbsp;
                      <Switch onChange={() => setIsRealtime(!isRealtime)} />
                    </div>
                  )}
                  {mainChart}
                </div>
              </Row>
              <Row>
                <Col xxl={{ span: 19 }} xs={{ span: 24 }}>
                  <Card
                    title='Database Connection Status'
                    size='small'
                    className='cardWrapper'
                  >
                    <FetchStatusChart
                      isLoading={isLoading}
                      isNewQuery={isNewQuery}
                      isRealtime={isRealtime}
                    />
                  </Card>
                  <PageFooter />
                </Col>
                <Col xxl={{ span: 5 }} xs={{ span: 24 }}>
                  <Card title='Query Data' size='small' className='cardWrapper'>
                    {!isReady || isRealtime ? (
                      <div>
                        <Row>
                          <Skeleton.Input
                            active
                            size='small'
                            style={{ width: 230, marginBottom: '15px' }}
                          />
                          <Skeleton.Input
                            active
                            size='small'
                            style={{ width: 230, marginBottom: '15px' }}
                          />
                        </Row>
                        <Row justify='end'>
                          <div style={{ marginRight: '2px' }}>
                            <Skeleton.Button active size='small' />
                          </div>
                        </Row>
                      </div>
                    ) : (
                      <DataQueryForm
                        isNewQuery={isNewQuery}
                        setIsNewQuery={setIsNewQuery}
                        fetchSensorData={fetchSensorData}
                        selectedChiller={selectedChiller}
                      />
                    )}
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default GraphPage;

GraphPage.propTypes = {
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
  sensorData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      chillerId: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      __v: PropTypes.number,
      comp_CompCurrent: PropTypes.number,
      comp_DiffPress: PropTypes.number,
      comp_DischSupe: PropTypes.number,
      comp_DischTemp: PropTypes.number,
      comp_MassFlow: PropTypes.number,
      comp_SuctPress: PropTypes.number,
      cond_SatRfgtTemp: PropTypes.number,
      cond_DischSatTemp: PropTypes.number,
      cond_DischSubc: PropTypes.number,
      cond_RfgtPress: PropTypes.number,
      cond_DiffRfgtPress: PropTypes.number,
      cond_SubcLiqTemp: PropTypes.number,
      cond_SubcLiqPress: PropTypes.number,
      cond_FanDischTemp: PropTypes.number,
      evap_SatRfgtTemp: PropTypes.number,
      evap_RfgtPoolTemp: PropTypes.number,
      evap_RfgtPress: PropTypes.number,
      evap_ApprchTemp: PropTypes.number,
      evap_EntWtrTemp: PropTypes.number,
      evap_LvgWtrTemp: PropTypes.number,
      evap_WtrFlowEsti: PropTypes.number,
      evap_OutdoorAirTemp: PropTypes.number,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  fetchSensorData: PropTypes.func.isRequired,
  handleFormSelectChiller: PropTypes.func.isRequired,
  defaultSelectedSensor: PropTypes.string.isRequired,
};
