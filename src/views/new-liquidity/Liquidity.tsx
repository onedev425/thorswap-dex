import { Chain } from '@swapkit/core';
import type { FullMemberPool } from '@thorswap-lib/midgard-sdk';
import { Box, Button, Icon, Modal } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { Input } from 'components/Input';
import { PanelView } from 'components/PanelView';
import { ReloadButton } from 'components/ReloadButton';
import { ViewHeader } from 'components/ViewHeader';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { useCheckHardCap } from 'hooks/useCheckHardCap';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'services/i18n';
import { IS_PROTECTED } from 'settings/config';
import { getAddLiquidityRoute, ROUTES } from 'settings/router';
import { useGetFullMemberQuery } from 'store/midgard/api';
import { ChainLiquidityPanel } from 'views/new-liquidity/ChainLiquidityPanel';

export const Liquidity = () => {
  const navigate = useNavigate();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { walletAddresses: connectedAddresses, isWalletLoading } = useWallet();
  const hardCapReached = useCheckHardCap();
  const [tipVisible, setTipVisible] = useState(true);
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [formTestAddresses, setFormValue] = useState<{ [key in Chain]?: string }>({});
  const [testAddresses, setTestAddresses] = useState<{ [key in Chain]?: string }>({});

  const walletAddresses = useMemo(
    () =>
      Object.values(testAddresses).length > 0 ? Object.values(testAddresses) : connectedAddresses,
    [connectedAddresses, testAddresses],
  );

  const {
    data: lpMemberData,
    isFetching: isLiquiditiesFetching,
    refetch,
  } = useGetFullMemberQuery(walletAddresses, {
    skip: !walletAddresses.length || isWalletLoading,
  });

  const hasPendingLP = useMemo(
    () =>
      lpMemberData?.some(
        ({ assetPending, runePending }) => parseInt(assetPending) > 0 || parseInt(runePending) > 0,
      ),
    [lpMemberData],
  );

  const LPPerChain = useMemo(
    () =>
      lpMemberData?.reduce(
        (acc, item) => {
          const [chain] = item.pool.split('.') as [Chain, string];
          acc[chain] = [...(acc[chain] || []), item];

          return acc;
        },
        {} as { [key in Chain]?: FullMemberPool[] },
      ) ?? {},
    [lpMemberData],
  );

  return (
    <PanelView
      description={t('views.liquidity.description')}
      header={
        <ViewHeader
          actionsComponent={
            <>
              {IS_PROTECTED && (
                <Button
                  className="mr-4"
                  onClick={() => setIsTestModalVisible(true)}
                  size="sm"
                  variant="fancy"
                >
                  Test Modal
                </Button>
              )}
              <ReloadButton loading={isWalletLoading || isLiquiditiesFetching} onLoad={refetch} />
            </>
          }
          title={t('common.liquidityPosition')}
        />
      }
      keywords="LP, Liquidity provider, THORSwap, THORChain, DEFI, DEX"
      title={t('views.liquidity.title')}
    >
      <Box col className="gap-3 self-stretch">
        {hasPendingLP && tipVisible && (
          <InfoTip
            className="mt-0 mb-4"
            content={t('pendingLiquidity.pendingInfoGeneral')}
            onClose={() => setTipVisible(false)}
            title={t('pendingLiquidity.pendingInfoTitle')}
            type="warn"
          />
        )}

        <Box className="w-full gap-x-8" justify="between">
          {walletAddresses.length > 0 ? (
            <>
              <Box className="w-full">
                <Button
                  stretch
                  disabled={hardCapReached}
                  onClick={() => navigate(getAddLiquidityRoute())}
                  rightIcon={hardCapReached ? <Icon name="infoCircle" size={20} /> : undefined}
                  size="lg"
                  tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
                  tooltipClasses="text-center mx-[-2px]"
                  variant={hardCapReached ? 'fancyError' : 'primary'}
                >
                  {t('common.deposit')}
                </Button>
              </Box>
              <Box className="w-full">
                <Button stretch onClick={() => navigate(ROUTES.CreateLiquidity)} size="lg">
                  {t('common.create')}
                </Button>
              </Box>
            </>
          ) : (
            <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
              {t('common.connectWallet')}
            </Button>
          )}
        </Box>

        {Object.entries(LPPerChain).map(([chain, data]) => (
          <ChainLiquidityPanel
            chain={chain as Chain}
            data={data}
            hardCapReached={hardCapReached}
            key={chain}
          />
        ))}
      </Box>

      {IS_PROTECTED && (
        <Modal
          isOpened={isTestModalVisible}
          onClose={() => setIsTestModalVisible(false)}
          title="Type in address to show it's LP positions"
        >
          <Box col className="gap-2" flex={1}>
            {Object.keys(Chain).map((chain) => (
              <Input
                stretch
                border="rounded"
                className="!text-md p-1.5 flex-1 border"
                containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
                key={chain}
                onChange={(e) => setFormValue((prev) => ({ ...prev, [chain]: e.target.value }))}
                placeholder={chain}
                value={formTestAddresses[chain as Chain] ?? ''}
              />
            ))}

            <Button
              stretch
              className="mt-4"
              onClick={() => {
                setTestAddresses(formTestAddresses);
                setIsTestModalVisible(false);
              }}
              size="lg"
              variant="fancy"
            >
              Save
            </Button>
          </Box>
        </Modal>
      )}
    </PanelView>
  );
};
