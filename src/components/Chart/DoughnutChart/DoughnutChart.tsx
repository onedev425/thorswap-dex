import { Box, Flex } from '@chakra-ui/react';
import { Amount, Price } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Typography } from 'components/Atomic';
import { ChartTypeSelect } from 'components/Chart/ChartTypeSelect';
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
import { useCallback, useMemo, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { useMidgard } from 'store/midgard/hooks';
import { SaverPosition } from 'views/Earn/types';
import { ShareChartIndex } from 'views/Home/types';

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

type Props = {
  data: SaverPosition[];
  unit?: string;
  chartIndexes: string[];
  selectChart: (value: string) => void;
  selectedIndex: string;
};

export const DoughnutChart = ({
  data,
  unit = '$',
  chartIndexes,
  selectChart,
  selectedIndex,
}: Props) => {
  const chartRef = useRef<ChartJSOrUndefined<'doughnut', any, any>>(null);
  console.log('🔥', chartRef.current?.tooltip);
  const { pools } = useMidgard();
  const totalUsd = useCallback(
    (position: SaverPosition) => {
      return new Price({
        baseAsset: position.asset,
        pools,
        priceAmount: position.amount,
      });
    },
    [pools],
  );

  const onLegendHover = (index: number | null) => {
    console.log('🔥index', index, chartRef.current);
    const activeElement = index === null ? [] : [{ datasetIndex: 0, index }];
    chartRef.current?.tooltip?.setActiveElements(activeElement, { x: 0, y: 0 });
    chartRef.current?.setActiveElements(activeElement);
    chartRef.current?.update();
  };

  const earnedUsd = useCallback(
    (position: SaverPosition) => {
      return new Price({
        baseAsset: position.asset,
        pools,
        priceAmount: position.earnedAmount as Amount,
      });
    },
    [pools],
  );

  const isEarned = selectedIndex === ShareChartIndex.Earned;

  const datas = isEarned
    ? data.map((position) => earnedUsd(position).toFixedRaw(2))
    : data.map((position) => totalUsd(position).toFixedRaw(2));

  const datasLabel = isEarned ? 'Earned' : 'Total';

  const options: any = {
    cutout: '60%',
    padding: 0,
    responsive: true,
    plugins: {
      legend: {
        display: false,
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
    onHover: (e, elements) => {
      console.log(elements[0]?.index);
    },
  };

  const chartData: any = useMemo(
    () => ({
      labels: data.map((position) => position.asset.name),
      datasets: [
        {
          label: datasLabel,
          data: datas,
          backgroundColor: colors.map((color) => color + '20'),
          borderColor: colors,
          borderWidth: 1,
        },
      ],
    }),
    [data, datas, datasLabel],
  );
  return (
    <Flex direction="column" w="full">
      <Box p={2}>
        <ChartTypeSelect
          chartTypeIndexes={chartIndexes}
          selectChartTypeIndex={selectChart}
          selectedChartTypeIndex={selectedIndex}
        />
      </Box>

      <Flex height={200} justify="space-between">
        <Doughnut data={chartData} id="myChart" options={options} ref={chartRef} />
        <Flex direction="column" gap={2}>
          {data.map((share) => {
            const selectedShare = isEarned ? share.earnedAmount : share.amount;
            return (
              <Flex
                align="center"
                gap={1}
                key={share.amount?.toFixed() + share.earnedAmount?.toFixed()}
                onMouseEnter={() => onLegendHover(data.indexOf(share))}
                onMouseLeave={() => onLegendHover(null)}
              >
                <AssetIcon asset={share.asset} size={28} />
                <Typography>{share.asset.name}</Typography>
                <Typography>{selectedShare?.toSignificantWithMaxDecimals(6)}</Typography>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};
