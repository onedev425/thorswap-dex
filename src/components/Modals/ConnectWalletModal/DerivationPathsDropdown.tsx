import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box, DropdownMenu } from 'components/Atomic';
import { useMemo } from 'react';
import { IS_PROD } from 'settings/config';
import { DerivationPathType } from 'store/wallet/types';

const CHAINS_WITH_CUSTOM_DERIVATION_PATH = [Chain.Ethereum, Chain.Avalanche].concat(
  IS_PROD ? [] : [Chain.Bitcoin, Chain.Litecoin],
);

const evmLedgerTypes = [
  { value: '', label: "MetaMask (m/44'/60'/0'/0/{index})" },
  { value: 'ledgerLive', label: "Ledger Live (m/44'/60'/{index}'/0/0)" },
  { value: 'legacy', label: "Legacy (m/44'/60'/0'/{index})" },
];

const utxoLedgerTypes = (network = 0) => [
  { value: '', label: `Native Segwit (m/84'/${network}'/0'/0/{index})` },
  { value: 'nativeSegwitMiddle', label: `Native Segwit (m/84'/${network}'/{index}'/0/0)` },
  { value: 'segwit', label: `Segwit (m/49'/${network}'/0'/0/{index})` },
  { value: 'legacy', label: `Legacy (m/44'/${network}'/0'/0/{index})` },
];

const useLedgerTypes = (chain: Chain) => {
  const types = useMemo(() => {
    switch (chain) {
      case Chain.Bitcoin:
      case Chain.Litecoin:
        return utxoLedgerTypes(chain === Chain.Bitcoin ? 0 : 2);

      case Chain.Ethereum:
      case Chain.Avalanche:
        return evmLedgerTypes;

      default:
        return [];
    }
  }, [chain]);

  return types;
};

type Props = {
  chain: Chain;
  ledgerIndex: number;
  derivationPathType?: DerivationPathType;
  setDerivationPathType: (path?: DerivationPathType) => void;
};

export const DerivationPathDropdown = ({
  derivationPathType,
  chain,
  ledgerIndex,
  setDerivationPathType,
}: Props) => {
  const types = useLedgerTypes(chain);

  if (!CHAINS_WITH_CUSTOM_DERIVATION_PATH.includes(chain)) return null;

  return (
    <Box className="ml-auto mr-4 w-70 h-10">
      <DropdownMenu
        stretch
        menuItems={types}
        onChange={(v) => setDerivationPathType(v as DerivationPathType)}
        openComponent={
          <Box alignCenter className="gap-2 w-fit">
            <Text textStyle="caption">
              {types
                .find(({ value }) => !derivationPathType || value === derivationPathType)
                ?.label?.replace('{index}', (ledgerIndex || 0).toString())}
            </Text>
          </Box>
        }
        value={derivationPathType || ''}
      />
    </Box>
  );
};
