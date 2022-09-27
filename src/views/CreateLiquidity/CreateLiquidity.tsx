import {
  Amount,
  Asset,
  AssetAmount,
  getEstimatedTxTime,
  hasConnectedWallet,
  hasWalletConnected,
} from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { PanelView } from 'components/PanelView';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { getAssetBalance, getInputAssetsForCreate } from 'helpers/wallet';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { getSumAmountInUSD, useNetworkFee } from 'hooks/useNetworkFee';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { useAppDispatch, useAppSelector } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';
import { useThorchainErc20SupportedAddresses } from 'views/Swap/hooks/useThorchainErc20Supported';

import { AssetInputs } from './AssetInputs';
import { PoolInfo } from './PoolInfo';
import { useConfirmInfoItems } from './useConfirmInfoItems';

export const CreateLiquidity = () => {
  const appDispatch = useAppDispatch();
  const { pools } = useAppSelector(({ midgard }) => midgard);
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [inputAssets, setInputAssets] = useState<Asset[]>([]);
  const whitelistedAddresses = useThorchainErc20SupportedAddresses();

  useEffect(() => {
    const getInputAssets = async () => {
      if (hasConnectedWallet(wallet) && whitelistedAddresses.length > 0) {
        const assets = await getInputAssetsForCreate({ whitelistedAddresses, wallet, pools });
        const assetsToSet =
          assets.filter((asset) => asset.ticker !== 'RUNE' && !asset.isSynth) || [];

        setInputAssets(assetsToSet);
      } else {
        setInputAssets([]);
      }
    };
    getInputAssets();
  }, [wallet, pools, whitelistedAddresses]);

  const [poolAsset, setPoolAsset] = useState<Asset>(inputAssets?.[0] ?? Asset.RUNE());

  const { getMaxBalance, isWalletAssetConnected } = useBalance();
  const { isFundsCapReached, isChainPauseLPAction } = useMimir();
  const { getChainDepositLPPaused } = useExternalConfig();
  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) ||
      getChainDepositLPPaused(poolAsset.chain as SupportedChain)
    );
  }, [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused]);

  const [assetAmount, setAssetAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));
  const [runeAmount, setRuneAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);

  const { inboundFee: inboundAssetFee, outboundFee: inboundRuneFee } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: Asset.RUNE(),
  });

  const isWalletConnected = useMemo(
    () =>
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] }),
    [wallet, poolAsset],
  );

  const { isApproved, isLoading } = useIsAssetApproved({
    force: true,
    asset: poolAsset,
  });

  const {
    prices: {
      inputUnitPrice: assetUnitPrice,
      outputUnitPrice: runeUnitPrice,
      inputUSDPrice: assetUSDPrice,
      outputUSDPrice: runeUSDPrice,
    },
  } = useTokenPrices({
    inputAmount: assetAmount,
    inputAsset: poolAsset,
    outputAmount: runeAmount,
    outputAsset: Asset.RUNE(),
  });

  const price: Amount = useMemo(
    () => (assetAmount.eq(0) ? Amount.fromAssetAmount(0, 8) : runeAmount.div(assetAmount)),
    [runeAmount, assetAmount],
  );

  const poolAssetBalance: Amount = useMemo(
    () => (wallet ? getAssetBalance(poolAsset, wallet).amount : Amount.fromAssetAmount(10 ** 3, 8)),
    [poolAsset, wallet],
  );

  const maxPoolAssetBalance: Amount = useMemo(
    () => getMaxBalance(poolAsset),
    [poolAsset, getMaxBalance],
  );

  const runeBalance: Amount = useMemo(
    () =>
      wallet ? getAssetBalance(Asset.RUNE(), wallet).amount : Amount.fromAssetAmount(10 ** 3, 8),
    [wallet],
  );

  const maxRuneBalance: Amount = useMemo(() => getMaxBalance(Asset.RUNE()), [getMaxBalance]);

  const handleSelectPoolAsset = useCallback((poolAssetData: Asset) => {
    setPoolAsset(poolAssetData);
  }, []);

  const getBalancedAmountsForAsset = useCallback(
    (amount: Amount): { assetAmount: Amount; runeAmount: Amount } => {
      const baseAssetAmount = amount.gt(maxPoolAssetBalance) ? maxPoolAssetBalance : amount;
      const baseRuneAmount = baseAssetAmount.mul(assetUnitPrice).div(runeUnitPrice);
      const exceedsRuneAmount = baseRuneAmount.gt(maxRuneBalance);

      const runeAmount = exceedsRuneAmount ? maxRuneBalance : baseRuneAmount;
      const assetAmount = exceedsRuneAmount
        ? runeAmount.mul(runeUnitPrice).div(assetUnitPrice)
        : baseAssetAmount;

      return { assetAmount, runeAmount };
    },
    [assetUnitPrice, maxPoolAssetBalance, maxRuneBalance, runeUnitPrice],
  );

  const handleChangeAssetAmount = useCallback(
    (amount: Amount) => {
      const { assetAmount, runeAmount } = getBalancedAmountsForAsset(amount);
      setAssetAmount(assetAmount);
      setRuneAmount(runeAmount);
    },
    [getBalancedAmountsForAsset],
  );

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      setRuneAmount(amount.gt(maxRuneBalance) ? maxRuneBalance : amount);
    },
    [maxRuneBalance],
  );

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false);
    if (wallet) {
      const runeAssetAmount = new AssetAmount(Asset.RUNE(), runeAmount);
      const poolAssetAmount = new AssetAmount(poolAsset, assetAmount);
      const runeId = v4();
      const assetId = v4();

      appDispatch(
        addTransaction({
          id: runeId,
          label: t('txManager.addAmountAsset', {
            asset: Asset.RUNE().name,
            amount: runeAmount.toSignificant(6),
          }),
          type: TransactionType.TC_LP_ADD,
          inChain: Chain.THORChain,
        }),
      );

      appDispatch(
        addTransaction({
          id: assetId,
          label: t('txManager.addAmountAsset', {
            asset: poolAsset.name,
            amount: assetAmount.toSignificant(6),
          }),
          type: TransactionType.TC_LP_ADD,
          inChain: poolAsset.L1Chain,
        }),
      );

      try {
        const { runeTx, assetTx } = await multichain().createLiquidity({
          runeAmount: runeAssetAmount,
          assetAmount: poolAssetAmount,
        });

        runeTx && appDispatch(updateTransaction({ id: runeId, txid: runeTx }));
        assetTx && appDispatch(updateTransaction({ id: assetId, txid: assetTx }));
      } catch (error: NotWorth) {
        appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        showErrorToast(t('notification.submitFail'), error?.toString());
      }
    }
  }, [wallet, runeAmount, poolAsset, assetAmount, appDispatch]);

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false);

    if (isWalletAssetConnected(poolAsset)) {
      // register to tx tracker
      const id = v4();

      appDispatch(
        addTransaction({
          id,
          label: `${t('txManager.approve')} ${poolAsset.name}`,
          inChain: poolAsset.L1Chain,
          type: TransactionType.ETH_APPROVAL,
        }),
      );

      try {
        const txid = await multichain().approveAsset(poolAsset);

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [isWalletAssetConnected, poolAsset, appDispatch]);

  const handleCreateLiquidity = useCallback(() => {
    if (!isWalletConnected) {
      return showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }

    if (isFundsCapReached) {
      return showInfoToast(
        t('notification.fundsCapReached'),
        t('notification.fundsCapReachedDesc'),
      );
    }

    setVisibleConfirmModal(true);
  }, [isWalletConnected, isFundsCapReached]);

  const handleApprove = useCallback(() => {
    if (wallet) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [wallet]);

  const totalFeeInUSD = useMemo(() => {
    const totalFee = getSumAmountInUSD(inboundRuneFee, inboundAssetFee, pools);
    return `$${totalFee}`;
  }, [inboundRuneFee, inboundAssetFee, pools]);

  const depositAssets: Asset[] = useMemo(() => [poolAsset, Asset.RUNE()], [poolAsset]);

  const depositAssetInputs = useMemo(
    () => [
      { asset: Asset.RUNE(), value: runeAmount.toSignificant(6) },
      { asset: poolAsset, value: assetAmount.toSignificant(6) },
    ],
    [poolAsset, assetAmount, runeAmount],
  );

  const minRuneAmount: Amount = useMemo(
    () => AssetAmount.getMinAmountByChain(Chain.THORChain).amount,
    [],
  );
  const minAssetAmount: Amount = useMemo(
    () =>
      poolAsset.isGasAsset()
        ? AssetAmount.getMinAmountByChain(poolAsset.chain)
        : Amount.fromAssetAmount(0, 8),
    [poolAsset],
  );

  const isValidDeposit: {
    valid: boolean;
    msg?: string;
  } = useMemo(() => {
    if (isLPActionPaused) {
      return {
        valid: false,
        msg: t('notification.notAvailableDeposit'),
      };
    }

    if (inputAssets.length === 0) {
      return {
        valid: false,
        msg: t('notification.assetNotFound'),
      };
    }

    // only invalid scenario is
    // 1. rune asym
    // 2. rune-asset sym

    if (!runeAmount.gt(minRuneAmount) || !assetAmount.gt(minAssetAmount)) {
      return {
        valid: false,
        msg: t('notification.invalidAmount'),
      };
    }

    return { valid: true };
  }, [isLPActionPaused, runeAmount, assetAmount, minRuneAmount, minAssetAmount, inputAssets]);

  const isApproveRequired = useMemo(() => isApproved !== null && !isApproved, [isApproved]);

  const poolAssetInput = useMemo(
    () => ({
      asset: poolAsset,
      value: assetAmount,
      balance: poolAssetBalance,
      usdPrice: assetUSDPrice,
    }),
    [poolAsset, assetAmount, poolAssetBalance, assetUSDPrice],
  );

  const runeAssetInput = useMemo(
    () => ({
      asset: Asset.RUNE(),
      value: runeAmount,
      balance: runeBalance,
      usdPrice: runeUSDPrice,
    }),
    [runeAmount, runeBalance, runeUSDPrice],
  );

  const inputAssetList = useAssetsWithBalance(inputAssets);

  const title = useMemo(
    () => `${t('common.create')} ${poolAsset.ticker} ${t('common.liquidity')}`,
    [poolAsset],
  );

  const btnLabel = useMemo(() => {
    if (!isValidDeposit.valid) return isValidDeposit.msg;

    if (isApproveRequired) return t('common.create');

    return t('common.createLiquidity');
  }, [isValidDeposit, isApproveRequired]);

  const estimatedTime = useMemo(
    () =>
      getEstimatedTxTime({
        chain: poolAsset.chain as SupportedChain,
        amount: assetAmount,
      }),
    [assetAmount, poolAsset],
  );

  const confirmInfo = useConfirmInfoItems({
    assets: depositAssetInputs,
    poolShare: '100%',
    slippage: 'N/A',
    estimatedTime,
    totalFee: totalFeeInUSD,
    fees: [
      { chain: poolAsset.L1Chain, fee: inboundAssetFee.toCurrencyFormat() },
      { chain: Chain.THORChain, fee: inboundRuneFee.toCurrencyFormat() },
    ],
  });

  const approveConfirmInfo = useApproveInfoItems({
    assetName: poolAsset.name,
    assetValue: assetAmount.toSignificant(6),
    fee: inboundAssetFee.toCurrencyFormat(),
  });

  const isDepositAvailable = useMemo(
    () => isWalletConnected && !isApproveRequired,
    [isWalletConnected, isApproveRequired],
  );

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={<GlobalSettingsPopover />}
          title={t('common.createLiquidity')}
        />
      }
      title={title}
    >
      <AssetInputs
        isAssetPending={false}
        isRunePending={false}
        liquidityType={LiquidityTypeOption.SYMMETRICAL}
        onAssetAmountChange={handleChangeAssetAmount}
        onPoolChange={handleSelectPoolAsset}
        onRuneAmountChange={handleChangeRuneAmount}
        poolAsset={poolAssetInput}
        poolAssetList={inputAssetList}
        runeAsset={runeAssetInput}
      />

      <PoolInfo
        assetUSDPrice={assetUSDPrice.toCurrencyFormat(3)}
        poolAsset={poolAssetInput}
        poolShare="100%"
        rate={price.toSignificant(6)}
        runeAsset={runeAssetInput}
      />

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button isFancy stretch loading={isLoading} onClick={handleApprove} size="lg">
            {t('common.approve')}
          </Button>
        </Box>
      )}

      {isDepositAvailable && (
        <Box className="w-full pt-5">
          <Button
            isFancy
            stretch
            disabled={!isValidDeposit.valid}
            error={!isValidDeposit.valid}
            onClick={handleCreateLiquidity}
            size="lg"
          >
            {btnLabel}
          </Button>
        </Box>
      )}

      {!isWalletConnected && (
        <Box className="w-full pt-5">
          <Button isFancy stretch onClick={() => setIsConnectModalOpen(true)} size="lg">
            {t('common.connectWallet')}
          </Button>
        </Box>
      )}

      <ConfirmModal
        inputAssets={depositAssets}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmAdd}
      >
        <InfoTable items={confirmInfo} />
      </ConfirmModal>

      <ConfirmModal
        inputAssets={[poolAsset]}
        isOpened={visibleApproveModal}
        onClose={() => setVisibleApproveModal(false)}
        onConfirm={handleConfirmApprove}
      >
        <InfoTable items={approveConfirmInfo} />
      </ConfirmModal>
    </PanelView>
  );
};

export default CreateLiquidity;
