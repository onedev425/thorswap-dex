import { AssetInputs } from 'views/AddLiquidity/AssetInputs'
import { PoolInfo } from 'views/AddLiquidity/PoolInfo'
import { useTxDeposit } from 'views/Multisig/TxDeposit/hooks'

import { Box, Button } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { ConfirmModal } from 'components/Modals/ConfirmModal'

import { t } from 'services/i18n'

export const TxDeposit = () => {
  const {
    poolAsset,
    liquidityType,
    handleSelectLiquidityType,
    poolAssetInput,
    runeAssetInput,
    poolAssetList,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    handleSelectPoolAsset,
    isAssetPending,
    isRunePending,
    totalFeeInUSD,
    addLiquiditySlip,
    poolShareEst,
    pool,
    isValidDeposit,
    handleAddLiquidity,
    depositAssets,
    visibleConfirmModal,
    handleConfirmAdd,
    setVisibleConfirmModal,
    confirmInfo,
  } = useTxDeposit()

  return (
    <Box className="gap-1" col flex={1}>
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

      <Box className="w-full pt-5">
        <Button
          stretch
          size="lg"
          isFancy
          disabled={!isValidDeposit.valid}
          error={!isValidDeposit.valid}
          onClick={handleAddLiquidity}
        >
          {t('views.multisig.createTransaction')}
        </Button>
      </Box>

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onConfirm={handleConfirmAdd}
        onClose={() => setVisibleConfirmModal(false)}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>
    </Box>
  )
}
