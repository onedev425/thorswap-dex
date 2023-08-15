import { Flex, Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { Icon, Tooltip } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  depth: number | string;
  slippage?: Amount;
  asset: AssetEntity;
};

export const VirtualDepthSlippageInfo = ({ depth, slippage, asset }: Props) => {
  const slippageState = getSlippageState(Number(depth));

  return (
    <Tooltip content={slippageState.tooltip}>
      <Flex alignItems="center" gap={2}>
        <Text color={slippageState.color} textStyle="caption">
          {slippage ? slippage?.toSignificant(6) : 0} {asset.name}
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
    return { color: 'brand.green', tooltip: t('views.lending.lendingFees.low') };
  }

  if (depth > 70) {
    return { color: 'brand.yellow', tooltip: t('views.lending.lendingFees.medium') };
  }

  return { color: 'brand.red', tooltip: t('views.lending.lendingFees.high') };
}
