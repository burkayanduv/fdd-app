import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Row, Col, Card, Typography, Skeleton, Button } from 'antd';
import PropTypes from 'prop-types';
import SidebarMenu from '../components/SidebarMenu';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import GaugeChart from '../components/home/GaugeChart';
import AreaChart from '../components/home/AreaChart';
import MultiLineChart from '../components/home/MultiLineChart';
import ColumnChart from '../components/home/ColumnChart';
import RingProgressChart from '../components/home/RingProgressChart';
import SensorTable from '../components/home/SensorTable';
import '../styles/pageStyles/homePage.less';
import { ReactComponent as Schematic } from '../assets/schematic.svg';
import ChillerHealth from '../components/ChillerHealth';
import SelectChillerForm from '../components/SelectChillerForm';

function HomePage({
  selectedChiller,
  sensorData,
  isLoading,
  fetchSensorData,
  handleFormSelectChiller,
  setDefaultSelectedSensor,
  updateRefLoadPreds,
}) {
  // sidebar states and functions
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const openSidebar = () => {
    setSidebarVisible(true);
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  // selected sensor data states
  const [selectedSensor, setSelectedSensor] = useState('comp_MassFlow');
  const [selectedComponent, setSelectedComponent] = useState('');
  const handleSetSelectedSensor = (sensorName) => {
    setSelectedSensor(sensorName);
    setDefaultSelectedSensor(sensorName);
  };

  // sensor table links
  const handleLinkSelectSensor = (e, sensorName) => {
    e.preventDefault();
    const componentName =
      e.target.parentElement.parentElement.nextElementSibling.firstChild
        .firstChild.innerHTML;
    let componentShort = '';
    if (componentName === 'Compressor') {
      componentShort = 'comp';
    } else if (componentName === 'Condenser') {
      componentShort = 'cond';
    } else {
      componentShort = 'evap';
    }
    handleSetSelectedSensor(`${componentShort}_${sensorName}`);
  };

  const handleLinkSelectComponent = (e, componentName) => {
    e.preventDefault();
    setSelectedComponent(componentName);
  };

  // schematic data update
  const updateSchematic = (dataRow) => {
    Object.keys(dataRow).forEach((key) => {
      if (
        !['_id', 'chillerId', 'createdAt', 'updatedAt', '__v'].includes(key)
      ) {
        const elementId1 = `svg-${key}`;
        const elementId2 = `svg-${key}-2`;
        const svgElement1 = document.getElementById(elementId1);
        svgElement1.innerHTML = dataRow[key];
        const svgElement2 = document.getElementById(elementId2);
        svgElement2.innerHTML = dataRow[key];
      }
    });
  };

  // schematic click handlers
  const initClickListeners = (dataRow) => {
    Object.keys(dataRow).forEach((key) => {
      if (
        !['_id', 'chillerId', 'createdAt', 'updatedAt', '__v'].includes(key)
      ) {
        const elementId = `click-${key}`;
        const svgElement = document.getElementById(elementId);
        svgElement.addEventListener('click', () =>
          handleSetSelectedSensor(svgElement.id.split('-')[1])
        );
      }
    });
    const componentKeys = ['Condenser', 'Compressor', 'Evaporator'];
    componentKeys.forEach((key) => {
      const elementId = `click-${key}`;
      const svgElement = document.getElementById(elementId);
      svgElement.addEventListener('click', () =>
        setSelectedComponent(svgElement.id.split('-')[1])
      );
    });
  };

  const removeClickListeners = (dataRow) => {
    Object.keys(dataRow).forEach((key) => {
      if (
        !['_id', 'chillerId', 'createdAt', 'updatedAt', '__v'].includes(key)
      ) {
        const elementId = `click-${key}`;
        const svgElement = document.getElementById(elementId);
        svgElement.removeEventListener('click', () =>
          handleSetSelectedSensor(svgElement.id.split('-')[1])
        );
      }
    });
    const componentKeys = ['Condenser', 'Compressor', 'Evaporator'];
    componentKeys.forEach((key) => {
      const elementId = `click-${key}`;
      const svgElement = document.getElementById(elementId);
      svgElement.removeEventListener('click', () =>
        setSelectedComponent(svgElement.id.split('-')[1])
      );
    });
  };

  useEffect(() => {
    if (isLoading) {
      fetchSensorData(selectedChiller._id, 20);
    } else {
      updateSchematic(sensorData[sensorData.length - 1]);
      initClickListeners(sensorData[sensorData.length - 1]);
      return removeClickListeners(sensorData[sensorData.length - 1]);
    }
    return null;
  }, [selectedChiller, isLoading]);

  // skeleton for table
  const skeletonTableRow = [...Array(10).keys()].slice(1).map((e) => (
    <div
      key={e}
      style={{ marginBottom: '20px', marginRight: '-3px', marginLeft: '8px' }}
    >
      {' '}
      <center>
        <Skeleton.Button
          key={e * 10 + 1}
          active
          size='large'
          style={{ marginRight: '5px' }}
        />
        <Skeleton.Button
          key={e * 10 + 2}
          active
          size='large'
          style={{ marginRight: '5px' }}
        />
        <Skeleton.Button
          key={e * 10 + 3}
          active
          size='large'
          style={{ marginRight: '5px' }}
        />
        <Skeleton.Button
          key={e * 10 + 4}
          active
          size='large'
          style={{ marginRight: '5px' }}
        />
        <Skeleton.Button
          key={e * 10 + 5}
          active
          size='large'
          style={{ marginRight: '5px' }}
        />
      </center>
    </div>
  ));

  return (
    <Layout>
      <SidebarMenu isVisible={sidebarVisible} onClose={closeSidebar} />
      <Layout>
        <PageHeader showSidebar={openSidebar} />
        <Layout.Content>
          <Row style={{ margin: '8px' }}>
            <Col xxl={{ span: 6, order: 1 }} xs={{ span: 24, order: 2 }}>
              <Card
                title={`Sensor Data: ${selectedSensor}`}
                extra={<Link to='/graph'>Details</Link>}
                size='small'
                className='cardWrapper'
              >
                {isLoading ? (
                  <center>
                    <Skeleton.Avatar active shape='square' size={233} />
                  </center>
                ) : (
                  <div className='areaChartWrapper'>
                    <AreaChart data={sensorData} id={selectedSensor} />
                  </div>
                )}
              </Card>
              <Card
                title='Sensor Info'
                size='small'
                className='cardWrapper'
                style={{
                  height: '574px',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                }}
              >
                {isLoading ? (
                  <div style={{ marginTop: '10px' }}>
                    {skeletonTableRow}
                    <div style={{ float: 'right', marginRight: '45px' }}>
                      <Skeleton.Button active size='large' />
                    </div>
                  </div>
                ) : (
                  <SensorTable
                    dataRow={sensorData[sensorData.length - 1]}
                    selectedComponent={selectedComponent}
                    handleClick={handleLinkSelectSensor}
                    handleComponentClick={handleLinkSelectComponent}
                    style={{ marginBottom: '0px' }}
                  />
                )}
              </Card>
            </Col>
            <Col xxl={{ span: 12, order: 2 }} xs={{ span: 24, order: 1 }}>
              <div className='schematicTitle'>
                <Typography.Title level={3} style={{ color: '#D2D2D2' }}>
                  System Schematic
                </Typography.Title>
              </div>
              <div className='schematicWrapper'>
                <Schematic
                  style={{
                    width: '95%',
                    height: '95%',
                    minWidth: '760px',
                  }}
                  className='schematicSvg'
                />
              </div>
              <Card
                title='System Info'
                size='small'
                className='cardWrapper'
                extra={selectedChiller.chillerName}
              >
                <Row gutter={12}>
                  <Col xs={12}>
                    <Card type='inner'>
                      <div className='innerCardWrapper'>
                        {isLoading ? (
                          <Row justify='space-around'>
                            <div className='ringWrapper'>
                              <Skeleton.Avatar
                                active
                                shape='circle'
                                size={100}
                              />
                            </div>
                            <div className='ringWrapper'>
                              <Skeleton.Avatar
                                active
                                shape='circle'
                                size={100}
                              />
                            </div>
                            <div className='ringWrapper'>
                              <Skeleton.Avatar
                                active
                                shape='circle'
                                size={100}
                              />
                            </div>
                          </Row>
                        ) : (
                          <Row justify='space-around'>
                            <div className='ringWrapper'>
                              <RingProgressChart
                                chartTitle='SuctPress '
                                chartData={
                                  (55 -
                                    sensorData[sensorData.length - 1]
                                      .comp_SuctPress) /
                                  15
                                }
                              />
                            </div>
                            <div className='ringWrapper'>
                              <RingProgressChart
                                chartTitle='DiffPress '
                                chartData={
                                  (sensorData[sensorData.length - 1]
                                    .comp_DiffPress -
                                    90) /
                                  70
                                }
                              />
                            </div>
                            <div className='ringWrapper'>
                              <RingProgressChart
                                chartTitle='MassFlow '
                                chartData={
                                  (sensorData[sensorData.length - 1]
                                    .comp_MassFlow -
                                    60) /
                                  110
                                }
                              />
                            </div>
                          </Row>
                        )}
                      </div>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card
                      type='inner'
                      size='small'
                      title='System Health'
                      extra={
                        <Button
                          type='link'
                          size='small'
                          onClick={() =>
                            updateRefLoadPreds(selectedChiller._id)
                          }
                        >
                          Refresh
                        </Button>
                      }
                    >
                      <ChillerHealth selectedChiller={selectedChiller} />
                    </Card>
                  </Col>
                </Row>
              </Card>
              <PageFooter />
            </Col>
            <Col xxl={{ span: 6, order: 3 }} xs={{ span: 24, order: 3 }}>
              <Card
                size='small'
                className='cardWrapper'
                style={{ height: '54px' }}
              >
                {isLoading ? (
                  <Skeleton.Input style={{ width: 360 }} active />
                ) : (
                  <SelectChillerForm
                    selectedChillerName={selectedChiller.chillerName}
                    handleFormSelectChiller={handleFormSelectChiller}
                  />
                )}
              </Card>
              <Card
                title='Cooling Rate'
                size='small'
                className='cardWrapper'
                style={{ height: '174px' }}
              >
                {isLoading ? (
                  <Row justify='space-around'>
                    <div className='ringWrapper'>
                      <Skeleton.Avatar active shape='circle' size={100} />
                    </div>
                    <div className='ringWrapper'>
                      <Skeleton.Avatar active shape='circle' size={100} />
                    </div>
                    <div className='ringWrapper'>
                      <Skeleton.Avatar active shape='circle' size={100} />
                    </div>
                  </Row>
                ) : (
                  <Row>
                    <Col xs={8}>
                      <div className='gaugeWrapper'>
                        <GaugeChart
                          gaugeTitle='ChlldWtrFlow'
                          tempData={
                            sensorData[sensorData.length - 1].evap_WtrFlowEsti
                          }
                          limits={[250, 500]}
                          unit=' fpm'
                          colors={['#8bbb11', '#f3ea62', '#f3956a']}
                          colorDiv={[0.3, 0.8, 1]}
                          customTicks={[0, 0.6, 0.75, 1]}
                        />
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div className='gaugeWrapper'>
                        <GaugeChart
                          gaugeTitle='EntWtrTemp'
                          tempData={
                            sensorData[sensorData.length - 1].evap_EntWtrTemp
                          }
                        />
                      </div>
                    </Col>
                    <Col xs={8}>
                      <div className='gaugeWrapper'>
                        <GaugeChart
                          gaugeTitle='LvgWtrTemp'
                          tempData={
                            sensorData[sensorData.length - 1].evap_LvgWtrTemp
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                )}
              </Card>
              <Card
                title='Refrigerant Temperatures'
                size='small'
                className='cardWrapper'
                style={{ height: '330px' }}
              >
                {isLoading ? (
                  <div style={{ marginTop: '20px' }}>
                    <center>
                      <Skeleton.Avatar active shape='square' size={233} />
                    </center>
                  </div>
                ) : (
                  <div className='columnChartWrapper'>
                    <MultiLineChart data={sensorData} />
                  </div>
                )}
              </Card>
              <Card
                title='Power Consumption'
                size='small'
                className='cardWrapper'
                style={{ height: '291px' }}
              >
                {isLoading ? (
                  <center>
                    <Skeleton.Avatar active shape='square' size={233} />
                  </center>
                ) : (
                  <div className='areaChartWrapper'>
                    <ColumnChart data={sensorData} />
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}

export default HomePage;

HomePage.propTypes = {
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
  setDefaultSelectedSensor: PropTypes.func.isRequired,
  updateRefLoadPreds: PropTypes.func.isRequired,
};
