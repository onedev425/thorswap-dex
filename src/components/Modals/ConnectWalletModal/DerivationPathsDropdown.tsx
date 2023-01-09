import { Chain } from '@thorswap-lib/types';
import { Box, DropdownMenu, Typography } from 'components/Atomic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IS_PROD } from 'settings/config';

const CHAINS_WITH_CUSTOM_DERIVATION_PATH = [Chain.Ethereum, Chain.Avalanche].concat(
  IS_PROD ? [] : [Chain.Bitcoin, Chain.Litecoin],
);

const ledgerLivePath = "44'/60'/{index}'/0/";
const nativeSegwitMiddlePath = "84'/0'/{index}'/0/0";

const evmLedgerTypes = [
  { value: "44'/60'/0'/0/{index}", label: "MetaMask (m/44'/60'/0'/0/{index})" },
  { value: ledgerLivePath, label: "Ledger Live (m/44'/60'/{index}'/0/0)" },
  { value: "44'/60'/0'/{index}", label: "Legacy (m/44'/60'/0'/{index})" },
];

const btcLedgerTypes = [
  { value: "84'/0'/0'/0/{index}", label: "Native Segwit (m/84'/0'/0'/0/{index})" },
  { value: nativeSegwitMiddlePath, label: "Native Segwit (86'/0'/{index}'/0/0)" },
  { value: "49'/0'/0'/0/{index}", label: "Segwit (m/49'/0'/0'/0/{index})" },
  { value: "44'/0'/0'/0/{index}", label: "Legacy (m/44'/0'/0'/0/{index})" },
];

const ltcLedgerTypes = [
  { value: "84'/2'/0'/0/{index}", label: "Native Segwit (m/84'/2'/0'/0/{index})" },
  { value: "49'/2'/0'/0/{index}", label: "Segwit (m/49'/2'/0'/0/{index})" },
  { value: "44'/2'/0'/0/{index}", label: "Legacy (m/44'/2'/0'/0/{index})" },
];

const useLedgerTypes = (chain: Chain) => {
  const [pathTemplate, setPathTemplate] = useState<string>('');
  const types = useMemo(() => {
    switch (chain) {
      case Chain.Bitcoin:
        return btcLedgerTypes;
      case Chain.Litecoin:
        return ltcLedgerTypes;
      default:
        return evmLedgerTypes;
    }
  }, [chain]);

  useEffect(() => {
    setPathTemplate(types[0].value);
  }, [chain, types]);

  return { types, pathTemplate, setPathTemplate };
};

type Props = {
  chain: Chain;
  ledgerIndex: number;
  setCustomDerivationPath: (path: string) => void;
};

export const DerivationPathDropdown = ({ chain, ledgerIndex, setCustomDerivationPath }: Props) => {
  const { types, setPathTemplate, pathTemplate } = useLedgerTypes(chain);
  const handleDerivationPathChange = useCallback(
    (pathTemplate: string) => {
      setPathTemplate(pathTemplate);
      const indexInMiddle = [nativeSegwitMiddlePath, ledgerLivePath].includes(pathTemplate);
      setCustomDerivationPath(
        pathTemplate.replace('{index}', indexInMiddle ? ledgerIndex.toString() : ''),
      );
    },
    [ledgerIndex, setCustomDerivationPath, setPathTemplate],
  );

  if (!CHAINS_WITH_CUSTOM_DERIVATION_PATH.includes(chain)) return null;

  return (
    <Box className="ml-auto mr-4 w-70 h-10">
      <DropdownMenu
        stretch
        menuItems={types}
        onChange={handleDerivationPathChange}
        openComponent={
          <Box alignCenter className="gap-2 w-fit">
            <Typography variant="caption">
              {types
                .find(({ value }) => value === pathTemplate)
                ?.label?.replace('{index}', (ledgerIndex || 0).toString())}
            </Typography>
          </Box>
        }
        value={pathTemplate}
      />
    </Box>
  );
};
