import { Amount, Price } from '@thorswap-lib/swapkit-core';
import { RUNEAsset } from 'helpers/assets';
import { useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

const THORCHAIN_POOL_ADDRESS = '';
const RUNE_FEE = '0.02';

export const useCustomSend = () => {
  const { customSendVisible } = useApp();
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();
  const [customMemo, setCustomMemo] = useState('');
  const [customTxEnabled, setCustomTxEnabled] = useState(false);
  const customFeeRune = useMemo(() => Amount.fromAssetAmount(RUNE_FEE, RUNEAsset.decimal), []);
  const customFeeUsd = useMemo(
    () =>
      new Price({
        baseAsset: RUNEAsset,
        pools,
        priceAmount: customFeeRune,
      }),
    [customFeeRune, pools],
  );

  useEffect(() => {
    if (!customSendVisible) {
      setCustomTxEnabled(false);
    }
  }, [customSendVisible]);

  const switchCustomTxEnabledMenu = [
    {
      label: t('views.send.toggleCustomTxForm'),
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
    customFeeRune: `${customFeeRune.toSignificant(4)} ${RUNEAsset.symbol}`,
    customFeeUsd: customFeeUsd.toCurrencyFormat(2),
  };
};
