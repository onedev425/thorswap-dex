import { Text } from '@chakra-ui/react';
import type { AssetValue, Chain } from '@swapkit/core';
import classNames from 'classnames';
import { Box } from 'components/Atomic';

type Props = {
  asset: AssetValue;
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
  MAYA: 'bg-',
  KUJI: 'bg-',
  DASH: 'bg-',
  DOT: 'bg-',
  FLIP: 'bg-',
};

export const ChainBadge = ({ asset }: Props) => {
  return (
    <Box className={classNames('px-2 rounded-full', colorMapping[asset.chain as Chain])}>
      <Text textStyle="caption">{asset.type}</Text>
    </Box>
  );
};
