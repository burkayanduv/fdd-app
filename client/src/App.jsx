import { useContext, useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Context } from './context/Context';
import './styles/App.less';
import AtlasPage from './views/AtlasPage';
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import useLocalStorage from './functions/useLocalStorage';
import roundSensorData from './functions/roundSensorData';
import GraphPage from './views/GraphPage';
import UnavailablePage from './views/UnavailablePage';
import OperatorPage from './views/OperatorPage';

function App() {
  // user context
  const { user } = useContext(Context);

  // chiller data state and fetch chiller data when user is changed
  const [chillerData, setChillerData] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // selected chiller state
  const [selectedChiller, setSelectedChiller] = useState({});
  const [selectedChillerName, setSelectedChillerName] = useLocalStorage(
    'storedSelectedChiller',
    ''
  );

  // sensor data state and load sensor data when chiller is changed
  const [sensorData, setSensorData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // default selected sensor data state
  const [defaultSelectedSensor, setDefaultSelectedSensor] = useState('');

  // chiller selection functions
  const handleSelectChiller = (chiller) => {
    setSelectedChiller(chiller);
    setSelectedChillerName(chiller.chillerName);
  };

  const handleLinkSelectChiller = (e, chillerName) => {
    e.preventDefault();
    const selectedChillerObj = chillerData.find(
      (chiller) => chiller.chillerName === chillerName
    );
    setSelectedChiller(selectedChillerObj);
    setSelectedChillerName(chillerName);
  };

  const handleFormSelectChiller = (chillerName) => {
    const selectedChillerObj = chillerData.find(
      (chiller) => chiller.chillerName === chillerName
    );
    setSelectedChiller(selectedChillerObj);
    setSelectedChillerName(chillerName);
    setIsLoading(true);
  };

  // fetch chiller data
  const fetchChillerData = async (username) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const getToken = process.env.REACT_APP_GET_TOKEN;
      const res = await axios.get(
        `${apiURL}/chiller/?user=${username}&getToken=${getToken}`
      );
      setChillerData(res.data);
    } catch (error) {
      message.error(`${error.name} - (chiller) - ${error.message}`);
    }
  };

  // update refload preds
  const updateRefLoadPreds = async (chillerId) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const userToken = process.env.REACT_APP_USER_TOKEN;
      const res = await axios.post(`${apiURL}/pred/`, {
        chillerId,
        userToken,
      });
      if (res.status === 204) {
        message.success('FDD prediction up to date.');
      } else if (res.status === 200) {
        message.success('FDD prediction updated.');
        setTimeout(() => window.location.reload(), 3000);
      }
    } catch (error) {
      message.error(`${error.name} - (chiller) - ${error.message}`);
    }
  };

  // fetch sensor data
  const fetchSensorData = async (
    chillerId,
    limit,
    startDate = null,
    endDate = null
  ) => {
    try {
      const apiURL = process.env.REACT_APP_API_URL;
      const getToken = process.env.REACT_APP_GET_TOKEN;
      let res;
      if (startDate === null && endDate === null) {
        res = await axios.get(
          `${apiURL}/sensor/?chiller=${chillerId}&limit=${limit}&getToken=${getToken}`
        );
      } else {
        res = await axios.get(
          `${apiURL}/sensor/?chiller=${chillerId}&startDate=${startDate}&endDate=${endDate}&getToken=${getToken}`
        );
      }
      const roundedData = roundSensorData(res.data, 2);
      setSensorData(roundedData);
      setIsLoading(false);
    } catch (error) {
      message.error(`${error.name} - (sensor) - ${error.message}.`);
    }
  };

  // fetch chiller data when user loads
  useEffect(() => {
    if (!user) return;
    fetchChillerData(user.username);
  }, [user]);

  // set selected chiller when chiller data loads
  useEffect(() => {
    if (!user) return;
    if (chillerData.length === 0) return;
    const chillersList = user.chillers;
    if (user.chillers) {
      let selectedChillerObj;
      if (
        selectedChillerName === '' ||
        !chillersList.includes(selectedChillerName)
      ) {
        selectedChillerObj = chillerData.find(
          (chiller) => chiller.chillerName === chillersList[0]
        );
        setSelectedChillerName(chillersList[0]);
      } else {
        selectedChillerObj = chillerData.find(
          (chiller) => chiller.chillerName === selectedChillerName
        );
      }
      setSelectedChiller(selectedChillerObj);
      setIsFetching(false);
    }
  }, [chillerData.length]);

  // pageload component
  const pageLoadIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  const loadingPage = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Spin indicator={pageLoadIcon} />
    </div>
  );

  // loginpage component
  let loginPage;
  if (user) {
    if (user.username === 'master') {
      loginPage = <Redirect to='/operator' />;
    } else if (user.chillers.length !== 0) {
      loginPage = <Redirect to='/' />;
    } else {
      loginPage = <UnavailablePage />;
    }
  } else {
    loginPage = <LoginPage />;
  }

  // atlaspage component
  let atlasPage;
  if (user && isFetching) {
    atlasPage = loadingPage;
  } else if (user && user.chillers.length !== 0) {
    atlasPage = (
      <AtlasPage
        selectedChiller={selectedChiller}
        handleSelectChiller={handleSelectChiller}
        handleLinkSelectChiller={handleLinkSelectChiller}
        chillerData={chillerData}
        updateRefLoadPreds={updateRefLoadPreds}
      />
    );
  } else if (user) {
    loginPage = <UnavailablePage />;
  } else {
    atlasPage = <Redirect to='/login' />;
  }

  // homepage component
  let homePage;
  if (user && isFetching) {
    homePage = loadingPage;
  } else if (user && user.chillers.length !== 0) {
    homePage = (
      <HomePage
        selectedChiller={selectedChiller}
        sensorData={sensorData}
        isLoading={isLoading}
        fetchSensorData={fetchSensorData}
        handleFormSelectChiller={handleFormSelectChiller}
        setDefaultSelectedSensor={setDefaultSelectedSensor}
        updateRefLoadPreds={updateRefLoadPreds}
      />
    );
  } else if (user) {
    loginPage = <UnavailablePage />;
  } else {
    homePage = <Redirect to='/login' />;
  }

  // graphpage component
  let graphPage;
  if (user && isFetching) {
    graphPage = loadingPage;
  } else if (user && user.chillers.length !== 0) {
    graphPage = (
      <GraphPage
        selectedChiller={selectedChiller}
        sensorData={sensorData}
        isLoading={isLoading}
        fetchSensorData={fetchSensorData}
        handleFormSelectChiller={handleFormSelectChiller}
        defaultSelectedSensor={defaultSelectedSensor}
      />
    );
  } else if (user) {
    loginPage = <UnavailablePage />;
  } else {
    graphPage = <Redirect to='/login' />;
  }

  // operatorpage component
  let operatorPage;
  if (user) {
    if (user.username === 'master') {
      operatorPage = <OperatorPage />;
    } else {
      operatorPage = <Redirect to='/' />;
    }
  } else {
    operatorPage = <Redirect to='/login' />;
  }

  return (
    <Switch>
      <Route path={['/login', '/register']}>{loginPage}</Route>
      <Route exact path='/'>
        {atlasPage}
      </Route>
      <Route path='/home'>{homePage}</Route>
      <Route path='/graph'>{graphPage}</Route>
      <Route path='/operator'>{operatorPage}</Route>
      <Route path='/unavailable'>
        {user ? <UnavailablePage /> : <Redirect to='/login' />}
      </Route>
    </Switch>
  );
}

export default App;
