import type { Chain } from '@swapkit/core';
import { Box } from 'components/Atomic';

import { CopyAddress } from './CopyAddress';
import { GoToAccount } from './GoToAccount';
import { ResetHiddenAssets } from './ResetHiddenAssets';
import { ShowQrCode } from './ShowQrCode';

type Props = {
  chain: Chain;
  address: string;
};

export const WalletHeaderActions = ({ address, chain }: Props) => {
  return (
    <Box>
      <CopyAddress address={address} type="mini" />
      <CopyAddress address={address} type="icon" />
      <ResetHiddenAssets chain={chain} />
      <ShowQrCode address={address} chain={chain} />
      <GoToAccount address={address} chain={chain} />
    </Box>
  );
};
