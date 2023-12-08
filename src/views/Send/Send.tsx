import { Spinner, Text } from '@chakra-ui/react';
import { AssetValue, Chain, SwapKitNumber } from '@swapkit/core';
import { SwitchMenu } from 'components/AppPopoverMenu/components/SwitchMenu';
import { AssetInput } from 'components/AssetInput';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelInput } from 'components/PanelInput';
import { PanelView } from 'components/PanelView';
import { showErrorToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { RUNEAsset } from 'helpers/assets';
import { chainName } from 'helpers/chainName';
import { shortenAddress } from 'helpers/shortenAddress';
import { useAddressForTNS } from 'hooks/useAddressForTNS';
import { useBalance } from 'hooks/useBalance';
import { useNetworkFee } from 'hooks/useNetworkFee';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { getSendRoute } from 'settings/router';
import { CustomSend } from 'views/Send/components/CustomSend';
import { useCustomSend } from 'views/Send/hooks/useCustomSend';
import { useConfirmSend } from 'views/Send/useConfirmSend';

const mayaRouterAddress = '0xe9495f24fF1E8DD8E803B6717Fb9264683CdD7bC';

const Send = () => {
  const navigate = useNavigate();
  const { assetParam } = useParams<{ assetParam: string }>();
  const [searchParams] = useSearchParams();

  const [sendAsset, setSendAsset] = useState(RUNEAsset);

  const setSendAmount = useCallback((amount: string) => {
    setSendAsset((asset) => asset.set(amount));
  }, []);

  const sendAmount = useMemo(() => sendAsset.getValue('string'), [sendAsset]);

  const [maxSpendableBalance, setMaxSpendableBalance] = useState<AssetValue | undefined>(
    sendAsset.set(0),
  );

  const [memo, setMemo] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(searchParams.get('recipient') || '');
  const [thorname, setThorname] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const { wallet, getWallet, getWalletAddress } = useWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();

  const { getMaxBalance } = useBalance();
  const { inputAssetUSDPrice, inputFee, feeInUSD, isLoading } = useNetworkFee({
    type: 'transfer',
    inputAsset: sendAsset,
  });

  const {
    customMemo,
    customRecipient,
    setCustomMemo,
    customTxEnabled,
    switchCustomTxEnabledMenu,
    showCustomTxToggle,
    customFeeRune,
    customFeeUsd,
  } = useCustomSend();

  const txRecipient = customTxEnabled ? customRecipient : recipientAddress;
  const txMemo = customTxEnabled ? customMemo : memo;
  const txFeeUsd = customTxEnabled ? customFeeUsd : feeInUSD;
  const txFee = customTxEnabled
    ? customFeeRune
    : `${inputFee.getValue('string')} ${inputFee.ticker}`;

  const handleConfirmSend = useConfirmSend({
    setIsOpenConfirmModal,
    sendAsset,
    recipientAddress: txRecipient,
    memo: txMemo,
    from: wallet ? getWalletAddress(sendAsset.chain) : undefined,
    customTxEnabled,
  });

  useEffect(() => {
    setMaxSpendableBalance(undefined);
    getMaxBalance(sendAsset).then((maxBalance) => setMaxSpendableBalance(maxBalance));
  }, [getMaxBalance, sendAsset]);

  const { loading, TNS } = useAddressForTNS(recipientAddress);

  const TNSAddress = useMemo(
    () => (TNS?.entries ? TNS.entries.find(({ chain }) => chain === sendAsset.chain)?.address : ''),
    [TNS, sendAsset.chain],
  );

  useEffect(() => {
    if (TNS && TNSAddress) {
      setThorname(TNS.thorname);
      setRecipientAddress(TNSAddress);
    }
  }, [TNS, TNSAddress]);

  useEffect(() => {
    const getSendAsset = async () => {
      if (customTxEnabled) {
        return setSendAsset(RUNEAsset);
      }

      if (!assetParam) {
        setSendAsset(RUNEAsset);
      } else {
        const [chain, synthChain, symbol] = assetParam.split('.');
        const isSynth = chain === Chain.THORChain && symbol;
        const assetString = isSynth ? `${chain}.${synthChain}/${symbol}` : assetParam;
        const assetEntity = AssetValue.fromStringSync(assetString);

        if (assetEntity) {
          setSendAsset(assetEntity);
        } else {
          setSendAsset(RUNEAsset);
        }
      }
    };

    getSendAsset();
  }, [assetParam, customTxEnabled]);

  const isWalletConnected = useMemo(
    () => sendAsset && !!getWallet(sendAsset.chain),
    [sendAsset, getWallet],
  );

  const walletAssets = useMemo(() => {
    const assets: AssetValue[] = [];

    if (!wallet) return assets;

    Object.keys(wallet).forEach((chain) => {
      const chainWallet = wallet[chain as keyof typeof wallet];
      chainWallet?.balance.forEach((data) => {
        assets.push(data);
      });
    });

    return assets;
  }, [wallet]);

  const [assetInputList, setAssetInputList] = useState<
    {
      asset: AssetValue;
    }[]
  >([]);

  useEffect(() => {
    Promise.all(
      walletAssets.map((asset) =>
        getMaxBalance(asset, true).then((balance) => ({
          asset,
          balance,
        })),
      ),
    ).then((balances) => {
      setAssetInputList(balances);
    });
  }, [getMaxBalance, walletAssets]);

  const handleSelectAsset = useCallback(
    (selected: AssetValue) => {
      setRecipientAddress('');
      navigate(getSendRoute(selected));
    },
    [navigate],
  );

  const isMayaRouter = useMemo(
    () =>
      sendAsset.chain === Chain.Ethereum &&
      recipientAddress.toLocaleLowerCase() === mayaRouterAddress.toLocaleLowerCase(),
    [sendAsset, recipientAddress],
  );

  const handleChangeSendAmount = useCallback(
    (amount: SwapKitNumber) => {
      setSendAmount(
        isWalletConnected && maxSpendableBalance && amount.gt(maxSpendableBalance)
          ? maxSpendableBalance.getValue('string')
          : amount.getValue('string'),
      );
    },
    [isWalletConnected, maxSpendableBalance, setSendAmount],
  );

  const handleChangeRecipient = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
      setRecipientAddress(value);
      setThorname('');
    },
    [],
  );

  const handleChangeMemo = useCallback(({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
    setMemo(value);
  }, []);

  const handleCancelSend = useCallback(() => {
    setIsOpenConfirmModal(false);
  }, []);

  const handleSend = useCallback(async () => {
    const { validateAddress } = await (await import('services/swapKit')).getSwapKitClient();

    if (!customTxEnabled && !validateAddress({ chain: sendAsset.chain, address: txRecipient })) {
      showErrorToast(t('notification.invalidChainAddy', { chain: sendAsset.chain }));
    } else {
      setIsOpenConfirmModal(true);
    }
  }, [customTxEnabled, sendAsset.chain, txRecipient]);

  const assetInput = useMemo(
    () => ({
      asset: sendAsset,
      value: new SwapKitNumber({ value: sendAmount, decimal: sendAsset.decimal }),
      balance: isWalletConnected ? maxSpendableBalance : undefined,
      usdPrice: parseFloat(sendAmount) * inputAssetUSDPrice,
    }),
    [inputAssetUSDPrice, isWalletConnected, maxSpendableBalance, sendAmount, sendAsset],
  );

  const summary = useMemo(
    () => [
      {
        label: t('common.transactionFee'),
        value: isLoading ? (
          <Spinner />
        ) : (
          <Box center className="gap-2">
            <Text textStyle="caption">{`${txFee} (${txFeeUsd})`}</Text>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [isLoading, txFee, txFeeUsd],
  );

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.send'),
        value: `${sendAsset?.toSignificant(6)} ${sendAsset.ticker}`,
      },
      {
        label: t('common.recipient'),
        value: customTxEnabled ? t('common.msgDeposit') : shortenAddress(txRecipient, 6),
      },
      { label: t('common.memo'), value: txMemo },
      {
        label: t('common.transactionFee'),
        value: (
          <Box center className="gap-2">
            <Text variant="caption">{`${txFee} (${txFeeUsd})`}</Text>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [sendAsset, customTxEnabled, txRecipient, txMemo, txFee, txFeeUsd],
  );

  const recipientTitle = useMemo(
    () =>
      `${t('common.recipientAddress')}${
        TNSAddress && thorname ? ` - ${thorname}.${sendAsset.chain}` : ''
      }`,
    [TNSAddress, sendAsset.chain, thorname],
  );

  return (
    <PanelView
      description={t('views.send.description')}
      header={<ViewHeader actionsComponent={<GlobalSettingsPopover />} title={t('common.send')} />}
      keywords="Wallet, Tokens, THORSwap, THORChain, DEFI, DEX"
      title={t('views.send.title')}
    >
      <div className="relative self-stretch md:w-full">
        {customTxEnabled ? (
          <AssetInput
            hideZeroPrice
            singleAsset
            onValueChange={handleChangeSendAmount}
            selectedAsset={assetInput}
          />
        ) : (
          <AssetInput
            hideZeroPrice
            assets={assetInputList}
            onAssetChange={handleSelectAsset}
            onValueChange={handleChangeSendAmount}
            selectedAsset={assetInput}
          />
        )}
      </div>

      {!customTxEnabled && (
        <>
          {isMayaRouter && (
            <InfoTip
              className="m-auto !pt-2 !pb-1 !px-2"
              content="Sending funds to this address will likely result in a loss of funds. Users should deposit using the 'depositWithExpiry' method on Etherscan."
              contentClassName="py-0"
              title="Warning"
              type="warn"
            />
          )}
          <PanelInput
            loading={loading}
            onChange={handleChangeRecipient}
            placeholder={`THORName / ${
              assetInput.asset.isSynthetic || assetInput.asset.chain === Chain.THORChain
                ? RUNEAsset.chain
                : chainName(assetInput.asset.chain)
            } ${t('common.address')}`}
            title={recipientTitle}
            value={recipientAddress}
          />
          {memo && (
            <InfoTip
              className="m-auto !pt-2 !pb-1 !px-2"
              content="Sending funds to an address with a custom memo is offered as a convenience tool and should only be used by advanced users knowing precisely what they are doing. THORSwap is not responsible for any loss of funds using this functionality."
              contentClassName="py-0"
              title="Warning"
              type="warn"
            />
          )}
          <PanelInput
            collapsible
            onChange={handleChangeMemo}
            title={t('common.memo')}
            value={memo}
          />
        </>
      )}

      {showCustomTxToggle && (
        <Box className="self-stretch" flex={1}>
          <SwitchMenu className="mx-0.5" items={switchCustomTxEnabledMenu} />
        </Box>
      )}

      {customTxEnabled && <CustomSend memo={customMemo} setMemo={setCustomMemo} />}

      <InfoTable horizontalInset items={summary} />

      <Box center className="w-full pt-5">
        {isWalletConnected ? (
          <Button stretch disabled={isMayaRouter} onClick={handleSend} size="lg" variant="fancy">
            {t('common.send')}
          </Button>
        ) : (
          <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
            {t('common.connectWallet')}
          </Button>
        )}
      </Box>

      <ConfirmModal
        inputAssets={[sendAsset]}
        isOpened={isOpenConfirmModal}
        onClose={handleCancelSend}
        onConfirm={handleConfirmSend}
      >
        <InfoTable items={confirmModalInfo} />
      </ConfirmModal>
    </PanelView>
  );
};

export default Send;
