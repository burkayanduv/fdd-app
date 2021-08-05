import { RingProgress } from '@ant-design/charts';
import PropTypes from 'prop-types';

export default function RingProgressChart({ chartTitle, chartData }) {
  const config = {
    height: 100,
    width: 100,
    autoFit: false,
    percent: chartData,
    color: ['#51258f', 'transparent'],
    innerRadius: 0.85,
    radius: 0.98,
    statistic: {
      title: {
        style: {
          color: '#D2D2D2',
          fontSize: '12px',
          lineHeight: '14px',
        },
        formatter: function formatter() {
          return chartTitle;
        },
      },
    },
  };

  return <RingProgress {...config} />;
}

RingProgressChart.propTypes = {
  chartTitle: PropTypes.string.isRequired,
  chartData: PropTypes.number.isRequired,
};
