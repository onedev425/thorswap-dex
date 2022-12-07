import { Amount, Asset, hasWalletConnected, Price } from '@thorswap-lib/multichain-core';
import { SwitchMenu } from 'components/AppPopoverMenu/components/SwitchMenu';
import { AssetInput } from 'components/AssetInput';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelInput } from 'components/PanelInput';
import { PanelView } from 'components/PanelView';
import { showErrorToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { chainName } from 'helpers/chainName';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { getWalletAssets } from 'helpers/wallet';
import { useAddressForTNS } from 'hooks/useAddressForTNS';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { getSendRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { useWallet } from 'store/wallet/hooks';
import { CustomSend } from 'views/Send/components/CustomSend';
import { useCustomSend } from 'views/Send/hooks/useCustomSend';
import { useConfirmSend } from 'views/Send/useConfirmSend';

// TODO: refactor useReducer
const Send = () => {
  const navigate = useNavigate();
  const { assetParam } = useParams<{ assetParam: string }>();
  const [searchParams] = useSearchParams();

  const [sendAsset, setSendAsset] = useState<Asset>(Asset.RUNE());
  const [sendAmount, setSendAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [memo, setMemo] = useState('');
  const [recipientAddress, setRecipientAddress] = useState(searchParams.get('recipient') || '');
  const [thorname, setThorname] = useState('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const { wallet, setIsConnectModalOpen } = useWallet();
  const { pools } = useMidgard();
  const { getMaxBalance } = useBalance();
  const { inboundFee, totalFeeInUSD } = useNetworkFee({ inputAsset: sendAsset });

  const {
    customMemo,
    customRecipient,
    setCustomMemo,
    customTxEnabled,
    switchCustomTxEnabledMenu,
    showCustomTxToggle,
  } = useCustomSend();

  const txRecipient = customTxEnabled ? customRecipient : recipientAddress;
  const txMemo = customTxEnabled ? customMemo : memo;

  const handleConfirmSend = useConfirmSend({
    setIsOpenConfirmModal,
    sendAmount,
    sendAsset,
    recipientAddress: txRecipient,
    memo: txMemo,
  });

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(sendAsset),
    [sendAsset, getMaxBalance],
  );

  const { loading, TNS } = useAddressForTNS(recipientAddress);

  const TNSAddress = useMemo(
    () => (TNS ? TNS.entries.find(({ chain }) => chain === sendAsset.L1Chain)?.address : ''),
    [TNS, sendAsset.L1Chain],
  );

  useEffect(() => {
    if (TNS && TNSAddress) {
      setThorname(TNS.thorname);
      setRecipientAddress(TNSAddress);
    }
  }, [TNS, TNSAddress]);

  useEffect(() => {
    const getSendAsset = async () => {
      if (!assetParam) {
        setSendAsset(Asset.RUNE());
      } else {
        const assetEntity = Asset.decodeFromURL(assetParam);

        if (assetEntity) {
          const assetDecimals = await getEVMDecimal(assetEntity);
          await assetEntity.setDecimal(assetDecimals || undefined);
          setSendAsset(assetEntity);
        } else {
          setSendAsset(Asset.RUNE());
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
    (selected: Asset) => {
      setRecipientAddress('');
      navigate(getSendRoute(selected));
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

  const handleSend = useCallback(() => {
    if (
      !customTxEnabled &&
      !multichain().validateAddress({
        chain: sendAsset.L1Chain,
        address: txRecipient,
      })
    ) {
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
        value: (
          <Box center className="gap-2">
            <Typography variant="caption">{`${inboundFee.toCurrencyFormat()} (${totalFeeInUSD.toCurrencyFormat()})`}</Typography>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [inboundFee, totalFeeInUSD],
  );

  const confirmModalInfo = useMemo(
    () => [
      {
        label: t('common.send'),
        value: `${sendAmount?.toSignificant(6)} ${sendAsset.name}`,
      },
      { label: t('common.recipient'), value: t('common.msgDeposit') },
      { label: t('common.memo'), value: txMemo },
      {
        label: t('common.transactionFee'),
        value: (
          <Box center className="gap-2">
            <Typography variant="caption">{`${inboundFee.toCurrencyFormat()} (${totalFeeInUSD.toCurrencyFormat()})`}</Typography>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        ),
      },
    ],
    [sendAmount, sendAsset.name, txMemo, inboundFee, totalFeeInUSD],
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
        <AssetInput
          hideZeroPrice
          assets={assetInputList}
          onAssetChange={handleSelectAsset}
          onValueChange={handleChangeSendAmount}
          selectedAsset={assetInput}
        />
      </div>

      {!customTxEnabled && (
        <>
          <PanelInput
            loading={loading}
            onChange={handleChangeRecipient}
            placeholder={`THORName / ${
              assetInput.asset.isSynth || assetInput.asset.isRUNE()
                ? Asset.RUNE().network
                : chainName(assetInput.asset.L1Chain)
            } ${t('common.address')}`}
            title={recipientTitle}
            value={recipientAddress}
          />

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
          <Button isFancy stretch onClick={handleSend} size="lg">
            {t('common.send')}
          </Button>
        ) : (
          <Button isFancy stretch onClick={() => setIsConnectModalOpen(true)} size="lg">
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
