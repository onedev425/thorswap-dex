import { RUNEAsset } from "helpers/assets";
import { useTokenPrices } from "hooks/useTokenPrices";
import { useEffect, useMemo, useState } from "react";
import { t } from "services/i18n";
import { useApp } from "store/app/hooks";

const THORCHAIN_POOL_ADDRESS = "";

export const useCustomSend = () => {
  const { customSendVisible } = useApp();
  const [customMemo, setCustomMemo] = useState("");
  const [customTxEnabled, setCustomTxEnabled] = useState(false);
  const { data } = useTokenPrices([RUNEAsset]);
  const runePrice = useMemo(() => data[RUNEAsset.ticker]?.price_usd || 0, [data]);

  useEffect(() => {
    if (!customSendVisible) {
      setCustomTxEnabled(false);
    }
  }, [customSendVisible]);

  const switchCustomTxEnabledMenu = [
    {
      label: t("views.send.toggleCustomTxForm"),
      status: customTxEnabled,
      onClick: () => setCustomTxEnabled((v) => !v),
    },
  ];

  return {
    customRecipient: THORCHAIN_POOL_ADDRESS,
    customMemo,
    setCustomMemo,
    customTxEnabled,
    switchCustomTxEnabledMenu,
    showCustomTxToggle: customSendVisible,
    customFeeRune: `0.02 ${RUNEAsset.symbol}`,
    customFeeUsd: (runePrice * 0.02).toFixed(2),
  };
};
