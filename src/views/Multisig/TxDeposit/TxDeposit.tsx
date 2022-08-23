import { useState } from 'react'

import { AssetInputs } from 'views/AddLiquidity/AssetInputs'
import { PoolInfo } from 'views/AddLiquidity/PoolInfo'
import { useTxDeposit } from 'views/Multisig/TxDeposit/hooks'

import { Box, Button } from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { InfoTip } from 'components/InfoTip'
import { LiquidityType } from 'components/LiquidityType/LiquidityType'
import { LiquidityTypeOption } from 'components/LiquidityType/types'
import { ConfirmModal } from 'components/Modals/ConfirmModal'
import { PanelInput } from 'components/PanelInput'

import { t } from 'services/i18n'

export const TxDeposit = () => {
  const [assetSideAddress, setassetSideAddress] = useState('')
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
  } = useTxDeposit(assetSideAddress)

  return (
    <Box col flex={1}>
      <LiquidityType
        poolAsset={poolAsset}
        selected={liquidityType}
        onChange={handleSelectLiquidityType}
        options={[LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE]}
        tabsCount={2}
      />

      <Box className="pb-1" flex={1} />

      {liquidityType === LiquidityTypeOption.SYMMETRICAL && (
        <Box col>
          <InfoTip
            className="mb-1"
            type="warn"
            content={t('views.multisig.depositSymWarning')}
          />
          <PanelInput
            className="mb-1"
            title={t('views.multisig.assetWalletAddress')}
            value={assetSideAddress}
            onChange={(e) => setassetSideAddress(e.target.value)}
          />
        </Box>
      )}

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
