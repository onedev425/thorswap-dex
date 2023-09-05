import { Amount, AssetEntity as Asset, Price } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { RUNEAsset } from 'helpers/assets';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { getMultisigTxCreateRoute, ROUTES } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { useMultisig } from 'store/multisig/hooks';
import { useMultissigAssets } from 'views/Multisig/hooks';
import { useTxCreate } from 'views/Multisig/TxCreate/TxCreateContext';

export const useTxSend = () => {
  const { signers } = useTxCreate();
  const { createTransferTx } = useMultisig();

  const { assetsWithBalance: assetInputList, getMaxBalance } = useMultissigAssets();
  const { assetParam } = useParams<{ assetParam: string }>();
  const navigate = useNavigate();

  const [sendAsset, setSendAsset] = useState<Asset>(RUNEAsset);

  const [sendAmount, setSendAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [memo, setMemo] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: sendAsset,
        pools,
        priceAmount: sendAmount,
      }),
    [sendAsset, sendAmount, pools],
  );

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(sendAsset),
    [sendAsset, getMaxBalance],
  );

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
        const assetEntity = Asset.decodeFromURL(assetParam);

        if (assetEntity) {
          const assetDecimals = await getEVMDecimal(assetEntity);

          await assetEntity.setDecimal(assetDecimals);
          setSendAsset(assetEntity);
        } else {
          setSendAsset(RUNEAsset);
        }
      }
    };

    getSendAsset();
  }, [assetParam]);

  const handleSelectAsset = useCallback(
    (selected: Asset) => {
      setRecipientAddress('');
      navigate(getMultisigTxCreateRoute(selected));
    },
    [navigate],
  );

  const handleChangeSendAmount = useCallback(
    (amount: Amount) =>
      setSendAmount(amount.gt(maxSpendableBalance) ? maxSpendableBalance : amount),
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
      asset: sendAsset,
      amount: sendAmount,
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
      showErrorToast(t('notification.invalidL1ChainAddy', { chain: Chain.THORChain }));
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
