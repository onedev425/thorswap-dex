import { Text } from '@chakra-ui/react';
import { ChainWallet } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box } from 'components/Atomic';
import { WalletIcon } from 'components/WalletIcon/WalletIcon';
import { chainName } from 'helpers/chainName';

type Props = {
  chain: Chain;
  chainWallet: Maybe<ChainWallet>;
  balance: string;
};

export const HeaderChainInfo = ({ chain, chainWallet, balance }: Props) => {
  return (
    <Box center className="space-x-1">
      {!!chainWallet && <WalletIcon size={16} walletType={chainWallet?.walletType} />}
      <Text>{chainName(chain, true)}</Text>

      {!!chainWallet && (
        <Text fontWeight="semibold" variant="primaryBtn">
          {balance}
        </Text>
      )}
    </Box>
  );
};
