import { Text } from '@chakra-ui/react';
import { Amount, AssetAmount, AssetEntity, Price } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { AssetInput } from 'components/AssetInput';
import { Box, Button, Card, Icon, Tooltip } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelInput } from 'components/PanelInput';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { getRuneToUpgrade, hasWalletConnected } from 'helpers/wallet';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { IS_STAGENET } from 'settings/config';
import { useMidgard } from 'store/midgard/hooks';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { ConfirmContent } from 'views/UpgradeRune/ConfirmContent';

const oldRunes = [AssetEntity.BNB_RUNE(), AssetEntity.ETH_RUNE()];

const UpgradeRune = () => {
  const appDispatch = useAppDispatch();
  const { isChainTradingHalted } = useMimir();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { getMaxBalance, isWalletAssetConnected } = useBalance();
  const { lastBlock, pools } = useMidgard();

  const walletAddress = wallet?.[Chain.THORChain]?.address || '';
  const [hasManualAddress, setHasManualAddress] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState(walletAddress || '');

  useEffect(() => {
    if (!!recipientAddress && !walletAddress) {
      setHasManualAddress(true);
    }
  }, [walletAddress, recipientAddress]);

  useEffect(() => {
    if (walletAddress && !hasManualAddress) {
      setRecipientAddress(walletAddress);
    }
  }, [hasManualAddress, walletAddress]);

  const [selectedAsset, setSelectedAsset] = useState<AssetEntity>(oldRunes[0]);
  const [upgradeAmount, setUpgradeAmount] = useState<Amount>(
    Amount.fromAssetAmount(0, selectedAsset.decimal),
  );
  const runeToUpgrade = useMemo(() => {
    const runes = getRuneToUpgrade(wallet);

    if (runes && runes.length > 0) return runes;
    return oldRunes;
  }, [wallet]);

  const maxSpendableBalance: Amount = useMemo(
    () => getMaxBalance(selectedAsset),
    [selectedAsset, getMaxBalance],
  );

  const { inboundFee, totalFeeInUSD } = useNetworkFee({
    inputAsset: selectedAsset,
  });

  const isWalletConnected = useMemo(
    () => selectedAsset && hasWalletConnected({ wallet, inputAssets: [selectedAsset] }),
    [wallet, selectedAsset],
  );

  const isTradingHalted: boolean = useMemo(
    () => isChainTradingHalted?.[selectedAsset.chain] ?? false,
    [isChainTradingHalted, selectedAsset],
  );

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: AssetEntity.RUNE(),
        pools,
        priceAmount: upgradeAmount,
      }),
    [upgradeAmount, pools],
  );

  const handleChangeUpgradeAmount = useCallback(
    (amount: Amount) => {
      setUpgradeAmount(amount.gt(maxSpendableBalance) ? maxSpendableBalance : amount);
    },
    [maxSpendableBalance],
  );

  const handleConfirmUpgrade = useCallback(async () => {
    setIsOpened(false);

    if (selectedAsset && recipientAddress) {
      const runeAmount = new AssetAmount(selectedAsset, upgradeAmount);

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          from: recipientAddress,
          inChain: selectedAsset.L1Chain,
          type: TransactionType.TC_SWITCH,
          label: `${t('common.upgrade')} ${upgradeAmount.toSignificantWithMaxDecimals(3)} ${
            selectedAsset.name
          } ${t('common.to')} ${upgradeAmount.toSignificantWithMaxDecimals(3)} ${
            AssetEntity.RUNE().name
          }`,
        }),
      );

      const { upgrade } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const txid = await upgrade({ runeAmount, recipient: recipientAddress });

        appDispatch(
          updateTransaction({
            id,
            txid,
          }),
        );
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'));
      }
    }
  }, [selectedAsset, recipientAddress, upgradeAmount, appDispatch]);

  const handleUpgrade = useCallback(async () => {
    if (isTradingHalted) {
      return showInfoToast(t('notification.upgradeTradingHalt'));
    }

    if (!recipientAddress) {
      return showInfoToast(t('notification.tcWalletRequest'));
    }

    const { validateAddress } = await (await import('services/swapKit')).getSwapKitClient();

    if (
      !(
        IS_STAGENET ||
        validateAddress({
          chain: Chain.THORChain,
          address: recipientAddress,
        })
      )
    ) {
      return showErrorToast(
        t('notification.invalidRecipientAddy'),
        t('notification.invalidRecipientAddyDesc'),
      );
    }

    setIsOpened(true);
  }, [recipientAddress, isTradingHalted]);

  const assetInput = useMemo(
    () => ({
      asset: selectedAsset,
      value: upgradeAmount,
      balance: isWalletAssetConnected(selectedAsset) ? maxSpendableBalance : undefined,
      usdPrice: assetPriceInUSD,
    }),
    [selectedAsset, upgradeAmount, maxSpendableBalance, assetPriceInUSD, isWalletAssetConnected],
  );

  const assetInputList = useAssetsWithBalance(runeToUpgrade);
  const feeLabel = `${inboundFee.toCurrencyFormat()} (${totalFeeInUSD.toCurrencyFormat(2)})`;

  const redemptionRate = useMemo(() => {
    // Current Ratio = 1-((CurrentBlockHeight - KILLSWITCH_BLOCK) / KILLSWITCH_DURATION_IN_BLOCKS)

    const lastTCBlock = lastBlock?.[0]?.thorchain;
    const rate = 1 - (lastTCBlock - 6500000) / 5256000;

    return lastTCBlock ? rate.toFixed(6) : '-';
  }, [lastBlock]);

  const summary = useMemo(
    () => [
      {
        label: t('common.transactionFee'),
        value: (
          <Box center className="gap-2">
            <Text textStyle="caption">{feeLabel}</Text>
            <Tooltip content={t('views.send.txFeeTooltip')}>
              <Icon color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        ),
      },
      {
        label: t('common.runeRedemptionRate'),
        value: (
          <Box center className="gap-2">
            <Text textStyle="caption">{redemptionRate}</Text>
            <Box
              center
              className="p-0.5 border-[1.5px] border-solid rounded-xl border-light-border-primary dark:border-dark-gray-primary"
            >
              <Icon color="secondary" name="switch" size={12} />
            </Box>
          </Box>
        ),
      },
    ],
    [feeLabel, redemptionRate],
  );

  const receivedRune = useMemo(() => {
    const rate = parseFloat(redemptionRate);

    if (Number.isNaN(rate) || assetInput.value.lte(0)) return '-';

    const runeAmount = assetInput.value.mul(rate).toSignificantWithMaxDecimals(8);

    return `${t('common.receive')} ${runeAmount} Native RUNE`;
  }, [assetInput.value, redemptionRate]);

  return (
    <Box col className="self-center w-full max-w-[480px]">
      <Helmet content={t('common.upgradeRune')} title={t('common.upgradeRune')} />

      <Box col className="w-full mx-2">
        <ViewHeader title={t('common.upgradeChainRune', { chain: selectedAsset.chain })} />
      </Box>

      <Card
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:mt-8 md:h-auto"
        size="lg"
      >
        <Box col className="gap-1 self-stretch" flex={1}>
          <AssetInput
            assets={assetInputList}
            onAssetChange={setSelectedAsset}
            onValueChange={handleChangeUpgradeAmount}
            secondaryLabel={receivedRune}
            selectedAsset={assetInput}
          />

          <Box col>
            <PanelInput
              stretch
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder={t('common.address')}
              title={t('common.recipientAddress')}
              value={recipientAddress}
            />
          </Box>
        </Box>

        <InfoTable horizontalInset items={summary} />

        <Box className="w-full pt-5">
          {isWalletConnected ? (
            <Button stretch onClick={handleUpgrade} size="lg">
              {t('common.upgrade')}
            </Button>
          ) : (
            <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
              {t('common.connectWallet')}
            </Button>
          )}

          <ConfirmModal
            inputAssets={[selectedAsset]}
            isOpened={isOpened}
            onClose={() => setIsOpened(false)}
            onConfirm={handleConfirmUpgrade}
          >
            <ConfirmContent
              amount={upgradeAmount}
              feeLabel={feeLabel}
              inputAsset={selectedAsset}
              recipient={recipientAddress}
            />
          </ConfirmModal>
        </Box>
      </Card>
    </Box>
  );
};

export default UpgradeRune;
