/* eslint-disable no-return-assign */
import { Gauge } from '@ant-design/charts';
import PropTypes from 'prop-types';

export default function GaugeChart({
  gaugeTitle,
  tempData,
  limits,
  unit,
  colors,
  colorDiv,
  customTicks,
}) {
  // eslint-disable-next-line no-unused-vars
  let ref;
  const ticks = customTicks;
  const [color0, color1, color2] = colors;
  const config = {
    percent: (tempData - limits[0]) / (limits[1] - limits[0]),
    range: {
      ticks: [0, 1],
      color: [
        `l(0) ${colorDiv[0]}:${colors[0]} ${colorDiv[1]}:${colors[1]} ${colorDiv[2]}:${colors[2]}`,
      ],
    },
    indicator: {
      pointer: { style: { stroke: 'whitesmoke', lineWidth: 2 } },
      pin: { style: { stroke: 'transparent', fill: 'transparent' } },
    },
    axis: {
      label: {
        formatter: function formatter(v) {
          return Number(v) * (limits[1] - limits[0]) + limits[0];
        },
        style: { fontSize: 10 },
      },
      subTickLine: { count: 3 },
    },
    statistic: {
      title: {
        offsetY: 12,
        formatter: function formatter(_ref) {
          const { percent } = _ref;
          return (
            String(
              Math.round(
                (percent * (limits[1] - limits[0]) + limits[0]) * 100
              ) / 100
            ) + unit
          );
        },
        style: function style(_ref2) {
          const { percent } = _ref2;
          let selectedColor;
          if (percent < ticks[1]) {
            selectedColor = color0;
          } else if (percent < ticks[2]) {
            selectedColor = color1;
          } else {
            selectedColor = color2;
          }
          return {
            fontSize: '14px',
            lineHeight: 1,
            color: selectedColor,
          };
        },
      },
      content: {
        offsetY: 36,
        style: {
          fontSize: '12px',
          color: 'whitesmoke',
        },
        formatter: function formatter() {
          return gaugeTitle;
        },
      },
    },
  };

  return <Gauge {...config} chartRef={(chartRef) => (ref = chartRef)} />;
}

GaugeChart.propTypes = {
  gaugeTitle: PropTypes.string.isRequired,
  tempData: PropTypes.number.isRequired,
  limits: PropTypes.arrayOf(PropTypes.number),
  unit: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string),
  colorDiv: PropTypes.arrayOf(PropTypes.number),
  customTicks: PropTypes.arrayOf(PropTypes.number),
};

GaugeChart.defaultProps = {
  limits: [40, 50],
  unit: '°F',
  colors: ['#65b7f3', '#f3ea62', '#f3956a'],
  colorDiv: [0, 0.5, 1],
  customTicks: [0, 1 / 3, 2 / 3, 1],
};
