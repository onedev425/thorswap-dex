import type { AssetEntity as Asset, AssetEntity } from '@thorswap-lib/swapkit-core';
import {
  Amount,
  AssetAmount,
  getMinAmountByChain,
  getSignatureAssetFor,
  isGasAsset,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { PanelView } from 'components/PanelView';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { useFormatPrice } from 'helpers/formatPrice';
import { getEstimatedTxTime } from 'helpers/getEstimatedTxTime';
import {
  getAssetBalance,
  hasConnectedWallet,
  hasWalletConnected,
  isTokenWhitelisted,
} from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useCheckHardCap } from 'hooks/useCheckHardCap';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { usePools } from 'hooks/usePools';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { LiquidityTypeOption } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { zeroAmount } from 'types/app';
import { v4 } from 'uuid';
import { useAssetsWithBalanceFromTokens } from 'views/Swap/hooks/useAssetsWithBalanceFromTokens';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';
import { useTokenAddresses } from 'views/Swap/hooks/useTokenAddresses';
import { useTokenList } from 'views/Swap/hooks/useTokenList';

import { AssetInputs } from './AssetInputs';
import { PoolInfo } from './PoolInfo';
import { useConfirmInfoItems } from './useConfirmInfoItems';

export const CreateLiquidity = () => {
  const appDispatch = useAppDispatch();
  const [inputAssets, setInputAssets] = useState<Asset[]>([]);

  const { wallet, setIsConnectModalOpen } = useWallet();
  const { poolAssets } = usePools();
  const ethWhitelist = useTokenAddresses('Thorchain-supported-erc20');
  const avaxWhitelist = useTokenAddresses('tc-whitelisted-avax-pools');
  const bscWhitelist = useTokenAddresses('tc-whitelisted-bsc-pools');
  const { tokens } = useTokenList();
  const hardCapReached = useCheckHardCap();
  const formatPrice = useFormatPrice();

  const createInputAssets = useMemo(() => {
    const assets: AssetEntity[] = [];

    if (!wallet) return poolAssets;
    if (poolAssets.length === 0) return [];

    for (const chain of Object.keys(wallet)) {
      const chainWallet = wallet[chain as Chain];
      const balances = chainWallet?.balance || [];
      if (Chain.THORChain !== chain) {
        for (const balance of balances) {
          // 1. if non-pool asset exists
          // 2. asset shouldn't be THORChain asset
          if (
            !poolAssets.find((poolAsset) => poolAsset.eq(balance.asset)) &&
            balance.asset.chain !== Chain.THORChain
          ) {
            // if erc20 token is whitelisted for THORChain
            const whitelist =
              balance.asset.L1Chain === Chain.Ethereum
                ? ethWhitelist
                : balance.asset.L1Chain === Chain.Avalanche
                ? avaxWhitelist
                : balance.asset.L1Chain === Chain.BinanceSmartChain
                ? bscWhitelist
                : [];

            if (isTokenWhitelisted(balance.asset, whitelist)) {
              assets.push(balance.asset);
            }
          }
        }
      }
    }

    return assets;
  }, [avaxWhitelist, bscWhitelist, ethWhitelist, poolAssets, wallet]);

  const handleInputAssetUpdate = useCallback(() => {
    if (hasConnectedWallet(wallet)) {
      const assetsToSet =
        createInputAssets.filter((asset) => asset.ticker !== 'RUNE' && !asset.isSynth) || [];

      setInputAssets(assetsToSet);
    } else {
      setInputAssets([]);
    }
  }, [createInputAssets, wallet]);

  useEffect(() => {
    handleInputAssetUpdate();
  }, [handleInputAssetUpdate]);

  const [poolAsset, setPoolAsset] = useState<Asset>(
    inputAssets?.[0] ?? getSignatureAssetFor(Chain.Bitcoin),
  );

  const { getMaxBalance, isWalletAssetConnected } = useBalance();
  const { isChainPauseLPAction } = useMimir();
  const { getChainDepositLPPaused } = useExternalConfig();
  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) || getChainDepositLPPaused(poolAsset.chain as Chain)
    );
  }, [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused]);

  const [assetAmount, setAssetAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));
  const [runeAmount, setRuneAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const runeAsset = getSignatureAssetFor(Chain.THORChain);

  const [maxPoolAssetBalance, setMaxPoolAssetBalance] = useState(zeroAmount);

  const [maxRuneBalance, setMaxRuneBalance] = useState(zeroAmount);

  const {
    feeInUSD,
    inputFee: inboundAssetFee,
    outputFee: inboundRuneFee,
  } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: runeAsset,
  });

  const isWalletConnected = useMemo(
    () =>
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [getSignatureAssetFor(Chain.THORChain)] }),
    [wallet, poolAsset],
  );

  const { isApproved, isLoading } = useIsAssetApproved({
    force: true,
    asset: poolAsset,
    amount: assetAmount.gt(0) ? assetAmount : undefined,
  });

  const { data: pricesData } = useTokenPrices([poolAsset, runeAsset]);

  const { assetUnitPrice, runeUnitPrice, assetUSDPrice, runeUSDPrice } = useMemo(() => {
    const assetUnitPrice = pricesData?.[poolAsset.toString()]?.price_usd || 0;
    const runeUnitPrice = pricesData?.[runeAsset.toString()]?.price_usd || 0;

    return {
      assetUnitPrice,
      runeUnitPrice,
      assetUSDPrice: assetAmount.assetAmount.toNumber() * assetUnitPrice,
      runeUSDPrice: runeAmount.assetAmount.toNumber() * runeUnitPrice,
    };
  }, [pricesData, poolAsset, runeAsset, assetAmount, runeAmount]);

  const price: Amount = useMemo(
    () => (assetAmount.eq(0) ? Amount.fromAssetAmount(0, 8) : runeAmount.div(assetAmount)),
    [runeAmount, assetAmount],
  );

  const poolAssetBalance: Amount = useMemo(
    () => (wallet ? getAssetBalance(poolAsset, wallet).amount : Amount.fromAssetAmount(10 ** 3, 8)),
    [poolAsset, wallet],
  );

  useEffect(() => {
    getMaxBalance(poolAsset).then((assetMaxBalance) =>
      setMaxPoolAssetBalance(assetMaxBalance || zeroAmount),
    );
  }, [poolAsset, getMaxBalance]);

  useEffect(() => {
    getMaxBalance(runeAsset).then((runeMaxBalance) =>
      setMaxRuneBalance(runeMaxBalance || zeroAmount),
    );
  }, [getMaxBalance, runeAsset]);

  const runeBalance: Amount = useMemo(
    () =>
      wallet
        ? getAssetBalance(getSignatureAssetFor(Chain.THORChain), wallet).amount
        : Amount.fromAssetAmount(10 ** 3, 8),
    [wallet],
  );

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
      const runeAssetAmount = new AssetAmount(getSignatureAssetFor(Chain.THORChain), runeAmount);
      const poolAssetAmount = new AssetAmount(
        poolAsset,
        Amount.fromAssetAmount(assetAmount.assetAmount.toString(), poolAsset.decimal),
      );
      const runeId = v4();
      const assetId = v4();

      appDispatch(
        addTransaction({
          id: runeId,
          label: t('txManager.addAmountAsset', {
            asset: getSignatureAssetFor(Chain.THORChain).name,
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

      let runeTx, assetTx;

      const { createLiquidity } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const response = await createLiquidity({
          runeAmount: runeAssetAmount,
          assetAmount: poolAssetAmount,
        });

        runeTx = response.runeTx;
        assetTx = response.assetTx;

        runeTx && appDispatch(updateTransaction({ id: runeId, txid: runeTx }));
        assetTx && appDispatch(updateTransaction({ id: assetId, txid: assetTx }));
      } catch (error: NotWorth) {
        console.error(error);
        !runeTx && appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        !assetTx && appDispatch(completeTransaction({ id: assetId, status: 'error' }));

        showErrorToast(t('notification.submitFail'), error?.toString());
      }
    }
  }, [wallet, runeAmount, poolAsset, assetAmount, appDispatch]);

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false);

    if (isWalletAssetConnected(poolAsset)) {
      const id = v4();
      const type =
        poolAsset.L1Chain === Chain.Ethereum
          ? TransactionType.ETH_APPROVAL
          : TransactionType.AVAX_APPROVAL;

      appDispatch(
        addTransaction({
          id,
          label: `${t('txManager.approve')} ${poolAsset.name}`,
          inChain: poolAsset.L1Chain,
          type,
        }),
      );

      const { approveAsset } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const txid = await approveAsset(poolAsset);

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error: NotWorth) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [isWalletAssetConnected, poolAsset, appDispatch]);

  const handleCreateLiquidity = useCallback(() => {
    if (!isWalletConnected) {
      return showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }

    setVisibleConfirmModal(true);
  }, [isWalletConnected]);

  const handleApprove = useCallback(() => {
    if (wallet) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [wallet]);

  const depositAssets: Asset[] = useMemo(
    () => [poolAsset, getSignatureAssetFor(Chain.THORChain)],
    [poolAsset],
  );

  const depositAssetInputs = useMemo(
    () => [
      { asset: getSignatureAssetFor(Chain.THORChain), value: runeAmount.toSignificant(6) },
      { asset: poolAsset, value: assetAmount.toSignificant(6) },
    ],
    [poolAsset, assetAmount, runeAmount],
  );

  const minRuneAmount: Amount = useMemo(() => getMinAmountByChain(Chain.THORChain).amount, []);
  const minAssetAmount: Amount = useMemo(
    () =>
      isGasAsset(poolAsset) ? getMinAmountByChain(poolAsset.chain) : Amount.fromAssetAmount(0, 8),
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

  const isInputWalletConnected = useMemo(
    () => poolAsset && hasWalletConnected({ wallet, inputAssets: [poolAsset] }),
    [wallet, poolAsset],
  );

  const isApproveRequired = useMemo(
    () => isInputWalletConnected && isApproved === false,
    [isInputWalletConnected, isApproved],
  );

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
      asset: getSignatureAssetFor(Chain.THORChain),
      value: runeAmount,
      balance: runeBalance,
      usdPrice: runeUSDPrice,
    }),
    [runeAmount, runeBalance, runeUSDPrice],
  );

  const assetSelectList = useAssetsWithBalanceFromTokens(tokens);
  const filteredAssets = assetSelectList.filter((x) =>
    inputAssets.some((asset) => asset.eq(x.asset)),
  );

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
    () => getEstimatedTxTime({ chain: poolAsset.chain as Chain, amount: assetAmount }),
    [assetAmount, poolAsset],
  );

  const confirmInfo = useConfirmInfoItems({
    assets: depositAssetInputs,
    poolShare: '100%',
    slippage: 'N/A',
    estimatedTime,
    totalFee: feeInUSD,
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
        poolAssetList={filteredAssets}
        runeAsset={runeAssetInput}
      />

      <PoolInfo
        assetUSDPrice={formatPrice(assetUSDPrice)}
        poolAsset={poolAssetInput}
        poolShare="100%"
        rate={price.toSignificant(6)}
        runeAsset={runeAssetInput}
      />

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button
            stretch
            error={hardCapReached}
            loading={isLoading}
            onClick={handleApprove}
            size="lg"
            tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
            variant="fancy"
          >
            {t('common.approve')}
          </Button>
        </Box>
      )}

      {isDepositAvailable && (
        <Box className="w-full pt-5">
          <Button
            stretch
            disabled={!isValidDeposit.valid}
            error={!isValidDeposit.valid || hardCapReached}
            onClick={handleCreateLiquidity}
            size="lg"
            tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
            variant="fancy"
          >
            {btnLabel}
          </Button>
        </Box>
      )}

      {!isWalletConnected && (
        <Box className="w-full pt-5">
          <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
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
