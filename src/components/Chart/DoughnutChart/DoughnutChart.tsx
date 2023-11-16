import { Flex, Text } from '@chakra-ui/react';
import { AssetIcon } from 'components/AssetIcon';
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
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import type { SaverPosition } from 'views/Earn/types';
import { ShareChartIndex } from 'views/Home/types';

import { colors } from '../../../theme/colors';

const chartColors = [
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
  title?: string;
};

export const DoughnutChart = ({
  data,
  unit = '$',
  chartIndexes,
  selectChart,
  selectedIndex,
  title,
}: Props) => {
  const chartRef = useRef<ChartJSOrUndefined<'doughnut', any, any>>(null);
  const [chartHovered, setChartHovered] = useState<number | null>(null);
  const assets = useMemo(() => data.map(({ asset }) => asset), [data]);
  const { data: tokenPricesData } = useTokenPrices(assets);
  const isEarned = selectedIndex === ShareChartIndex.Earned;

  const onLegendHover = useCallback((index: number | null) => {
    const activeElement = index === null ? [] : [{ datasetIndex: 0, index }];
    chartRef.current?.tooltip?.setActiveElements(activeElement, { x: 0, y: 0 });
    chartRef.current?.setActiveElements(activeElement);
    chartRef.current?.update();
  }, []);

  const options: any = useMemo(
    () => ({
      cutout: '70%',
      padding: 0,
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          displayColors: false,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          bodyFont: { size: 12 },
          cornerRadius: 16,
          padding: 14,
          titleFont: { size: 14 },
          titleSpacing: 8,
          callbacks: {
            label: (context: any) => `${context.dataset.label} ${context.raw} ${unit}`,
          },
        },
      },
      onHover: (_e: any, elements: { element: Element; datasetIndex: number; index: number }[]) => {
        if (elements[0]?.index === chartHovered) return;
        setChartHovered(elements[0]?.index);
      },
    }),
    [chartHovered, unit],
  );

  const chartData = useMemo(() => {
    const usdPrices = data.map(({ asset, amount, earnedAmount }) => {
      const assetAmount = isEarned
        ? amount.getValue('number')
        : earnedAmount?.getValue('number') || 0;

      return (tokenPricesData[asset.toString()]?.price_usd || 0) * assetAmount;
    });

    return {
      labels: data.map((position) => position.asset.ticker),
      datasets: [
        {
          label: isEarned ? 'Earned' : 'Total',
          data: usdPrices,
          backgroundColor: chartColors.map((color) => color + '50'),
          borderColor: chartColors,
          borderWidth: 1,
        },
      ],
    };
  }, [data, isEarned, tokenPricesData]);

  return (
    <Flex direction="column" p={2} w="full">
      <Flex justify="space-between" pb={4}>
        <Text textStyle="subtitle2">{title}</Text>
        <ChartTypeSelect
          chartTypeIndexes={chartIndexes}
          selectChartTypeIndex={selectChart}
          selectedChartTypeIndex={selectedIndex}
        />
      </Flex>

      <Flex align="center" justify="space-between">
        <Flex height={150} width={40}>
          <Doughnut data={chartData} id="myChart" options={options} ref={chartRef} />
        </Flex>
        <Flex direction="column" gap={1} h="full" pl={2} w="full">
          {data.map((share, index) => {
            const selectedShare = isEarned ? share.earnedAmount : share.amount;
            const hovered = chartHovered === index;
            return (
              <Flex
                _dark={{
                  bgColor: hovered ? colors.gray : colors.bgDarkGray,
                  _hover: { bgColor: colors.gray },
                }}
                _hover={{
                  border: `1px solid ${colors.btnPrimary}`,
                  bgColor: colors.bgBtnLightTintActive,
                }}
                align="center"
                bgColor={hovered ? colors.bgBtnLightTintActive : colors.bgLightGray}
                border={hovered ? `1px solid ${colors.btnPrimary}` : '1px solid transparent'}
                borderRadius="3xl"
                display="flex"
                gap={2}
                justify="space-between"
                key={`${share.amount.getValue('string')}-${share.earnedAmount?.getValue('string')}`}
                onMouseEnter={() => onLegendHover(data.indexOf(share))}
                onMouseLeave={() => onLegendHover(null)}
                p={1}
                pl={3}
              >
                <Flex gap={1}>
                  <Text>{selectedShare?.toSignificant(6)}</Text>
                  <Text>{share.asset.ticker}</Text>
                </Flex>
                <AssetIcon asset={share.asset} size={28} />
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};
