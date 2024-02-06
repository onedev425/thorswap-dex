import { Text } from '@chakra-ui/react';
import { AssetValue, Chain } from '@swapkit/core';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { useWallet } from 'context/wallet/hooks';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { useGetFullMemberQuery } from 'store/midgard/api';
import type { FullMemberPool } from 'store/midgard/types';
import { PoolShareType } from 'store/midgard/types';

import { WithdrawPanel } from './WithdrawPanel';

export const WithdrawLiquidity = () => {
  const { walletAddresses, isWalletLoading } = useWallet();

  const { assetParam = AssetValue.fromChainOrSignature(Chain.Bitcoin).toString() } = useParams<{
    assetParam: string;
  }>();

  const { data: lpMemberData, isLoading: lpMemberLoading } = useGetFullMemberQuery(
    walletAddresses,
    { skip: !walletAddresses.length || isWalletLoading },
  );

  const [poolAsset, positions] = useMemo(() => {
    if (lpMemberLoading || !lpMemberData) return [];
    const poolDataPositions = lpMemberData.filter((a) => a.pool === assetParam.toUpperCase());

    if (!poolDataPositions) return [];
    const [{ pool }] = poolDataPositions;

    return [AssetValue.fromStringSync(pool), poolDataPositions];
  }, [assetParam, lpMemberData, lpMemberLoading]);

  const shares = useMemo(() => {
    const pendingPosition = positions?.find(
      ({ assetPending, runePending }) => Number(assetPending) > 0 || Number(runePending) > 0,
    );
    const symPosition =
      !pendingPosition &&
      positions?.find(({ runeAddress, assetAddress }) => runeAddress && assetAddress);
    const runeAsymPosition = positions?.find(
      ({ runeAddress, assetAddress }) => runeAddress && !assetAddress,
    );
    const assetAsymPosition = positions?.find(
      ({ runeAddress, assetAddress }) => !runeAddress && assetAddress,
    );

    const activePositions = {} as Record<PoolShareType, undefined | null | FullMemberPool>;
    if (pendingPosition) activePositions[PoolShareType.PENDING] = pendingPosition;
    if (symPosition) activePositions[PoolShareType.SYM] = symPosition;
    if (runeAsymPosition) activePositions[PoolShareType.RUNE_ASYM] = runeAsymPosition;
    if (assetAsymPosition) activePositions[PoolShareType.ASSET_ASYM] = assetAsymPosition;

    return activePositions;
  }, [positions]);

  if (poolAsset && Object.values(shares).length) {
    return <WithdrawPanel poolAsset={poolAsset} shares={shares} />;
  }

  return (
    <PanelView
      header={
        <ViewHeader
          withBack
          actionsComponent={<GlobalSettingsPopover />}
          title={t('views.liquidity.withdrawLiquidity')}
        />
      }
      title={t('views.liquidity.withdrawLiquidity')}
    >
      <Text>{t('views.liquidity.noLiquidityToWithdraw')}</Text>
    </PanelView>
  );
};

export default WithdrawLiquidity;
