import { Area } from '@ant-design/charts';
import PropTypes from 'prop-types';

export default function AreaChart({ data, id }) {
  const minData = data.reduce((prev, curr) =>
    prev[id] < curr[id] ? prev : curr
  );

  const maxData = data.reduce((prev, curr) =>
    prev[id] > curr[id] ? prev : curr
  );

  const maxGraph = maxData[id] + (maxData[id] - minData[id]) * 0.1;
  const minGraph = minData[id] - (maxData[id] - minData[id]) * 0.1;

  const timedData = data.map(({ createdAt: timeString, ...rest }) => ({
    createdAt: new Date(timeString).toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    ...rest,
  }));

  const config = {
    data: timedData,
    xField: 'createdAt',
    yField: id,
    color: '#854eca',
    smooth: true,
    xAxis: {
      range: [0, 1],
    },
    yAxis: {
      grid: {
        line: { style: { opacity: 0.1 } },
      },
      range: [0.1, 1],
      minLimit: Math.floor(minGraph),
      maxLimit: Math.ceil(maxGraph),
    },
    areaStyle: function areaStyle() {
      return {
        fill: 'l(270) 0:#181818 0.3:#181818 1:#854eca',
      };
    },
  };
  return <Area {...config} />;
}

AreaChart.propTypes = {
  data: PropTypes.arrayOf(
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
      cond_DiffRfgtPres: PropTypes.number,
      cond_SubcLiqTemp: PropTypes.number,
      cond_SubcLiqPress: PropTypes.number,
      cond_FanDischTemp: PropTypes.number,
      evap_SatRfgtTemp: PropTypes.number,
      evap_RfgtPoolTemp: PropTypes.number,
      evap_RfgtPress: PropTypes.number,
      evap_ApprchTemp: PropTypes.number,
      evap_EntWtrTemp: PropTypes.number,
      evap_LvgWtrTemp: PropTypes.number,
      evap_WtrFlowEst: PropTypes.number,
      evap_OutdoorAirTempi: PropTypes.number,
    })
  ).isRequired,
  id: PropTypes.string.isRequired,
};
