import { SUPPORTED_CHAINS } from '@thorswap-lib/types';
import { Box } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { chainToSigAsset } from 'helpers/assets';
import { useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useAppDispatch } from 'store/store';
import { useWallet } from 'store/wallet/hooks';
import { AccountType } from 'views/Wallet/AccountType';
import { SearchAndFilters } from 'views/Wallet/SearchAndFilters';

const Wallet = () => {
  const dispatch = useAppDispatch();
  const { walletViewMode, setWalletViewMode } = useApp();
  const { getCoingeckoData, geckoData } = useWallet();

  const [keyword, setKeyword] = useState('');
  const [onlyConnected, setOnlyConnected] = useState(false);

  const filteredSupportedChains = useMemo(
    () =>
      SUPPORTED_CHAINS.filter((chain) => {
        const { ticker } = chainToSigAsset(chain);
        return !geckoData?.[ticker];
      }),
    [geckoData],
  );

  const sigSymbols = useMemo(
    () => filteredSupportedChains.map((chain) => chainToSigAsset(chain).ticker),
    [filteredSupportedChains],
  );

  useEffect(() => {
    if (sigSymbols.length > 0) {
      dispatch(getCoingeckoData(sigSymbols));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sigSymbols.length]);

  return (
    <Box col className="w-full">
      <Helmet
        content="Manage you tokens in your custodial wallet on THORSwap"
        keywords="Wallet, Tokens, THORSwap, THORChain, DEFI, DEX"
        title={t('views.wallet.wallet')}
      />
      <SearchAndFilters
        keyword={keyword}
        onlyConnected={onlyConnected}
        setKeyword={setKeyword}
        setOnlyConnected={setOnlyConnected}
        setWalletViewMode={setWalletViewMode}
        walletViewMode={walletViewMode}
      />

      <Box className="w-full mt-4">
        <AccountType keyword={keyword} onlyConnected={onlyConnected} />
      </Box>
    </Box>
  );
};

export default Wallet;
