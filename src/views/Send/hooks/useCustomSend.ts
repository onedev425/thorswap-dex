import { useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';

export const useCustomSend = () => {
  const { customSendVisible } = useApp();
  const [customRecipient, setCustomRecipient] = useState('');
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
    customRecipient,
    setCustomRecipient,
    customMemo,
    setCustomMemo,
    customTxEnabled,
    switchCustomTxEnabledMenu,
    showCustomTxToggle: customSendVisible,
  };
};
