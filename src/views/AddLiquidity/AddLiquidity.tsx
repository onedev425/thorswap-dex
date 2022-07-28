import { Asset } from '@thorswap-lib/multichain-sdk'
import { ADD_LIQUIDITY_GUIDE_URL } from 'config/constants'

import { useAddLiquidity } from 'views/AddLiquidity/hooks/hooks'
import { useAddLiquidityPools } from 'views/AddLiquidity/hooks/useAddLiquidityPools'
import { useAssetsList } from 'views/AddLiquidity/hooks/useAssetsList'

import { Button, Box, Link } from 'components/Atomic'
import { GlobalSettingsPopover } from 'components/GlobalSettings'
import { InfoTable } from 'components/InfoTable'
import { InfoTip } from 'components/InfoTip'
import { LiquidityCard } from 'components/LiquidityCard'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { TxTrackerStatus } from 'store/midgard/types'

import { useLiquidityType } from 'hooks/useLiquidityType'

import { t } from 'services/i18n'

import { AssetInputs } from './AssetInputs'
import { PoolInfo } from './PoolInfo'
import { liquidityToPoolShareType } from './utils'

export const AddLiquidity = () => {
  const { liquidityType, setLiquidityType } = useLiquidityType()
  const { poolAssets, pools, pool, poolAsset, handleSelectPoolAsset } =
    useAddLiquidityPools()
  const poolAssetList = useAssetsList({ liquidityType, poolAssets, pools })

  const {
    title,
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
    assetApproveStatus,
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
  })

  return (
    <PanelView
      title={title}
      header={
        <ViewHeader
          title={t('common.addLiquidity')}
          actionsComponent={<GlobalSettingsPopover transactionMode />}
        />
      }
    >
      <LiquidityType
        poolAsset={poolAsset}
        selected={liquidityType}
        onChange={handleSelectLiquidityType}
        options={[
          LiquidityTypeOption.ASSET,
          LiquidityTypeOption.SYMMETRICAL,
          LiquidityTypeOption.RUNE,
        ]}
      />

      <AssetInputs
        poolAsset={poolAssetInput}
        runeAsset={runeAssetInput}
        poolAssetList={poolAssetList}
        onAssetAmountChange={handleChangeAssetAmount}
        onRuneAmountChange={handleChangeRuneAmount}
        onPoolChange={handleSelectPoolAsset}
        liquidityType={liquidityType}
        isAssetPending={isAssetPending}
        isRunePending={isRunePending}
      />

      <PoolInfo
        poolTicker={poolAssetInput.asset.ticker}
        runeTicker={runeAssetInput.asset.ticker}
        fee={totalFeeInUSD}
        slippage={addLiquiditySlip}
        poolShare={poolShareEst}
        rate={pool?.assetPriceInRune?.toSignificant(6) ?? null}
      />

      {poolMemberDetail && pool && (
        <LiquidityCard
          {...poolMemberDetail}
          pool={pool}
          shareType={liquidityToPoolShareType(liquidityType)}
        />
      )}

      {[LiquidityTypeOption.ASSET, LiquidityTypeOption.RUNE].includes(
        liquidityType,
      ) &&
        asymmTipVisible && (
          <InfoTip
            title={t('views.addLiquidity.asymmetricPoolTip')}
            content={
              <>
                {`${t('views.addLiquidity.asymmetricPoolNotice0', {
                  depositAsset:
                    liquidityType === LiquidityTypeOption.ASSET
                      ? poolAsset.ticker
                      : Asset.RUNE(),
                  asset: poolAsset.ticker,
                })} `}
                <Link
                  className="text-twitter-blue"
                  to={ADD_LIQUIDITY_GUIDE_URL}
                >
                  {t('common.learnMore')}
                </Link>
              </>
            }
            onClose={() => setAsymmTipVisible(false)}
            type="warn"
          />
        )}

      {currentAssetHaveLP && existingLPTipVisible && (
        <InfoTip
          title={t('views.addLiquidity.existingLpTip')}
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
          type="warn"
        />
      )}

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button
            stretch
            size="lg"
            isFancy
            onClick={handleApprove}
            loading={[
              TxTrackerStatus.Pending,
              TxTrackerStatus.Submitting,
            ].includes(assetApproveStatus)}
          >
            {t('common.approve')}
          </Button>
        </Box>
      )}

      {isDepositAvailable && (
        <Box className="w-full pt-5">
          <Button
            stretch
            size="lg"
            isFancy
            disabled={!isValidDeposit.valid}
            error={!isValidDeposit.valid}
            onClick={handleAddLiquidity}
          >
            {btnLabel}
          </Button>
        </Box>
      )}

      {!isWalletConnected && (
        <Box className="w-full pt-5">
          <Button
            isFancy
            stretch
            size="lg"
            onClick={() => setIsConnectModalOpen(true)}
          >
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onConfirm={handleConfirmAdd}
        onClose={() => setVisibleConfirmModal(false)}
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
  )
}

export default AddLiquidity
