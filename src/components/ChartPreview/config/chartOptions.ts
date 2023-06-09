import { Element } from 'chart.js';
import * as styles from 'components/Chart/styles/styles';

export const getChartOptions = (
  hideLabel: boolean,
  hasGrid: boolean,
  hideAxisLines?: boolean,
  onHover?: (index: number) => void,
  hoveredIndex?: number | null,
  hideTooltip?: boolean,
) => {
  const gridOptions = {
    display: false,
    drawOnChartArea: hasGrid,
    drawTicks: false,
  };

  const tickOptions = {
    display: hideLabel ? false : true,
    maxRotation: 0,
    minRotation: 0,
    sampleSize: 1,
  };

  return {
    animation: false,
    maintainAspectRatio: false,
    resizeDelay: 300,
    responsive: true,
    normalized: true,
    interaction: {
      intersect: false,
      axis: 'x' as const,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: hideTooltip ? false : true,
      },
    },
    scales: {
      x: {
        display: hideAxisLines ? false : true,
        grid: gridOptions,
        ticks: { ...styles.chartXTicksStyles, ...tickOptions },
      },
      y: {
        display: hideAxisLines ? false : true,
        grid: gridOptions,
        ticks: { ...styles.chartYTicksStyles, ...tickOptions },
      },
    },
    onHover: (_e: any, elements: { element: Element; datasetIndex: number; index: number }[]) => {
      if (elements[0]?.index === hoveredIndex || !onHover || elements[0]?.index === 0) return;
      onHover(elements[0]?.index);
    },
  } as const;
};
