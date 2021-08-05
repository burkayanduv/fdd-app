import { Typography } from 'antd';
import { useState } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import PropTypes from 'prop-types';
import '../../styles/componentStyles/chillerMap.less';

export default function ChillerMap({
  chillerData,
  handleClick,
  selectedChiller,
}) {
  const [viewport, setViewport] = useState({
    latitude: 30.583332,
    longitude: 105,
    width: 'inherit',
    height: 'inherit',
    zoom: 3,
  });

  const [hoveredChiller, setHoveredChiller] = useState(null);

  const handleMouseEnter = (chiller) => {
    setHoveredChiller(chiller);
  };
  const handleMouseLeave = () => {
    setHoveredChiller(null);
  };

  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={(newViewport) => {
          setViewport(newViewport);
        }}
      >
        {chillerData.map((chiller) => (
          <Marker
            key={chiller._id}
            latitude={chiller.location.coordinates[0]}
            longitude={chiller.location.coordinates[1]}
          >
            <div className='marker'>
              <span
                onMouseEnter={() => {
                  handleMouseEnter(chiller);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
                onClick={(e) => {
                  handleClick(chiller);
                  e.target.style.zIndex = 1000;
                }}
                role='button'
                tabIndex={chiller._id}
                className={
                  chiller.chillerName === selectedChiller ? 'selectedSpan' : ''
                }
              >
                {' '}
              </span>
            </div>
          </Marker>
        ))}
        {hoveredChiller ? (
          <Popup
            latitude={hoveredChiller.location.coordinates[0]}
            longitude={hoveredChiller.location.coordinates[1]}
            anchor='left'
            offsetLeft={24}
            offsetTop={-18}
            tipSize={0}
            closeButton={false}
          >
            <div>
              <Typography.Text className='chillerMapPopupText'>
                {hoveredChiller.chillerName}
              </Typography.Text>
            </div>
          </Popup>
        ) : null}
      </ReactMapGL>
    </>
  );
}

ChillerMap.propTypes = {
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
  handleClick: PropTypes.func.isRequired,
  selectedChiller: PropTypes.string,
};

ChillerMap.defaultProps = {
  selectedChiller: '',
};
