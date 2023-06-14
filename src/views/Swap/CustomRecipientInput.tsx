import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box } from 'components/Atomic';
import { HoverIcon } from 'components/HoverIcon';
import { PanelInput } from 'components/PanelInput';
import { showInfoToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useAddressForTNS } from 'hooks/useAddressForTNS';
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

    const { loading, TNS, setTNS } = useAddressForTNS(recipient);

    const TNSAddress = useMemo(
      () =>
        TNS?.entries ? TNS.entries.find(({ chain }) => chain === outputAssetL1Chain)?.address : '',
      [TNS, outputAssetL1Chain],
    );

    const { data: thornames, isLoading: thornameForAddressLoading } = useGetThornamesByAddressQuery(
      { address: recipient },
    );

    const thornameForAddress = useMemo(() => {
      const recipientArray = thornames?.[recipient];
      if (recipientArray && Array.isArray(recipientArray) && recipientArray.length > 0) {
        return recipientArray[0];
      }
      return null;
    }, [thornames, recipient]);

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
        value={thornameForAddress ? thornameForAddress : recipient}
      />
    );
  },
);
