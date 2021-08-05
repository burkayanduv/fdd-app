import { useEffect, useRef, useState } from 'react';
import { Steps } from 'antd';
import PropTypes from 'prop-types';

export default function FetchStatusChart({
  isLoading,
  isNewQuery,
  isRealtime,
}) {
  const [stepNumber, setStepNumber] = useState(0);
  useEffect(() => {
    if (isNewQuery) {
      setStepNumber(0);
    } else if (isLoading) {
      setStepNumber(1);
    } else {
      setStepNumber(2);
    }
  }, [isNewQuery, isLoading, isRealtime]);

  const oscillationTime = 5000;
  const realtimeOscillate = () => {
    setStepNumber(1);
    setTimeout(() => setStepNumber(2), oscillationTime / 2);
  };

  const fetchStatusIntervalId = useRef(null);
  useEffect(() => {
    if (isRealtime) {
      fetchStatusIntervalId.current = setInterval(
        realtimeOscillate,
        oscillationTime
      );
    } else {
      clearInterval(fetchStatusIntervalId.current);
    }
  }, [isRealtime]);

  return (
    <Steps current={stepNumber}>
      <Steps.Step title='Request' description='Submitted user query.' />
      <Steps.Step
        title='Fetch Data'
        subTitle={stepNumber === 1 && 'Waiting server response...'}
        description='Connected to database.'
      />
      <Steps.Step title='Ready' description='The data is shown.' />
    </Steps>
  );
}

FetchStatusChart.propTypes = {
  isLoading: PropTypes.bool,
  isNewQuery: PropTypes.bool,
  isRealtime: PropTypes.bool,
};

FetchStatusChart.defaultProps = {
  isLoading: true,
  isNewQuery: false,
  isRealtime: false,
};
