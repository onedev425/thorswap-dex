import { Text } from "@chakra-ui/react";
import { type AssetValue, SwapKitNumber } from "@swapkit/sdk";
import classNames from "classnames";
import { MaxPopover } from "components/AssetInput/MaxPopover";
import { AssetSelect } from "components/AssetSelect";
import { AssetSelectButton } from "components/AssetSelect/AssetSelectButton";
import { Box, Icon, Tooltip } from "components/Atomic";
import { HighlightCard } from "components/HighlightCard";
import { InputAmount } from "components/InputAmount";
import { useFormatPrice } from "helpers/formatPrice";
import { useBalance } from "hooks/useBalance";
import { useCallback, useEffect, useMemo, useState } from "react";
import { t } from "services/i18n";

import type { AssetInputProps } from "./types";

export const AssetInput = ({
  hideZeroPrice,
  className,
  singleAsset,
  selectedAsset,
  onValueChange,
  hideMaxButton,
  inputClassName,
  disabled = false,
  warning,
  maxButtonLabel,
  poolAsset,
  showSecondaryChainSelector,
  title,
  displayAssetTypeComponent,
  ...rest
}: AssetInputProps) => {
  const formatPrice = useFormatPrice();
  const [walletBalance, setWalletBalance] = useState<AssetValue>();

  const { asset, balance, loading, priceLoading, usdPrice, logoURI, value } = selectedAsset;

  const { getMaxBalance } = useBalance();

  useEffect(() => {
    getMaxBalance(asset).then((maxBalance) => setWalletBalance(maxBalance));
  }, [asset, getMaxBalance]);

  const localPriceLoading = useMemo(
    () => (typeof priceLoading === "boolean" ? priceLoading : loading),
    [priceLoading, loading],
  );

  const assetPriceInUSD = useMemo(() => {
    const price = usdPrice || 0;

    return hideZeroPrice && price <= 1 ? null : formatPrice(price);
  }, [formatPrice, hideZeroPrice, usdPrice]);

  const handlePercentageClick = useCallback(
    (maxValue = 1) => {
      // TODO: will this work? talking about asset here
      const maxBalance = (balance || asset).mul(maxValue);
      onValueChange?.(new SwapKitNumber(maxBalance));
    },
    [asset, balance, onValueChange],
  );

  const assetSelectProps = useMemo(
    () => ({
      ...rest,
      logoURI,
      onSelect: rest.onAssetChange as (asset: AssetValue) => void,
      showAssetType: true,
    }),
    [logoURI, rest],
  );

  const inputStyle = useMemo(() => {
    const rawValue = formatPrice(asset);
    const fontSize =
      rawValue.length > 30
        ? "1rem"
        : rawValue.length > 25
          ? "1.2rem"
          : rawValue.length > 20
            ? "1.4rem"
            : "1.5rem";

    return { fontSize, lineHeight: "2rem" };
  }, [formatPrice, asset]);

  return (
    <HighlightCard className={classNames("min-h-[70px] text-2 !gap-1 !justify-start", className)}>
      {title && (
        <Box alignCenter className="pl-4 md:pl-0 pt-2 md:pt-0" justify="between">
          <Box center className="gap-x-2">
            <Text fontWeight="normal" textStyle="caption">
              {title}
            </Text>
          </Box>
        </Box>
      )}

      <Box
        alignCenter
        className={classNames("pl-4 md:pl-0", className, {
          "flex-col md:flex-row": showSecondaryChainSelector,
          "flex-row": !showSecondaryChainSelector,
        })}
        justify="between"
      >
        {loading ? (
          <div className="flex w-full">
            <Icon spin color="primary" name="loader" size={16} />
          </div>
        ) : (
          <InputAmount
            stretch
            amountValue={value || new SwapKitNumber(0)}
            className={classNames("-ml-1 font-normal text-left", inputClassName)}
            containerClassName="!py-0"
            customPrefix={
              warning ? (
                <Tooltip content={warning}>
                  <Icon className="mr-2" color="yellow" name="warn" size={24} />
                </Tooltip>
              ) : null
            }
            disabled={disabled}
            onAmountChange={onValueChange}
            style={inputStyle}
          />
        )}

        {singleAsset ? (
          <Box className="w-full" justify="end">
            <AssetSelectButton
              showAssetType
              className="!pr-2 !py-1 m-2 md:m-0"
              selected={selectedAsset?.asset}
            />

            {showSecondaryChainSelector && (
              <AssetSelect
                {...assetSelectProps}
                showAssetType
                className="pr-3 m-2 md:m-0 md:ml-2"
                selected={poolAsset?.asset}
              />
            )}
          </Box>
        ) : (
          <AssetSelect
            {...assetSelectProps}
            assetTypeComponent={displayAssetTypeComponent}
            className="m-2 md:m-0"
            selected={selectedAsset?.asset}
          />
        )}
      </Box>

      <Box alignCenter className="pl-4 md:pl-0" flex={1} justify="between">
        <Box className="min-h-[21px]">
          {localPriceLoading ? (
            <Icon spin className="flex w-full" color="primary" name="loader" size={12} />
          ) : assetPriceInUSD ? (
            <Text fontWeight="semibold" variant="secondary">
              {assetPriceInUSD}
            </Text>
          ) : null}
        </Box>

        <Box center row className="gap-1 pb-2 pr-2 md:pr-0">
          {balance && walletBalance && (
            <Text fontWeight="medium" variant="secondary">
              {t("common.balance")}: {walletBalance?.toSignificant(6) || "0"}
            </Text>
          )}

          {((balance && walletBalance) || !hideMaxButton) && !disabled && (
            <MaxPopover
              disabled={!balance}
              maxButtonLabel={maxButtonLabel}
              onChange={handlePercentageClick}
            />
          )}
        </Box>
      </Box>
    </HighlightCard>
  );
};
