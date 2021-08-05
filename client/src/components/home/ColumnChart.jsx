import { Column } from '@ant-design/charts';
import PropTypes from 'prop-types';

export default function ColumnChart({ data }) {
  const columnData = [];
  let totalCurrent = 0;
  let startTime = '';
  let finishTime = '';
  data.forEach(
    ({ createdAt: createdAtVal, comp_CompCurrent: compCurrentVal }, index) => {
      if (Math.floor(index % 4) === 0) {
        startTime = new Date(createdAtVal).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        totalCurrent += compCurrentVal;
      } else if (Math.floor(index % 4) === 3) {
        finishTime = new Date(createdAtVal).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        totalCurrent += compCurrentVal;
        columnData.push({
          type: `${startTime} - ${finishTime}`,
          value: Math.round(totalCurrent * 25) / 100,
        });
        totalCurrent = 0;
      } else {
        totalCurrent += compCurrentVal;
      }
    }
  );

  const minData = columnData.reduce((prev, curr) =>
    prev.value < curr.value ? prev : curr
  );

  const maxData = columnData.reduce((prev, curr) =>
    prev.value > curr.value ? prev : curr
  );

  const maxGraph = maxData.value + (maxData.value - minData.value) * 0.1;
  const minGraph = minData.value - (maxData.value - minData.value) * 0.1;

  const config = {
    data: columnData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#D2D2D2',
        opacity: 0.8,
      },
    },
    yAxis: {
      grid: {
        line: { style: { opacity: 0.1 } },
      },
      minLimit: Math.floor(minGraph),
      maxLimit: Math.ceil(maxGraph),
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    columnStyle: {
      stroke: '#854eca',
      fill: 'l(270) 0:#181818 0.5:#181818 1:#854eca',
    },
    meta: {
      type: { alias: 'period' },
      sales: { alias: 'kWh' },
    },
  };

  return <Column {...config} />;
}

ColumnChart.propTypes = {
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
};
