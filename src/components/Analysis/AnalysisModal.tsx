import { Box, Flex, Text } from '@chakra-ui/react';
import { AnalysisPlaceholder } from 'components/Analysis/AnalysisPlaceholder';
import { Icon, Modal } from 'components/Atomic';
import { ChartPreview } from 'components/ChartPreview';
import { t } from 'services/i18n';

type Props = {
  title?: string;
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
  historyData?: {
    labels: string[];
    values: number[];
  };
  unitName?: string;
  chain: string;
  hoveredIndex?: number;
  setHoveredIndex: (index: number) => void;
  isLoading: boolean;
  gasState?: { color: string; state: string };
};

export const AnalysisModal = ({
  title,
  isOpened,
  setIsOpened,
  historyData,
  unitName,
  chain,
  hoveredIndex,
  setHoveredIndex,
  isLoading,
  gasState,
}: Props) => {
  const onClose = () => {
    setIsOpened(false);
  };

  return (
    <Modal isOpened={isOpened} onClose={onClose} title={title || ''}>
      {isLoading ? (
        <Flex align="center" minH="230px">
          <Icon spin name="loader" size={24} />
        </Flex>
      ) : historyData ? (
        <Box w="full">
          <Box pb={2} pl={3}>
            <Text>{t('components.gasHistory.chartTitle', { chain })}</Text>
            <Flex>
              <Text fontSize="11px">{t('views.swap.currentGasRate')}</Text>
              &nbsp;
              <Text color={`brand.${gasState?.color}`} fontSize="11px">{`${gasState?.state} (${
                historyData.values[historyData.values.length - 1]
              } ${unitName})`}</Text>
            </Flex>
          </Box>
          <Flex bg="borderPrimary" borderRadius="3xl" direction="column" pt={2} px={1} w="full">
            <Flex direction="column" ml={3}>
              <Flex>
                <Text color="brand.navy">{hoveredIndex && historyData.values[hoveredIndex]}</Text>
                &nbsp;
                <Text>{unitName}</Text>
              </Flex>
              <Text>{hoveredIndex && historyData.labels[hoveredIndex]}</Text>
            </Flex>
            <Box ml={-3.5} width="calc(100% + 28px)">
              <ChartPreview
                hideAxisLines
                hideLabel
                hideTooltip
                hoveredIndex={hoveredIndex}
                labels={historyData?.labels}
                onHover={setHoveredIndex}
                values={historyData?.values}
              />
            </Box>
          </Flex>
        </Box>
      ) : (
        <Flex align="center" minH="230px">
          <AnalysisPlaceholder chain={chain} />
        </Flex>
      )}
    </Modal>
  );
};
