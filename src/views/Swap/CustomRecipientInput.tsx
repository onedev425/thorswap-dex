import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { PanelInput } from 'components/PanelInput';
import { showInfoToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useAddressForTNS } from 'hooks/useAddressForTNS';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useGetThornamesByAddressQuery } from 'store/thorswap/api';

type Props = {
  recipient: string;
  setRecipient: (recipient: string) => void;
  outputAssetL1Chain: Chain;
  isOutputWalletConnected: boolean;
};

export const CustomRecipientInput = memo(
  ({ isOutputWalletConnected, recipient, setRecipient, outputAssetL1Chain }: Props) => {
    const { customRecipientMode } = useApp();
    const [thorname, setThorname] = useState('');
    const [disabled, setDisabled] = useState(false);

    const { loading, TNS, setTNS, validThorname } = useAddressForTNS(recipient);

    const TNSAddress = useMemo(
      () =>
        TNS?.entries ? TNS.entries.find(({ chain }) => chain === outputAssetL1Chain)?.address : '',
      [TNS, outputAssetL1Chain],
    );

    const debouncedParams = useDebouncedValue(
      useMemo(
        () => ({ address: recipient.toLowerCase(), chain: outputAssetL1Chain }),
        [outputAssetL1Chain, recipient],
      ),
      500,
    );

    const {
      data: thornamesData,
      isLoading: thornameForAddressLoading,
      error,
    } = useGetThornamesByAddressQuery(debouncedParams, { skip: !recipient || !outputAssetL1Chain });

    const thornameForAddress = useMemo(() => {
      if (!thornamesData || error) return null;
      const { result } = thornamesData;

      if (!result?.length) return null;
      return result.find((tns) => tns === validThorname);
    }, [thornamesData, error, validThorname]);

    const toggleDisabled = useCallback(() => setDisabled((d) => !d), []);

    const handleCopyAddress = useCallback(() => {
      copy(recipient);
      showInfoToast(t('notification.addressCopied'));
    }, [recipient]);

    const handleChangeRecipient = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setRecipient(value);
        setThorname('');
        setTNS(null);
      },
      [setRecipient, setTNS],
    );

    useEffect(() => {
      if (TNS && TNSAddress) {
        setThorname(TNS.thorname);
        setRecipient(TNSAddress);
      }
    }, [TNS, TNSAddress, setRecipient]);

    const recipientTitle = useMemo(
      () =>
        TNSAddress && thorname
          ? `${t('common.recipientAddress')} - ${thorname}.${outputAssetL1Chain}`
          : t('common.recipientAddress'),
      [TNSAddress, outputAssetL1Chain, thorname],
    );

    if (!customRecipientMode && isOutputWalletConnected) return null;

    return (
      <PanelInput
        stretch
        className="transition-all"
        disabled={disabled}
        loading={loading || thornameForAddressLoading}
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
        value={thornameForAddress || recipient}
      />
    );
  },
);
