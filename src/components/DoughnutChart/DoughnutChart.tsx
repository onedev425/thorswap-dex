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
import { useApp } from 'store/app/hooks';
import { ThemeType } from 'types/app';

type Props = {
  labels: string[];
  data: string[];
  unit?: string;
};

export const DoughnutChart = ({ labels, data, unit = '$' }: Props) => {
  const { themeType } = useApp();
  const isLight = themeType === ThemeType.Light;

  const options: any = {
    cutout: '70%',
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 40,
          color: isLight ? '#1F1F41' : '#E2EBFB',
          boxHeight: 20,
          font: { size: 16, family: 'Poppins', weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        bodyFont: { size: 12 },
        cornerRadius: 16,
        padding: 14,
        titleFont: { size: 14 },
        titleSpacing: 8,
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label} ${context.raw} ${unit}`;
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
          label: 'You Earned:',
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
