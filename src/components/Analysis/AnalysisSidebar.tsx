import { Box, Flex, SystemStyleObject, Text } from '@chakra-ui/react';
import { AnalysisPlaceholder } from 'components/Analysis/AnalysisPlaceholder';
import { Icon } from 'components/Atomic';
import { ChartPreview } from 'components/ChartPreview';
import { easeInOutTransition } from 'components/constants';
import { t } from 'services/i18n';

type SidebarProps = {
  sx?: SystemStyleObject;
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
  resetChartValue?: () => void;
};

export const AnalysisSidebar = ({
  sx,
  historyData,
  unitName,
  chain,
  hoveredIndex,
  setHoveredIndex,
  isLoading,
  gasState,
  resetChartValue,
}: SidebarProps) => {
  return (
    <Flex
      _dark={{
        bgColor: 'bgSecondary',
        border: 'none',
      }}
      align="center"
      bgColor="white"
      border="1px solid"
      borderColor="borderPrimary"
      borderRadius={24}
      boxShadow="md"
      boxSizing="border-box"
      direction="column"
      justify={historyData ? 'start' : 'center'}
      maxWidth="480px"
      minH="500px"
      mt={{ base: 0, lg: '64px' }}
      mx="auto"
      p={4}
      sx={sx}
      top={0}
      transition={easeInOutTransition}
      width={{ lg: '280px' }}
    >
      {isLoading ? (
        <Icon spin name="loader" size={24} />
      ) : historyData ? (
        <Box w="full">
          <Box pb={2} pl={2}>
            <Text>{t('components.gasHistory.chartTitle', { chain })}</Text>
            <Flex>
              <Text fontSize="11px">{t('views.swap.currentGasRate')}</Text>
              &nbsp;
              <Text color={`brand.${gasState?.color}`} fontSize="11px">{`${gasState?.state} (${
                historyData.values[historyData.values.length - 1]
              } ${unitName})`}</Text>
            </Flex>
          </Box>

          <Flex bg="borderPrimary" borderRadius="xl" direction="column" pt={2} w="full">
            <Flex direction="column" display="flex" ml={3}>
              <Flex>
                <Text color="brand.navy">{hoveredIndex && historyData.values[hoveredIndex]}</Text>
                &nbsp;
                <Text>{unitName}</Text>
              </Flex>
              <Text color="textSecondary" fontWeight="normal" textStyle="captiongit">
                {hoveredIndex && historyData.labels[hoveredIndex]}
              </Text>
            </Flex>
            <Box ml="-9px" onMouseLeave={resetChartValue} width="calc(100% + 18px)">
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
        <AnalysisPlaceholder chain={chain} />
      )}
    </Flex>
  );
};
