import { useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';

const THORCHAIN_POOL_ADDRESS = '';

export const useCustomSend = () => {
  const { customSendVisible } = useApp();
  const [customMemo, setCustomMemo] = useState('');
  const [customTxEnabled, setCustomTxEnabled] = useState(false);

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
  };
};
