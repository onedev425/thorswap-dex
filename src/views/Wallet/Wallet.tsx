import { Box } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { AccountType } from 'views/Wallet/AccountType';
import { SearchAndFilters } from 'views/Wallet/SearchAndFilters';

const Wallet = () => {
  const { walletViewMode, setWalletViewMode } = useApp();

  const [keyword, setKeyword] = useState('');
  const [onlyConnected, setOnlyConnected] = useState(false);

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
