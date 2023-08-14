import { Flex, Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { Icon, Tooltip } from 'components/Atomic';

type Props = {
  depth: number;
  slippage?: Amount;
  asset: AssetEntity;
};

export const VirtualDepthSlippageInfo = ({ depth, slippage, asset }: Props) => {
  return (
    <Tooltip content="Virtual Pool Depth - description here.">
      <Flex alignItems="center" gap={2}>
        {/* <Text textStyle="caption" variant="secondary">
          {t('views.lending.poolDepth')}: {depth}%
        </Text> */}

        <Text color={getColor(depth)} textStyle="caption">
          {slippage ? slippage?.toSignificant(6) : 0} {asset.name}
        </Text>
        <Icon color="secondary" name="infoCircle" size={20} />
      </Flex>
    </Tooltip>
  );
};

function getColor(depth: number) {
  if (depth > 79) {
    return 'brand.green';
  } else if (depth > 50) {
    return 'brand.yellow';
  } else {
    return 'brand.red';
  }
}
