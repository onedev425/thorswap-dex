import { ChainWallet } from '@thorswap-lib/multichain-sdk';
import { SupportedChain } from '@thorswap-lib/types';
import { Box, Typography } from 'components/Atomic';
import { WalletIcon } from 'components/WalletIcon/WalletIcon';
import { chainName } from 'helpers/chainName';

type Props = {
  chain: SupportedChain;
  chainWallet: Maybe<ChainWallet>;
  balance: string;
};

export const HeaderChainInfo = ({ chain, chainWallet, balance }: Props) => {
  return (
    <Box center className="space-x-1">
      {!!chainWallet && <WalletIcon size={16} walletType={chainWallet?.walletType} />}
      <Typography>{chainName(chain, true)}</Typography>

      {!!chainWallet && (
        <Typography color="primaryBtn" fontWeight="semibold">
          {balance}
        </Typography>
      )}
    </Box>
  );
};
