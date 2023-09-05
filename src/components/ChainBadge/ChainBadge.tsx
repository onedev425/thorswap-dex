import { Text } from '@chakra-ui/react';
import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import type { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box } from 'components/Atomic';

type Props = {
  asset: AssetEntity;
};

const colorMapping: Record<Chain, string> = {
  BTC: 'bg-chain-btc',
  ETH: 'bg-chain-eth',
  AVAX: 'bg-chain-eth',
  BCH: 'bg-chain-bch',
  BNB: 'bg-chain-bnb',
  THOR: 'bg-chain-thor',
  DOGE: 'bg-chain-doge',
  LTC: 'bg-chain-ltc',
  GAIA: 'bg-chain-cos',
  BSC: 'bg-chain-bsc',
  ARB: 'bg-chain-arb',
  MATIC: 'bg-chain-matic',
  OP: 'bg-',
};

export const ChainBadge = ({ asset }: Props) => {
  return (
    <Box className={classNames('px-2 rounded-full', colorMapping[asset.chain as Chain])}>
      <Text textStyle="caption">{asset.type}</Text>
    </Box>
  );
};
