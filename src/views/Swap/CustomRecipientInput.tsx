import { Text } from '@chakra-ui/react';
import type { Chain } from '@swapkit/core';
import classNames from 'classnames';
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
import { useApp } from 'store/app/hooks';
import { useGetThornamesByAddressQuery } from 'store/thorswap/api';

type Props = {
  recipient: string;
  setRecipient: (recipient: string) => void;
  outputAssetchain: Chain;
  isOutputWalletConnected: boolean;
};

export const CustomRecipientInput = memo(
  ({ recipient, setRecipient, outputAssetchain, isOutputWalletConnected }: Props) => {
    const { customRecipientMode } = useApp();
    const [thorname, setThorname] = useState('');
    const [disabled, setDisabled] = useState(false);

    const { loading, TNS, setTNS, validThorname } = useAddressForTNS(recipient);

    const TNSAddress = useMemo(
      () =>
        TNS?.entries ? TNS.entries.find(({ chain }) => chain === outputAssetchain)?.address : '',
      [TNS, outputAssetchain],
    );

    const debouncedParams = useDebouncedValue(
      useMemo(
        () => ({ address: recipient.toLowerCase(), chain: outputAssetchain }),
        [outputAssetchain, recipient],
      ),
      500,
    );

    const {
      data: thornamesData,
      isLoading: thornameForAddressLoading,
      error,
    } = useGetThornamesByAddressQuery(debouncedParams, {
      skip: !debouncedParams.address || !debouncedParams.chain,
    });

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
          ? `${t('common.recipientAddress')} - ${thorname}.${outputAssetchain}`
          : t('common.recipientAddress'),
      [TNSAddress, outputAssetchain, thorname],
    );

    if (isOutputWalletConnected && !customRecipientMode) return null;

    return (
      <PanelInput
        stretch
        className={classNames('transition-all flex-1 !py-2')}
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
