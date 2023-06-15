import { Spinner, Text } from '@chakra-ui/react';
import { Amount, AssetEntity, Price } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
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
import { RUNEAsset } from 'helpers/assets';
import { chainName } from 'helpers/chainName';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { shortenAddress } from 'helpers/shortenAddress';
import { getWalletAssets, hasWalletConnected } from 'helpers/wallet';
import { useAddressForTNS } from 'hooks/useAddressForTNS';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { getSendRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { useWallet } from 'store/wallet/hooks';
import { CustomSend } from 'views/Send/components/CustomSend';
import { useCustomSend } from 'views/Send/hooks/useCustomSend';
import { useConfirmSend } from 'views/Send/useConfirmSend';

const mayaRouterAddress = '0xe9495f24fF1E8DD8E803B6717Fb9264683CdD7bC';

// TODO: refactor useReducer
const Send = () => {
  const navigate = useNavigate();
  const { assetParam } = useParams<{ assetParam: string }>();
  const [searchParams] = useSearchParams();

  const [sendAsset, setSendAsset] = useState(RUNEAsset);
  const [sendAmount, setSendAmount] = useState(Amount.fromAssetAmount(0, 8));

  const [memo, setMemo] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(searchParams.get('recipient') || '');
  const [thorname, setThorname] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const { wallet, setIsConnectModalOpen } = useWallet();
  const { pools } = useMidgard();
  const { getMaxBalance } = useBalance();
  const { inputFee, feeInUSD, isLoading } = useNetworkFee({
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
  const txFee = customTxEnabled ? customFeeRune : inputFee.toCurrencyFormat();
  const txFeeUsd = customTxEnabled ? customFeeUsd : feeInUSD;

  const handleConfirmSend = useConfirmSend({
    setIsOpenConfirmModal,
    sendAmount,
    sendAsset,
    recipientAddress: txRecipient,
    memo: txMemo,
    from: wallet ? wallet[sendAsset.chain]?.address : undefined,
    customTxEnabled,
  });

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(sendAsset),
    [sendAsset, getMaxBalance],
  );

  const { loading, TNS } = useAddressForTNS(recipientAddress);

  const TNSAddress = useMemo(
    () =>
      TNS?.entries ? TNS.entries.find(({ chain }) => chain === sendAsset.L1Chain)?.address : '',
    [TNS, sendAsset.L1Chain],
  );

  useEffect(() => {
    if (TNS && TNSAddress) {
      setThorname(TNS.thorname);
      setRecipientAddress(TNSAddress);
    }
  }, [TNS, TNSAddress]);

  useEffect(() => {
    if (customTxEnabled) {
      setSendAsset(RUNEAsset);
    }
  }, [customTxEnabled]);

  useEffect(() => {
    const getSendAsset = async () => {
      if (!assetParam) {
        setSendAsset(RUNEAsset);
      } else {
        const assetEntity = AssetEntity.decodeFromURL(assetParam);

        if (assetEntity) {
          const assetDecimals = await getEVMDecimal(assetEntity);
          assetEntity.setDecimal(assetDecimals);
          setSendAmount(Amount.fromAssetAmount(0, assetEntity.decimal));
          setSendAsset(assetEntity);
        } else {
          setSendAsset(RUNEAsset);
        }
      }
    };

    getSendAsset();
  }, [assetParam]);

  const isWalletConnected = useMemo(
    () => sendAsset && hasWalletConnected({ wallet, inputAssets: [sendAsset] }),
    [wallet, sendAsset],
  );

  const walletAssets = useMemo(() => getWalletAssets(wallet), [wallet]);

  const assetInputList = useAssetsWithBalance(walletAssets);

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: sendAsset,
        pools,
        priceAmount: sendAmount,
      }),
    [sendAsset, sendAmount, pools],
  );

  const handleSelectAsset = useCallback(
    (selected: AssetEntity) => {
      setRecipientAddress('');
      navigate(getSendRoute(selected));
    },
    [navigate],
  );

  const isMayaRouter = useMemo(
    () =>
      sendAsset.L1Chain === Chain.Ethereum &&
      recipientAddress.toLocaleLowerCase() === mayaRouterAddress.toLocaleLowerCase(),
    [sendAsset, recipientAddress],
  );

  const handleChangeSendAmount = useCallback(
    (amount: Amount) =>
      setSendAmount(amount.gt(maxSpendableBalance) ? maxSpendableBalance : amount),
    [maxSpendableBalance],
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

    if (!customTxEnabled && !validateAddress({ chain: sendAsset.L1Chain, address: txRecipient })) {
      showErrorToast(t('notification.invalidL1ChainAddy', { chain: sendAsset.L1Chain }));
    } else {
      setIsOpenConfirmModal(true);
    }
  }, [customTxEnabled, sendAsset.L1Chain, txRecipient]);

  const assetInput = useMemo(
    () => ({
      asset: sendAsset,
      value: sendAmount,
      balance: isWalletConnected ? maxSpendableBalance : undefined,
      usdPrice: assetPriceInUSD,
    }),
    [sendAsset, sendAmount, maxSpendableBalance, assetPriceInUSD, isWalletConnected],
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
        value: `${sendAmount?.toSignificant(6)} ${sendAsset.name}`,
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
    [sendAmount, sendAsset.name, customTxEnabled, txRecipient, txMemo, txFee, txFeeUsd],
  );

  const recipientTitle = useMemo(
    () =>
      `${t('common.recipientAddress')}${
        TNSAddress && thorname ? ` - ${thorname}.${sendAsset.L1Chain}` : ''
      }`,
    [TNSAddress, sendAsset.L1Chain, thorname],
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
              assetInput.asset.isSynth || assetInput.asset.isRUNE()
                ? RUNEAsset.network
                : chainName(assetInput.asset.L1Chain)
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
