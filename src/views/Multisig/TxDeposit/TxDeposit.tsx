import { Box, Button } from 'components/Atomic';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { LiquidityType } from 'components/LiquidityType/LiquidityType';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelInput } from 'components/PanelInput';
import { useState } from 'react';
import { t } from 'services/i18n';
import { LiquidityTypeOption } from 'store/midgard/types';
import { AssetInputs } from 'views/AddLiquidity/AssetInputs';
import { PoolInfo } from 'views/AddLiquidity/PoolInfo';
import { useTxDeposit } from 'views/Multisig/TxDeposit/hooks';

export const TxDeposit = () => {
  const [assetSideAddress, setassetSideAddress] = useState('');
  const {
    addLiquiditySlip,
    confirmInfo,
    feeInUSD,
    handleAddLiquidity,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    handleConfirmAdd,
    handleSelectLiquidityType,
    handleSelectPoolAsset,
    isAssetPending,
    isRunePending,
    isValidDeposit,
    liquidityType,
    poolAsset,
    poolAssetInput,
    poolAssetList,
    poolShareEst,
    runeAssetInput,
    setVisibleConfirmModal,
    visibleConfirmModal,
    rate,
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
        fee={feeInUSD}
        poolShare={poolShareEst}
        poolTicker={poolAssetInput.asset.ticker}
        rate={rate.toFixed(6)}
        runeTicker={runeAssetInput.asset.ticker}
        slippage={addLiquiditySlip}
      />

      <Box className="w-full pt-5">
        <Button
          stretch
          disabled={!isValidDeposit.valid}
          error={!isValidDeposit.valid}
          onClick={handleAddLiquidity}
          size="lg"
          variant="fancy"
        >
          {t('views.multisig.createTransaction')}
        </Button>
      </Box>

      <ConfirmModal
        inputAssets={[]}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmAdd}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>
    </Box>
  );
};
