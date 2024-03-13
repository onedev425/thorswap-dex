import { Flex, Text } from '@chakra-ui/react';
import type { SwapKitNumber } from '@swapkit/core';
import { Icon, Tooltip } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  depth: number | string;
  totalFeeUsd?: SwapKitNumber;
};

export const VirtualDepthSlippageInfo = ({ depth, totalFeeUsd }: Props) => {
  const slippageState = getSlippageState(Number(depth));

  return (
    <Tooltip content={slippageState.tooltip}>
      <Flex alignItems="center" gap={2}>
        <Text color={slippageState.color} textStyle="caption">
          {totalFeeUsd?.toCurrency() || '0'}
        </Text>

        <Icon color="secondary" name="infoCircle" size={20} />
      </Flex>
    </Tooltip>
  );
};

function getSlippageState(depth: number) {
  if (!depth) {
    return { color: '', tooltip: '' };
  }

  if (depth > 85) {
    return { color: 'brand.green', tooltip: t('views.lending.slippage.low') };
  }

  if (depth > 70) {
    return { color: 'brand.yellow', tooltip: t('views.lending.slippage.medium') };
  }

  return { color: 'brand.red', tooltip: t('views.lending.slippage.high') };
}
