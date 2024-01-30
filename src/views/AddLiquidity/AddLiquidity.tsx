import { Chain, SwapKitNumber } from '@swapkit/core';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { LiquidityCard } from 'components/LiquidityCard';
import { LiquidityType } from 'components/LiquidityType/LiquidityType';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { ADD_LIQUIDITY_GUIDE_URL } from 'config/constants';
import { BTCAsset, RUNEAsset } from 'helpers/assets';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useCheckHardCap } from 'hooks/useCheckHardCap';
import { useLiquidityType } from 'hooks/useLiquidityType';
import { usePools } from 'hooks/usePools';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { LiquidityTypeOption, PoolShareType } from 'store/midgard/types';
import { AddLPProgressModal } from 'views/AddLiquidity/AddLPProgressModal';
import { useAddLiquidity } from 'views/AddLiquidity/hooks/hooks';
import { useAddLiquidityPools } from 'views/AddLiquidity/hooks/useAddLiquidityPools';
import { useDepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance';

import { AssetInputs } from './AssetInputs';
import { PoolInfo } from './PoolInfo';

const liquidityToPoolShareType = (type: LiquidityTypeOption): PoolShareType => {
  if (type === LiquidityTypeOption.ASSET) return PoolShareType.ASSET_ASYM;
  if (type === LiquidityTypeOption.RUNE) return PoolShareType.RUNE_ASYM;
  return PoolShareType.SYM;
};

export const AddLiquidity = () => {
  const { liquidityType, setLiquidityType } = useLiquidityType();
  const { poolAsset, handleSelectPoolAsset } = useAddLiquidityPools();
  const { pools, allPoolAssets: poolAssets } = usePools();
  const depositAssetsBalance = useDepositAssetsBalance({ poolAsset });
  const hardCapReached = useCheckHardCap();
  const assetsWithBalances = useAssetsWithBalance();

  const pool = useMemo(() => {
    return (
      pools.find((p) => p.asset === (poolAsset || BTCAsset).toString().toUpperCase()) || pools[0]
    );
  }, [pools, poolAsset]);

  const assetSelectList = useMemo(
    () =>
      poolAssets
        .map(
          (asset) =>
            assetsWithBalances.find((a) => a.asset.eq(asset)) || { asset, balance: undefined },
        )
        // type === 'Native' should be first
        .sort((a, b) => Number(b.asset.type === 'Native') - Number(a.asset.type === 'Native')),
    [assetsWithBalances, poolAssets],
  );

  const {
    addLiquiditySlip,
    approveConfirmInfo,
    assetAddress,
    asymmTipVisible,
    btnLabel,
    confirmInfo,
    depositAssets,
    feeInUSD,
    symmetric,
    handleAddLiquidity,
    handleApprove,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    handleConfirmProgressModal,
    handleConfirmApprove,
    handleSelectLiquidityType,
    isApproveRequired,
    isAssetApproveLoading,
    isAssetPending,
    isDepositAvailable,
    isRunePending,
    isValidDeposit,
    isWalletConnected,
    lpMemberData,
    lpProgressModal,
    poolAddress,
    poolAssetInput,
    poolAssetValue,
    poolShareEst,
    rate,
    runeAddress,
    runeAssetInput,
    runeAssetValue,
    setAsymmTipVisible,
    setIsConnectModalOpen,
    setLpProgressModal,
    setVisibleApproveModal,
    setVisibleConfirmModal,
    visibleApproveModal,
    visibleConfirmModal,
  } = useAddLiquidity({
    depositAssetsBalance,
    liquidityType,
    poolAsset: poolAsset || BTCAsset,
    poolData: pool,
    setLiquidityType,
  });

  const bnbDepositDisabled = useMemo(() => poolAsset?.chain === Chain.Binance, [poolAsset]);
  const hasLP = useMemo(() => !!Object.keys(lpMemberData || {}).length, [lpMemberData]);

  return (
    <PanelView
      description={t('views.addLiquidity.description')}
      header={
        <ViewHeader
          actionsComponent={<GlobalSettingsPopover transactionMode />}
          title={`${t('common.addLiquidity')} - ${poolAsset?.ticker}${
            pool?.status === 'staged' ? ' (Staged)' : ''
          }`}
        />
      }
      keywords="LP, Liquidity provider, THORSwap, THORChain, DEFI, DEX"
      title={t('views.addLiquidity.title')}
    >
      <LiquidityType
        onChange={handleSelectLiquidityType}
        options={
          pool?.status === 'staged'
            ? [LiquidityTypeOption.SYMMETRICAL]
            : [LiquidityTypeOption.ASSET, LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE]
        }
        poolAsset={poolAsset || BTCAsset}
        selected={liquidityType}
      />

      <AssetInputs
        isAssetPending={isAssetPending}
        isRunePending={isRunePending}
        liquidityType={liquidityType}
        onAssetAmountChange={handleChangeAssetAmount}
        onPoolChange={handleSelectPoolAsset}
        onRuneAmountChange={handleChangeRuneAmount}
        poolAsset={poolAssetInput}
        poolAssetList={assetSelectList}
        runeAsset={runeAssetInput}
      />

      <PoolInfo
        fee={feeInUSD}
        poolShare={poolShareEst}
        poolTicker={poolAssetInput.asset.ticker}
        rate={new SwapKitNumber(rate).toSignificant(6) || null}
        runeTicker={runeAssetInput.asset.ticker}
        slippage={addLiquiditySlip}
      />

      {hasLP && pool && (
        <LiquidityCard
          {...lpMemberData}
          poolDetail={pool}
          shareType={liquidityToPoolShareType(liquidityType)}
        />
      )}

      {[LiquidityTypeOption.ASSET, LiquidityTypeOption.RUNE].includes(liquidityType) &&
        asymmTipVisible && (
          <InfoTip
            content={
              <>
                {`${t('views.addLiquidity.asymmetricPoolNotice0', {
                  depositAsset:
                    liquidityType === LiquidityTypeOption.ASSET
                      ? (poolAsset || BTCAsset).ticker
                      : RUNEAsset,
                  asset: (poolAsset || BTCAsset).ticker,
                })} `}
                <Link className="text-twitter-blue" to={ADD_LIQUIDITY_GUIDE_URL}>
                  {t('common.learnMore')}
                </Link>
              </>
            }
            onClose={() => setAsymmTipVisible(false)}
            title={t('views.addLiquidity.asymmetricPoolTip')}
            type="warn"
          />
        )}

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button
            stretch
            disabled={hardCapReached}
            error={hardCapReached}
            loading={isAssetApproveLoading}
            onClick={handleApprove}
            rightIcon={hardCapReached ? <Icon name="infoCircle" size={20} /> : undefined}
            size="lg"
            tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
            variant="fancy"
          >
            {t('common.approve')}
          </Button>
        </Box>
      )}

      {isDepositAvailable && (
        <Box className="w-full pt-5">
          <Button
            stretch
            disabled={bnbDepositDisabled || !isValidDeposit.valid || hardCapReached}
            error={bnbDepositDisabled || !isValidDeposit.valid || hardCapReached}
            onClick={handleAddLiquidity}
            rightIcon={hardCapReached ? <Icon name="infoCircle" size={20} /> : undefined}
            size="lg"
            tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
            variant="fancy"
          >
            {btnLabel}
          </Button>
        </Box>
      )}

      {!isWalletConnected && (
        <Box className="w-full pt-5">
          <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmProgressModal}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>

      {poolAsset && (
        <ConfirmModal
          inputAssets={[poolAsset]}
          isOpened={visibleApproveModal}
          onClose={() => setVisibleApproveModal(false)}
          onConfirm={handleConfirmApprove}
        >
          <InfoTable items={approveConfirmInfo} />
        </ConfirmModal>
      )}

      {lpProgressModal && (
        <AddLPProgressModal
          assetAddress={assetAddress}
          isOpened={lpProgressModal}
          onClose={() => setLpProgressModal(false)}
          poolAddress={poolAddress}
          poolAssetValue={poolAssetValue}
          runeAddress={runeAddress}
          runeAssetValue={runeAssetValue}
          symmetric={symmetric}
        />
      )}
    </PanelView>
  );
};

export default AddLiquidity;
