import { Asset } from '@thorswap-lib/multichain-core';
import { Box, Button, Link } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { LiquidityCard } from 'components/LiquidityCard';
import { LiquidityType } from 'components/LiquidityType/LiquidityType';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { ADD_LIQUIDITY_GUIDE_URL } from 'config/constants';
import { useLiquidityType } from 'hooks/useLiquidityType';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { useAddLiquidity } from 'views/AddLiquidity/hooks/hooks';
import { useAddLiquidityPools } from 'views/AddLiquidity/hooks/useAddLiquidityPools';
import { useAssetsList } from 'views/AddLiquidity/hooks/useAssetsList';
import { useDepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance';
import { useAssetsWithBalanceFromTokens } from 'views/Swap/hooks/useAssetsWithBalanceFromTokens';
import { useTokenList } from 'views/Swap/hooks/useTokenList';

import { AssetInputs } from './AssetInputs';
import { PoolInfo } from './PoolInfo';
import { liquidityToPoolShareType } from './utils';

export const AddLiquidity = () => {
  const { liquidityType, setLiquidityType } = useLiquidityType();
  const { poolAssets, pools, pool, poolAsset, handleSelectPoolAsset } = useAddLiquidityPools();
  const poolAssetList = useAssetsList({ liquidityType, poolAssets, pools });
  const { wallet } = useWallet();
  const depositAssetsBalance = useDepositAssetsBalance({ poolAsset });
  const { tokens } = useTokenList();

  const assetSelectList = useAssetsWithBalanceFromTokens(tokens);
  const filteredAssets = assetSelectList.filter((x) =>
    poolAssetList.some((asset) => asset.asset.eq(x.asset)),
  );

  const {
    handleSelectLiquidityType,
    poolAssetInput,
    runeAssetInput,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    isAssetPending,
    isRunePending,
    totalFeeInUSD,
    addLiquiditySlip,
    poolShareEst,
    poolMemberDetail,
    asymmTipVisible,
    setAsymmTipVisible,
    currentAssetHaveLP,
    existingLPTipVisible,
    setExistingLPTipVisible,
    isApproveRequired,
    handleApprove,
    isAssetApproveLoading,
    isDepositAvailable,
    isValidDeposit,
    handleAddLiquidity,
    btnLabel,
    isWalletConnected,
    setIsConnectModalOpen,
    depositAssets,
    visibleConfirmModal,
    handleConfirmAdd,
    setVisibleConfirmModal,
    confirmInfo,
    visibleApproveModal,
    setVisibleApproveModal,
    handleConfirmApprove,
    approveConfirmInfo,
  } = useAddLiquidity({
    liquidityType,
    setLiquidityType,
    pool,
    pools,
    poolAsset,
    poolAssets,
    depositAssetsBalance,
    wallet,
  });

  const isPoolStaged = pool?.detail.status === 'staged';

  return (
    <PanelView
      description={t('views.addLiquidity.description')}
      header={
        <ViewHeader
          actionsComponent={<GlobalSettingsPopover transactionMode />}
          title={t('common.addLiquidity')}
        />
      }
      keywords=" LP, Liquidity provider, THORSwap, THORChain, DEFI, DEX"
      title={t('views.addLiquidity.title')}
    >
      <LiquidityType
        onChange={handleSelectLiquidityType}
        options={
          isPoolStaged
            ? [LiquidityTypeOption.SYMMETRICAL]
            : [LiquidityTypeOption.ASSET, LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE]
        }
        poolAsset={poolAsset}
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
        poolAssetList={filteredAssets}
        runeAsset={runeAssetInput}
      />

      <PoolInfo
        fee={totalFeeInUSD}
        poolShare={poolShareEst}
        poolTicker={poolAssetInput.asset.ticker}
        rate={pool?.assetPriceInRune?.toSignificant(6) ?? null}
        runeTicker={runeAssetInput.asset.ticker}
        slippage={addLiquiditySlip}
      />

      {poolMemberDetail && pool && (
        <LiquidityCard
          {...poolMemberDetail}
          pool={pool}
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
                    liquidityType === LiquidityTypeOption.ASSET ? poolAsset.ticker : Asset.RUNE(),
                  asset: poolAsset.ticker,
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

      {currentAssetHaveLP && existingLPTipVisible && (
        <InfoTip
          content={
            <>
              {t('views.addLiquidity.existingLpTipNotice')}
              <Link className="text-twitter-blue" to={ADD_LIQUIDITY_GUIDE_URL}>
                {' '}
                {t('common.learnMore')}
              </Link>
            </>
          }
          onClose={() => setExistingLPTipVisible(false)}
          title={t('views.addLiquidity.existingLpTip')}
          type="warn"
        />
      )}

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button isFancy stretch loading={isAssetApproveLoading} onClick={handleApprove} size="lg">
            {t('common.approve')}
          </Button>
        </Box>
      )}

      {isDepositAvailable && (
        <Box className="w-full pt-5">
          <Button
            isFancy
            stretch
            disabled={!isValidDeposit.valid}
            error={!isValidDeposit.valid}
            onClick={handleAddLiquidity}
            size="lg"
          >
            {btnLabel}
          </Button>
        </Box>
      )}

      {!isWalletConnected && (
        <Box className="w-full pt-5">
          <Button isFancy stretch onClick={() => setIsConnectModalOpen(true)} size="lg">
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmAdd}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>

      <ConfirmModal
        inputAssets={[poolAsset]}
        isOpened={visibleApproveModal}
        onClose={() => setVisibleApproveModal(false)}
        onConfirm={handleConfirmApprove}
      >
        <InfoTable items={approveConfirmInfo} />
      </ConfirmModal>
    </PanelView>
  );
};

export default AddLiquidity;
