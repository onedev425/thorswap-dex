import { Box, Button } from 'components/Atomic';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { LiquidityType } from 'components/LiquidityType/LiquidityType';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelInput } from 'components/PanelInput';
import { useState } from 'react';
import { t } from 'services/i18n';
import { AssetInputs } from 'views/AddLiquidity/AssetInputs';
import { PoolInfo } from 'views/AddLiquidity/PoolInfo';
import { useTxDeposit } from 'views/Multisig/TxDeposit/hooks';

export const TxDeposit = () => {
  const [assetSideAddress, setassetSideAddress] = useState('');
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
  } = useTxDeposit(assetSideAddress);

  return (
    <Box col flex={1}>
      <LiquidityType
        onChange={handleSelectLiquidityType}
        options={[LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE]}
        poolAsset={poolAsset}
        selected={liquidityType}
        tabsCount={2}
      />

      <Box className="pb-1" flex={1} />

      {liquidityType === LiquidityTypeOption.SYMMETRICAL && (
        <Box col>
          <InfoTip className="mb-1" content={t('views.multisig.depositSymWarning')} type="warn" />
          <PanelInput
            className="mb-1"
            onChange={(e) => setassetSideAddress(e.target.value)}
            title={t('views.multisig.assetWalletAddress')}
            value={assetSideAddress}
          />
        </Box>
      )}

      <AssetInputs
        isAssetPending={isAssetPending}
        isRunePending={isRunePending}
        liquidityType={liquidityType}
        onAssetAmountChange={handleChangeAssetAmount}
        onPoolChange={handleSelectPoolAsset}
        onRuneAmountChange={handleChangeRuneAmount}
        poolAsset={poolAssetInput}
        poolAssetList={poolAssetList}
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

      <Box className="w-full pt-5">
        <Button
          isFancy
          stretch
          disabled={!isValidDeposit.valid}
          error={!isValidDeposit.valid}
          onClick={handleAddLiquidity}
          size="lg"
        >
          {t('views.multisig.createTransaction')}
        </Button>
      </Box>

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmAdd}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>
    </Box>
  );
};
