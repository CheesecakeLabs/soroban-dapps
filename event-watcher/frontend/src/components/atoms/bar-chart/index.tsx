import React, { FunctionComponent, useEffect, useState } from 'react'

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
import { http } from 'interfaces/http';
import { Utils } from 'shared/utils';



interface IBarChart {

}
interface IAPIResponse {
  pool_id: number;
  pool_name: string;
  volume: { hour: string; total: string }[];
}

const BarChart: FunctionComponent<IBarChart> = ({ }) => {
  const [apiData, setApiData] = useState<IAPIResponse[]>([]); // Store the API response here

  useEffect(() => {
    async function fetchPools() {
      try {
        const response = await http.get('/metrics/volume-chart');
        setApiData(response.data);
      } catch (error) {
        console.error('Error fetching pools:', error);
      }
    }
    fetchPools();
  }, []);

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
        text: 'Volume 12h',
      },
    },
  };

  const currentTime = new Date();
  const twelveHoursAgo = new Date();
  twelveHoursAgo.setUTCHours(currentTime.getUTCHours() - 11);

  const labels = [];
  let currentHour = twelveHoursAgo.getUTCHours();
  for (let i = 1; i <= 12; i++) {
    labels.push(`${currentHour}`);
    currentHour = (currentHour + 1) % 24;
  }

  const getDatasetData = (poolName: string) => {
    const poolData = apiData.find(pool => pool.pool_name === poolName);

    if (!poolData) {
      return labels.map(() => 0);
    }

    const dataMap = new Map(poolData.volume.map(item => [item.hour, Utils.formatAmount(BigInt(item.total), 7)]));
    return labels.map(hour => dataMap.get(hour) || 0);
  };

  const backgrounds = [
    'rgba(255, 99, 132, 0.5)',
    'rgba(53, 162, 235, 0.5)',
    'rgba(75, 192, 192, 0.5)'
  ]
  const datasets = apiData.map((pool, i) => ({
    label: pool.pool_name,
    data: getDatasetData(pool.pool_name),
    backgroundColor: backgrounds[pool.pool_id - 1],
  }));

  const data = {
    labels,
    datasets,
  };

  return (
    <Bar options={options} data={data} />
  )
}

export { BarChart }
