import { Text } from "@chakra-ui/react";
import { SwapKitNumber } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetSelect } from "components/AssetSelect";
import { AssetSelectButton } from "components/AssetSelect/AssetSelectButton";
import { Box, Button, Icon } from "components/Atomic";
import { HighlightCard } from "components/HighlightCard";
import type { InfoRowConfig } from "components/InfoRow/types";
import { InfoTable } from "components/InfoTable";
import { LPTypeSelector } from "components/LPTypeSelector";
import { LiquidityType } from "components/LiquidityType/LiquidityType";
import { ConfirmModal } from "components/Modals/ConfirmModal";
import { PercentageSlider } from "components/PercentageSlider";
import { RUNEAsset } from "helpers/assets";
import { useMemo } from "react";
import { t } from "services/i18n";
import { LiquidityTypeOption } from "store/midgard/types";
import { useTxWithdraw } from "views/Multisig/TxWithdraw/hooks";

export const TxWithdraw = () => {
  const {
    poolAsset,
    handleSelectPoolAsset,
    poolAssetList,
    setVisibleConfirmModal,
    visibleConfirmModal,
    handleConfirmWithdraw,
    withdrawType,
    withdrawOptions,
    setWithdrawType,
    lpType,
    shareTypes,
    handleSetLPType,
    percent,
    handleChangePercent,
    sendAsset,
    isValid,
  } = useTxWithdraw();

  const confirmInfo: InfoRowConfig[] = useMemo(
    () => [
      {
        label: `${t("common.withdrawPercent")}:`,
        value: `${percent}%`,
      },
    ],
    [percent],
  );

  return (
    <Box col className="gap-1" flex={1}>
      <LiquidityType
        onChange={setWithdrawType}
        options={withdrawOptions}
        poolAsset={poolAsset}
        selected={withdrawType}
        tabsCount={2}
        title={`${t("views.liquidity.withdraw")}:`}
      />
      <LPTypeSelector
        onChange={handleSetLPType}
        options={shareTypes}
        poolAsset={poolAsset}
        selected={lpType}
        tabsCount={2}
        title={`${t("views.liquidity.from")}:`}
      />

      <div className="relative self-stretch md:w-full">
        <div
          className={classNames(
            "absolute flex items-center justify-center top-1/2 rounded-3xl left-6 -translate-y-1/2 w-[52px] h-[52px]",
            "border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary",
          )}
        >
          <Icon color="white" name="arrowDown" size={20} />
        </div>

        <PercentageSlider
          onChange={handleChangePercent}
          percent={new SwapKitNumber(percent)}
          title={t("common.withdrawPercent")}
        />

        <HighlightCard className="min-h-[107px] p-4 flex-col md:flex-row items-end md:items-center gap-2">
          <Box>
            <Text className="whitespace-nowrap">{`${t("common.receive")}:`}</Text>
          </Box>

          <Box className="gap-2 py-1 flex-1 self-stretch md:self-center">
            <Box
              alignCenter
              className={classNames("overflow-hidden transition-all origin-left", {
                "scale-x-0": withdrawType === LiquidityTypeOption.RUNE,
              })}
              flex={withdrawType === LiquidityTypeOption.RUNE ? 0 : 1}
            >
              <AssetSelect
                showAssetType
                assets={poolAssetList}
                className="m-2 md:m-0 flex-1"
                onSelect={handleSelectPoolAsset}
                selected={poolAsset}
              />
            </Box>
            <Box
              className={classNames("overflow-hidden transition-all origin-right", {
                "scale-x-0": withdrawType === LiquidityTypeOption.ASSET,
              })}
              flex={withdrawType === LiquidityTypeOption.ASSET ? 0 : 1}
            >
              <AssetSelectButton
                showAssetType
                className="pr-3 m-2 md:m-0 flex-1"
                selected={RUNEAsset}
              />
            </Box>
          </Box>
        </HighlightCard>
      </div>
      <Box className="w-full pt-4">
        <InfoTable horizontalInset items={confirmInfo} />
      </Box>
      <Box className="self-stretch gap-4 pt-5">
        <Button
          stretch
          disabled={!isValid}
          error={!isValid}
          onClick={() => setVisibleConfirmModal(true)}
          size="lg"
          variant="fancy"
        >
          {t("views.multisig.createTransaction")}
        </Button>
      </Box>
      <ConfirmModal
        inputAssets={[sendAsset]}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmWithdraw}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>
    </Box>
  );
};
