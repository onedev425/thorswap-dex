import { Text } from '@chakra-ui/react';
import type { Chain } from '@swapkit/core';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, DropdownMenu } from 'components/Atomic';
import type { DropdownMenuItem } from 'components/Atomic/Dropdown/types';
import { chainName } from 'helpers/chainName';
import { THORCHAIN_UNSUPPORTED_CHAINS } from 'helpers/wallet';
import { SORTED_CHAINS } from 'settings/chain';

const CHAIN_ITEMS: DropdownMenuItem[] = SORTED_CHAINS.filter(
  (c) => !THORCHAIN_UNSUPPORTED_CHAINS.includes(c),
).map((chain) => ({
  value: chain,
  Component: (
    <Box alignCenter className="gap-x-2">
      <ChainIcon withoutBackground chain={chain} size={24} />
      <Text>{chainName(chain, true)}</Text>
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
      buttonClassName="!w-[120px]"
      className="!w-[120px] mr-2"
      menuItems={CHAIN_ITEMS}
      onChange={onChange}
      openComponent={
        <Box alignCenter className="gap-x-2">
          <ChainIcon withoutBackground chain={chain} size={24} />
          <Text>{chainName(chain)}</Text>
        </Box>
      }
      value={chain}
    />
  );
};
