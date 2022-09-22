import { Chain, SupportedChain } from '@thorswap-lib/types';
import { Box, DropdownMenu, Icon, IconName, Typography } from 'components/Atomic';
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types';
import { chainName } from 'helpers/chainName';

export const thornameChainIcons: Record<string, IconName> = {
  [Chain.Avalanche]: 'avax',
  [Chain.Binance]: 'bnb',
  [Chain.BitcoinCash]: 'bch',
  [Chain.Bitcoin]: 'bitcoin',
  [Chain.Cosmos]: 'cos',
  [Chain.Doge]: 'doge',
  [Chain.Ethereum]: 'eth',
  [Chain.Litecoin]: 'ltc',
  [Chain.THORChain]: 'thor',
};

const CHAIN_ITEMS: DropdownMenuItem[] = Object.entries(thornameChainIcons).map(([value, icon]) => ({
  value,
  Component: (
    <Box alignCenter className="gap-x-2">
      <Icon name={icon} />
      <Typography>{chainName(value)}</Typography>
    </Box>
  ),
}));

type Props = {
  chain: SupportedChain;
  onChange: (chain: string) => void;
};

export const ChainDropdown = ({ chain, onChange }: Props) => {
  return (
    <DropdownMenu
      buttonClassName="w-[95px] !py-2"
      menuItems={CHAIN_ITEMS}
      onChange={onChange}
      openComponent={
        <Box alignCenter className="gap-x-2">
          <Icon name={thornameChainIcons[chain]} />
          <Typography>{chainName(chain)}</Typography>
        </Box>
      }
      value={chain}
    />
  );
};
