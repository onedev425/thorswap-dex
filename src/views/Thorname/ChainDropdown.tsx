import { Chain } from '@thorswap-lib/types';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, DropdownMenu, Typography } from 'components/Atomic';
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types';
import { chainName } from 'helpers/chainName';
import { SORTED_CHAINS } from 'settings/chain';

const CHAIN_ITEMS: DropdownMenuItem[] = SORTED_CHAINS.map((chain) => ({
  value: chain,
  Component: (
    <Box alignCenter className="gap-x-2">
      <ChainIcon withoutBackground chain={chain} size={24} />
      <Typography>{chainName(chain)}</Typography>
    </Box>
  ),
}));

type Props = {
  chain: Chain;
  onChange: (chain: string) => void;
};

export const ChainDropdown = ({ chain, onChange }: Props) => {
  return (
    <DropdownMenu
      buttonClassName="w-[120px]"
      menuItems={CHAIN_ITEMS}
      onChange={onChange}
      openComponent={
        <Box alignCenter className="gap-x-2">
          <ChainIcon withoutBackground chain={chain} size={24} />
          <Typography>{chainName(chain)}</Typography>
        </Box>
      }
      value={chain}
    />
  );
};
