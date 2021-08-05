import { Col, Row, Statistic } from 'antd';
import PropTypes from 'prop-types';

export default function ChillerHealth({ selectedChiller }) {
  const healthValue = selectedChiller.healthStatus.toUpperCase();
  const timeValue = selectedChiller.diagnosisTime;

  return (
    <>
      <Row align='middle'>
        <Col xs={24} md={12}>
          <Statistic
            title='Status'
            value={healthValue}
            valueStyle={
              healthValue === 'NORMAL'
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
        <Col xs={24} md={12}>
          <Statistic
            title='Prediction Time'
            value={new Date(timeValue).toLocaleString('en-gb', {
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

ChillerHealth.propTypes = {
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
