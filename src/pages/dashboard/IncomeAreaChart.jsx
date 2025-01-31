import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  grid: {
    strokeDashArray: 0,
  },
};

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ slot, chartData }) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          slot === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: Array(slot === 'month' ? 12 : 7).fill(secondary),
          },
        },
        axisBorder: {
          show: true,
          color: line,
        },
        tickAmount: slot === 'month' ? 11 : 6,
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
    }));
  }, [primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    setSeries([
      {
        name: 'Page Views',
        data: (chartData || []).map((item) => ({
          x:
            slot === 'month'
              ? item.x.toLocaleDateString('default', { month: 'short', year: 'numeric' })
              : item.x.toLocaleDateString('default', { weekday: 'short' }),
          y: item.y,
        })),
      },
      {
        name: 'Sessions',
        data: (chartData || []).map((item) => ({
          x:
            slot === 'month'
              ? item.x.toLocaleDateString('default', { month: 'short', year: 'numeric' })
              : item.x.toLocaleDateString('default', { weekday: 'short' }),
          y: item.y,
        })),
      },
    ]);
  }, [slot, chartData]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = {
  slot: PropTypes.string.isRequired,
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.instanceOf(Date).isRequired,
      y: PropTypes.number.isRequired,
    })
  ),
};
