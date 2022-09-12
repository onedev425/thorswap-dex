import { hasConnectedWallet } from '@thorswap-lib/multichain-sdk';
import { SupportedChain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTip } from 'components/InfoTip';
import { PanelView } from 'components/PanelView';
import { ReloadButton } from 'components/ReloadButton';
import { ViewHeader } from 'components/ViewHeader';
import { sortChains } from 'helpers/chains';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, ROUTES } from 'settings/constants';
import { useMidgard } from 'store/midgard/hooks';
import { hasPendingLP } from 'store/midgard/utils';
import { useWallet } from 'store/wallet/hooks';

import { ChainLiquidityPanel } from './ChainLiquidityPanel';

const Liquidity = () => {
  const membersLoading = useRef(false);
  const detailsLoading = useRef(false);
  const navigate = useNavigate();
  const { wallet, setIsConnectModalOpen } = useWallet();

  const {
    pendingLP,
    chainMemberDetails,
    getAllMemberDetails,
    chainMemberDetailsLoading,
    getAllLpDetails,
    lpAddedAndWithdraw,
  } = useMidgard();

  const [tipVisible, setTipVisible] = useState(true);

  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);

  const hasPendingDeposit = useMemo(() => Object.keys(pendingLP).length > 0, [pendingLP]);

  const hasPending = useMemo(
    () => hasPendingLP(chainMemberDetails) || hasPendingDeposit,
    [chainMemberDetails, hasPendingDeposit],
  );

  const isLoadingLiquidities = useMemo(
    () => Object.values(chainMemberDetailsLoading).some((l) => l),
    [chainMemberDetailsLoading],
  );

  useEffect(() => {
    if (!membersLoading.current) {
      membersLoading.current = true;
      getAllMemberDetails().finally(() => {
        membersLoading.current = false;
      });
    }
  }, [getAllMemberDetails]);

  useEffect(() => {
    if (!detailsLoading.current) {
      detailsLoading.current = true;
      getAllLpDetails().finally(() => {
        detailsLoading.current = false;
      });
    }
  }, [getAllLpDetails]);

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            <>
              {isWalletConnected && (
                <ReloadButton loading={isLoadingLiquidities} onLoad={getAllMemberDetails} />
              )}
              <GlobalSettingsPopover />
            </>
          }
          title={t('common.liquidityPosition')}
        />
      }
      title={t('common.liquidity')}
    >
      <Box col className="gap-3 self-stretch">
        {hasPending && tipVisible && (
          <InfoTip
            className="mt-0 mb-4"
            content={t('pendingLiquidity.pendingInfoGeneral')}
            onClose={() => setTipVisible(false)}
            title={t('pendingLiquidity.pendingInfoTitle')}
            type="warn"
          />
        )}

        {isWalletConnected ? (
          <>
            <Box className="w-full gap-x-8" justify="between">
              <Button stretch onClick={() => navigate(getAddLiquidityRoute())} size="lg">
                {t('common.deposit')}
              </Button>

              <Button stretch onClick={() => navigate(ROUTES.CreateLiquidity)} size="lg">
                {t('common.create')}
              </Button>
            </Box>

            {!!Object.keys(chainMemberDetails).length && (
              <Box col className="w-full gap-2">
                {sortChains(Object.keys(chainMemberDetails)).map((chain) => (
                  <ChainLiquidityPanel
                    chain={chain as SupportedChain}
                    data={chainMemberDetails[chain]}
                    isLoading={chainMemberDetailsLoading?.[chain] ?? false}
                    key={chain}
                    lpAddedAndWithdraw={lpAddedAndWithdraw}
                  />
                ))}
              </Box>
            )}
          </>
        ) : (
          <Box className="w-full gap-x-8" justify="between">
            <Button isFancy stretch onClick={() => setIsConnectModalOpen(true)} size="lg">
              {t('common.connectWallet')}
            </Button>
          </Box>
        )}
      </Box>
    </PanelView>
  );
};

export default Liquidity;
