import { AssetValue, Chain, SwapKitNumber } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { RUNEAsset } from 'helpers/assets';
import { useTokenPrices } from 'hooks/useTokenPrices';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { getMultisigTxCreateRoute, ROUTES } from 'settings/router';
import { useMultisig } from 'store/multisig/hooks';
import { useMultissigAssets } from 'views/Multisig/hooks';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

export const useTxSend = () => {
  const { signers } = useTxCreate();
  const { createTransferTx } = useMultisig();

  const { assetsWithBalance: assetInputList, getMaxBalance } = useMultissigAssets();
  const { assetParam } = useParams<{ assetParam: string }>();
  const navigate = useNavigate();

  const [sendAsset, setSendAsset] = useState<AssetValue>(RUNEAsset);

  const [sendAmount, setSendAmount] = useState<SwapKitNumber>(
    new SwapKitNumber({ value: 0, decimal: 8 }),
  );

  const [memo, setMemo] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const { data } = useTokenPrices([sendAsset]);
  const assetPriceInUSD = useMemo(
    () => data[sendAsset.ticker]?.price_usd || 0 * Number(sendAmount.getValue('string')),
    [data, sendAmount, sendAsset.ticker],
  );

  const maxSpendableBalance = useMemo(() => getMaxBalance(sendAsset), [sendAsset, getMaxBalance]);

  const assetInput = useMemo(
    () => ({
      asset: sendAsset,
      value: sendAmount,
      balance: maxSpendableBalance,
      usdPrice: assetPriceInUSD,
    }),
    [sendAsset, sendAmount, maxSpendableBalance, assetPriceInUSD],
  );

  useEffect(() => {
    const getSendAsset = async () => {
      if (!assetParam) {
        setSendAsset(RUNEAsset);
      } else {
        const assetEntity = await AssetValue.fromString(assetParam);

        if (assetEntity) {
          setSendAsset(assetEntity);
        } else {
          setSendAsset(RUNEAsset);
        }
      }
    };

    getSendAsset();
  }, [assetParam]);

  const handleSelectAsset = useCallback(
    (selected: AssetValue) => {
      setRecipientAddress('');
      navigate(getMultisigTxCreateRoute(selected));
    },
    [navigate],
  );

  const handleChangeSendAmount = useCallback(
    (amount: SwapKitNumber) =>
      setSendAmount(
        amount.gt(maxSpendableBalance.getValue('string'))
          ? new SwapKitNumber({
              value: maxSpendableBalance.getValue('string'),
              decimal: maxSpendableBalance.decimal,
            })
          : amount,
      ),
    [maxSpendableBalance],
  );

  const handleChangeRecipient = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setRecipientAddress(value);
    },
    [],
  );

  const handleChangeMemo = useCallback(({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setMemo(value);
  }, []);

  const handleCancelConfirm = useCallback(() => {
    setIsOpenConfirmModal(false);
  }, []);

  const handleCreateTx = async () => {
    const tx = await createTransferTx({
      recipient: recipientAddress,
      memo,
      assetValue: sendAsset.mul(0).add(sendAmount),
    });

    if (tx) {
      navigate(ROUTES.TxMultisig, {
        state: { tx, signers },
      });
    }
  };

  const handleSend = useCallback(async () => {
    const { validateAddress } = await (await import('services/swapKit')).getSwapKitClient();

    if (!validateAddress({ chain: Chain.THORChain, address: recipientAddress })) {
      showErrorToast(t('notification.invalidchainAddy', { chain: Chain.THORChain }));
    } else {
      setIsOpenConfirmModal(true);
    }
  }, [recipientAddress, setIsOpenConfirmModal]);

  return {
    isOpenConfirmModal,
    setIsOpenConfirmModal,
    assetInputList,
    assetPriceInUSD,
    memo,
    recipientAddress,
    assetInput,
    sendAmount,
    handleSelectAsset,
    handleChangeSendAmount,
    handleChangeRecipient,
    handleChangeMemo,
    handleCancelConfirm,
    sendAsset,
    handleCreateTx,
    handleSend,
  };
};
