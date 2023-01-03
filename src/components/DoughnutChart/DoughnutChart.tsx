import {
  StrokeColor3,
  StrokeColor4,
  StrokeColor5,
  StrokeColor6,
  StrokeColor7,
  StrokeColor8,
  StrokeColor9,
  StrokeColor10,
} from 'components/Chart/styles/colors';
import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

type Props = {
  labels: string[];
  data: string[];
};

export const DoughnutChart = ({ labels, data }: Props) => {
  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.raw} $`;
          },
        },
      },
    },
  };

  const colors = [
    StrokeColor3,
    StrokeColor5,
    StrokeColor4,
    StrokeColor6,
    StrokeColor8,
    StrokeColor7,
    StrokeColor10,
    StrokeColor9,
  ];

  const chartData: any = useMemo(
    () => ({
      labels: labels,
      datasets: [
        {
          label: 'You Earned',
          data: data,
          backgroundColor: colors.map((color) => color + '20'),
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    }),
    [data, labels],
  );
  return (
    <>
      <Doughnut data={chartData} options={options} />
    </>
  );
};
