import { Text } from '@chakra-ui/react';
import { Chain } from '@swapkit/core';
import { stripPrefix } from '@swapkit/toolbox-utxo';
import { Box } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { PanelInput } from 'components/PanelInput';
import { showInfoToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useAddressForTNS } from 'hooks/useAddressForTNS';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import type { ChangeEvent } from 'react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { getSwapKitClient } from 'services/swapKit';
import { useApp } from 'store/app/hooks';

type Props = {
  recipient: string;
  setRecipient: (recipient: string) => void;
  setIsValidRecipient: (isValid: boolean) => void;
  outputAssetChain: Chain;
  isOutputWalletConnected: boolean;
};

export const CustomRecipientInput = memo(
  ({
    recipient,
    setRecipient,
    outputAssetChain,
    isOutputWalletConnected,
    setIsValidRecipient,
  }: Props) => {
    const { customRecipientMode } = useApp();
    const [thorname, setThorname] = useState('');
    const [recipientString, setRecipientString] = useState(recipient || '');
    const [disabled, setDisabled] = useState(false);
    const debouncedRecipientString = useDebouncedValue(recipientString, 1000);
    const { loading, TNS, setTNS } = useAddressForTNS(recipientString);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (recipient !== recipientString) setRecipientString(recipient || '');
    }, [outputAssetChain, recipient]);

    const TNSAddress = useMemo(
      () =>
        TNS?.entries ? TNS.entries.find(({ chain }) => chain === outputAssetChain)?.address : '',
      [TNS, outputAssetChain],
    );

    const toggleDisabled = useCallback(() => setDisabled((d) => !d), []);

    const handleCopyAddress = useCallback(() => {
      copy(recipient);
      showInfoToast(t('notification.addressCopied'));
    }, [recipient]);

    const handleChangeRecipient = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setRecipientString(value);
        setThorname('');
        setTNS(null);
      },
      [setTNS],
    );

    useEffect(() => {
      if (TNS && TNSAddress) {
        setThorname(TNS.thorname);
        setRecipient(TNSAddress);
        setRecipientString(TNSAddress);
        setIsValidRecipient(true);
        return;
      }

      if (!loading && !TNSAddress) {
        if (!debouncedRecipientString) {
          setRecipient('');
          setIsValidRecipient(false);
          return;
        }

        const { validateAddress } = getSwapKitClient();

        const address =
          outputAssetChain === Chain.BitcoinCash
            ? stripPrefix(debouncedRecipientString)
            : debouncedRecipientString;

        const isValid = validateAddress({ address: address, chain: outputAssetChain });

        setIsValidRecipient(isValid);

        if (!isValid) {
          setRecipient('');
          showInfoToast(t('validation.invalidAddress', { chain: outputAssetChain }));
          return;
        }

        setRecipient(address || '');
      }
    }, [
      TNS,
      TNSAddress,
      setRecipient,
      loading,
      outputAssetChain,
      debouncedRecipientString,
      setIsValidRecipient,
    ]);

    const recipientTitle = useMemo(
      () =>
        TNSAddress && thorname
          ? `${t('common.recipientAddress')} - ${thorname}.${outputAssetChain}`
          : t('common.recipientAddress'),
      [TNSAddress, outputAssetChain, thorname],
    );

    if (isOutputWalletConnected && !customRecipientMode) return null;

    return (
      <PanelInput
        stretch
        className="transition-all flex-1 !py-2"
        disabled={disabled}
        loading={loading}
        onChange={handleChangeRecipient}
        placeholder={t('common.thornameOrRecipient')}
        title={
          <Box alignCenter flex={1} justify="between">
            <Text fontWeight="normal" textStyle="caption">
              {recipientTitle}
            </Text>

            <Box>
              <HoverIcon iconName={disabled ? 'edit' : 'lock'} onClick={toggleDisabled} size={16} />
              <HoverIcon iconName="copy" onClick={handleCopyAddress} size={16} />
            </Box>
          </Box>
        }
        value={TNSAddress || recipientString}
      />
    );
  },
);
