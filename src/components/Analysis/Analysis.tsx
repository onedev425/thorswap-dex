import { Box } from '@chakra-ui/react';
import { Chain, ChainToChainId } from '@thorswap-lib/types';
import { AnalysisModal } from 'components/Analysis/AnalysisModal';
import { AnalysisSidebar } from 'components/Analysis/AnalysisSidebar';
import { gasState } from 'components/Analysis/helpers';
import { easeInOutTransition } from 'components/constants';
import dayjs from 'dayjs';
import { chainName } from 'helpers/chainName';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect, useMemo, useState } from 'react';
import { useGetGasHistoryQuery } from 'store/thorswap/api';

type Props = {
  analyticsVisible: boolean;
  toggleAnalytics: (value: boolean) => void;
  inputAssetChain: Chain;
};

export const Analysis = ({ analyticsVisible, toggleAnalytics, inputAssetChain }: Props) => {
  const { isLgActive } = useWindowSize();
  const { data: gasHistoryData, isLoading } = useGetGasHistoryQuery();

  const gasData = useMemo(() => {
    if (!gasHistoryData) return undefined;
    return gasHistoryData.find((item) => item && item.chainId === ChainToChainId[inputAssetChain]);
  }, [gasHistoryData, inputAssetChain]);

  const historyData = useMemo(() => {
    if (!gasData) return undefined;
    const values = gasData?.history.map((val) => val.value) ?? [];
    const timestamps =
      gasData?.history.map((val) => dayjs(val.timestamp).format('DD MMM YYYY, HH:mm')) ?? [];

    const nullIndexes: number[] = values.reduce((indexes: number[], el, index) => {
      if (el === null) {
        indexes.push(index);
      }
      return indexes;
    }, []);

    const filteredLabels = timestamps.filter((_, index) => !nullIndexes.includes(index));

    return {
      values: values.filter(Boolean),
      labels: filteredLabels,
      average24h: gasData.average24h,
      average7d: gasData.average7d,
    };
  }, [gasData]);

  const [hoveredIndex, setHoveredIndex] = useState(historyData?.values.length);

  useEffect(() => {
    if (!historyData?.values) return;
    setHoveredIndex(historyData?.values.length - 1);
  }, [historyData]);

  const chain = chainName(inputAssetChain);
  const historyGasState = gasState(
    historyData?.values,
    historyData?.average7d || historyData?.average24h,
  );

  const resetChartValue = () => {
    if (!historyData) return;
    setTimeout(() => {
      setHoveredIndex(historyData?.values.length - 1);
    }, 100);
  };

  return isLgActive ? (
    <Box
      position={{ base: 'static', xl: 'absolute' }}
      right={2}
      transform={{
        base: `translateY(${analyticsVisible ? '0%' : '100%'})`,
        lg: `translateX(${analyticsVisible ? '0%' : '100%'})`,
      }}
      transition={easeInOutTransition}
    >
      {analyticsVisible && (
        <AnalysisSidebar
          chain={chain}
          gasState={historyGasState}
          historyData={historyData}
          hoveredIndex={hoveredIndex}
          isLoading={isLoading}
          resetChartValue={resetChartValue}
          setHoveredIndex={setHoveredIndex}
          unitName={gasData?.unitName}
        />
      )}
    </Box>
  ) : (
    <AnalysisModal
      chain={chain}
      gasState={historyGasState}
      historyData={historyData}
      hoveredIndex={hoveredIndex}
      isLoading={isLoading}
      isOpened={analyticsVisible}
      resetChartValue={resetChartValue}
      setHoveredIndex={setHoveredIndex}
      setIsOpened={toggleAnalytics}
      title="Analysis"
      unitName={gasData?.unitName}
    />
  );
};
