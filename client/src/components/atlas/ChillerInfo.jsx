import { Col, Row, Statistic } from 'antd';
import PropTypes from 'prop-types';

export default function ChillerInfo({ selectedChiller }) {
  const ConvertDEGToDMS = (deg, lat) => {
    const absolute = Math.abs(deg);

    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);

    let direction = '';
    if (lat) {
      direction = deg >= 0 ? 'N' : 'S';
    } else {
      direction = deg >= 0 ? 'E' : 'W';
    }

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return (
    <>
      <Row align='middle'>
        <Col xs={12}>
          <Statistic
            title='Chiller Name'
            value={selectedChiller.chillerName}
            valueStyle={{
              marginTop: '7px',
              marginBottom: '9px',
            }}
          />
        </Col>
      </Row>
      <Row align='middle'>
        <Col xs={12}>
          <Statistic
            title='Latitude'
            value={ConvertDEGToDMS(
              selectedChiller.location.coordinates[0],
              true
            )}
            valueStyle={{
              marginTop: '7px',
              marginBottom: '9px',
            }}
          />
        </Col>
        <Col xs={12}>
          <Statistic
            title='Longitude'
            value={ConvertDEGToDMS(
              selectedChiller.location.coordinates[1],
              false
            )}
            valueStyle={{
              marginTop: '7px',
              marginBottom: '9px',
            }}
          />
        </Col>
      </Row>
      <Row align='middle'>
        <Col xs={12}>
          <Statistic
            title='Connection Status'
            value={selectedChiller.connectionStatus.toUpperCase()}
            valueStyle={
              selectedChiller.connectionStatus.toUpperCase() === 'OK'
                ? {
                    color: '#7CFC00',
                    borderColor: '#008000',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingBottom: '2px',
                    marginTop: '10px',
                    marginBottom: '9px',
                    width: 'min-content',
                    backgroundColor: 'rgb(0, 128, 0, 0.2)',
                  }
                : {
                    color: 'rgb(255, 100, 60)',
                    borderColor: 'rgb(255, 90, 50, 0.55)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    paddingBottom: '2px',
                    marginTop: '10px',
                    marginBottom: '9px',
                    width: 'min-content',
                    backgroundColor: 'rgb(255, 90, 50, 0.12)',
                  }
            }
          />
        </Col>
        <Col xs={12}>
          <Statistic
            title='Connection Time'
            value={new Date(selectedChiller.updatedAt).toLocaleString('en-gb', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
            valueStyle={{
              marginTop: '7px',
              marginBottom: '9px',
            }}
          />
        </Col>
      </Row>
      <Row align='middle'>
        <Col xs={12}>
          <Statistic
            title='Chiller Manager'
            value={selectedChiller.admins[0]}
            valueStyle={{
              marginTop: '7px',
              marginBottom: '9px',
            }}
          />
        </Col>
        <Col xs={12}>
          <Statistic
            title='Registration Time'
            value={new Date(selectedChiller.createdAt).toLocaleString('en-gb', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
            valueStyle={{
              marginTop: '7px',
              marginBottom: '9px',
            }}
          />
        </Col>
      </Row>
    </>
  );
}

ChillerInfo.propTypes = {
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
};
