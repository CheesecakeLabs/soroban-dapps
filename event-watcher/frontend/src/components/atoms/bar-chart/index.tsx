import React, { FunctionComponent, useState } from 'react'

import styles from './styles.module.scss'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';



interface IBarChart {

}

const BarChart: FunctionComponent<IBarChart> = ({ }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Volume 24h',
      },
    },
  };

  const labels = Array.from({ length: 24 }, (_, index) => `${index}:00`);

  const data = {
    labels,
    datasets: [
      {
        label: 'USDC-BTC',
        data: labels.map(() => 2),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'DAI-BNB',
        data: labels.map(() => 4),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'LTC-EUROC',
        data: labels.map(() => 1),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <Bar options={options} data={data} />
  )
}

export { BarChart }
