import { AssetValue, Chain, getMinAmountByChain, SwapKitNumber } from '@swapkit/core';
import { Box, Button } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { PanelView } from 'components/PanelView';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { RUNEAsset } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { getEstimatedTxTime } from 'helpers/getEstimatedTxTime';
import { getAssetBalance, isTokenWhitelisted } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useCheckHardCap } from 'hooks/useCheckHardCap';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { usePools } from 'hooks/usePools';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { getInboundData } from 'store/midgard/actions';
import { LiquidityTypeOption } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
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
  const [inputAssets, setInputAssets] = useState<AssetValue[]>([]);
  const [contract, setContract] = useState('');
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { hasWallet, wallet, getWallet } = useWallet();
  const { poolAssets } = usePools();
  const poolWhitelist = useTokenAddresses('pools');
  const { tokens } = useTokenList();
  const hardCapReached = useCheckHardCap();
  const formatPrice = useFormatPrice();

  const createInputAssets = useMemo(() => {
    const assets: AssetValue[] = [];

    if (!hasWallet) return poolAssets;
    if (poolAssets.length === 0) return [];

    for (const chain of Object.keys(wallet)) {
      const chainWallet = getWallet(chain as Chain);
      const balances = chainWallet?.balance || [];
      if (Chain.THORChain !== chain) {
        for (const balance of balances) {
          // 1. if non-pool asset exists
          // 2. asset shouldn't be THORChain asset
          if (
            !poolAssets.find((poolAsset) => poolAsset.eq(balance)) &&
            balance.chain !== Chain.THORChain
          ) {
            // if erc20 token is whitelisted for THORChain

            if (isTokenWhitelisted(balance, poolWhitelist)) {
              assets.push(balance);
            }
          }
        }
      }
    }

    return assets;
  }, [poolWhitelist, getWallet, hasWallet, poolAssets, wallet]);

  const getContractAddress = useCallback(async (chain: Chain) => {
    const inboundData = (await getInboundData()) || [];
    const { router, halted } = inboundData.find((item) => item.chain === chain) || {};

    if (halted && !router) {
      throw new Error('Trading & LP is temporarily halted, please try again later.');
    }

    setContract(router || '');
  }, []);

  const handleInputAssetUpdate = useCallback(() => {
    if (hasWallet) {
      const assetsToSet =
        createInputAssets.filter((asset) => asset.ticker !== 'RUNE' && !asset.isSynthetic) || [];
      setInputAssets(assetsToSet);
    } else {
      setInputAssets([]);
    }
  }, [createInputAssets, hasWallet]);

  useEffect(() => {
    handleInputAssetUpdate();
  }, [handleInputAssetUpdate]);

  const [poolAsset, setPoolAsset] = useState(
    inputAssets?.[0] ?? AssetValue.fromChainOrSignature(Chain.Bitcoin),
  );

  const { getMaxBalance, isWalletAssetConnected } = useBalance();
  const { isChainPauseLPAction } = useMimir();
  const { getChainDepositLPPaused } = useExternalConfig();
  const isLPActionPaused = useMemo(
    () =>
      isChainPauseLPAction(poolAsset.chain) || getChainDepositLPPaused(poolAsset.chain as Chain),
    [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused],
  );

  const [assetAmount, setAssetAmount] = useState<SwapKitNumber>();
  const [runeAmount, setRuneAmount] = useState<SwapKitNumber>(new SwapKitNumber(0));

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [maxPoolAssetBalance, setMaxPoolAssetBalance] = useState<AssetValue>();
  const [maxRuneBalance, setMaxRuneBalance] = useState<AssetValue>(RUNEAsset);

  const {
    feeInUSD,
    inputFee: inboundAssetFee,
    outputFee: inboundRuneFee,
  } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: RUNEAsset,
  });

  const isInputWalletConnected = useMemo(
    () => !!getWallet(poolAsset.chain),
    [poolAsset, getWallet],
  );
  const isWalletConnected = useMemo(
    () => isInputWalletConnected && !!getWallet(Chain.THORChain),
    [isInputWalletConnected, getWallet],
  );

  const approveAssetAmount = useMemo(
    () => poolAsset.set(assetAmount?.getValue('string') || 0),
    [poolAsset, assetAmount],
  );

  const { isApproved, isLoading } = useIsAssetApproved({
    contract,
    assetValue: approveAssetAmount,
  });

  const assets = useMemo(() => [poolAsset, RUNEAsset], [poolAsset]);

  const { data: pricesData } = useTokenPrices(assets);

  const { assetUnitPrice, runeUnitPrice, assetUSDPrice, runeUSDPrice } = useMemo(() => {
    // TODO this might be wrong
    const assetUnitPrice = pricesData?.[poolAsset.toString()]?.price_usd || 0;
    const runeUnitPrice = pricesData?.[RUNEAsset.toString()]?.price_usd || 0;

    return {
      assetUnitPrice,
      runeUnitPrice,
      assetUSDPrice: assetAmount ? assetAmount.getValue('number') * assetUnitPrice : 0,
      runeUSDPrice: runeAmount ? runeAmount.getValue('number') * runeUnitPrice : 0,
    };
  }, [pricesData, poolAsset, assetAmount, runeAmount]);

  const price = useMemo(
    () =>
      assetAmount?.lte(0)
        ? assetAmount.set(0)
        : assetAmount
          ? runeAmount.div(assetAmount)
          : runeAmount,
    [assetAmount, runeAmount],
  );

  const poolAssetBalance = useMemo(
    () => (wallet ? getAssetBalance(poolAsset, wallet) : (poolAsset.set(0) as AssetValue)),
    [poolAsset, wallet],
  );

  useEffect(() => {
    getContractAddress(poolAsset.chain);
  }, [getContractAddress, poolAsset.chain]);

  useEffect(() => {
    getMaxBalance(assetAmount ? poolAsset.set(assetAmount) : poolAsset).then((assetMaxBalance) =>
      setMaxPoolAssetBalance(assetMaxBalance),
    );
  }, [poolAsset, getMaxBalance, assetAmount]);

  useEffect(() => {
    getMaxBalance(RUNEAsset.set(runeAmount)).then((runeMaxBalance) =>
      setMaxRuneBalance(runeMaxBalance),
    );
  }, [getMaxBalance, runeAmount]);

  const runeBalance = useMemo(
    () => (wallet ? getAssetBalance(RUNEAsset, wallet) : RUNEAsset.set(0)),
    [wallet],
  );

  const handleSelectPoolAsset = useCallback((poolAssetData: AssetValue) => {
    setPoolAsset(poolAssetData);
  }, []);

  const getBalancedAmountsForAsset = useCallback(
    (amount: SwapKitNumber) => {
      const baseAssetAmount =
        maxPoolAssetBalance && amount.gt(maxPoolAssetBalance)
          ? maxPoolAssetBalance
          : poolAsset.set(amount.getValue('string'));
      const baseRuneAmount = baseAssetAmount.mul(assetUnitPrice).div(runeUnitPrice);
      const exceedsRuneAmount = maxRuneBalance && baseRuneAmount.gt(maxRuneBalance);

      const runeAmount = exceedsRuneAmount ? maxRuneBalance : baseRuneAmount;
      const assetAmount = exceedsRuneAmount
        ? baseAssetAmount.set(runeAmount.mul(runeUnitPrice).div(assetUnitPrice))
        : baseAssetAmount;

      return { assetAmount, runeAmount };
    },
    [assetUnitPrice, maxPoolAssetBalance, maxRuneBalance, poolAsset, runeUnitPrice],
  );

  const getBalancedAmountsForRune = useCallback(
    (amount: SwapKitNumber) => {
      const baseRuneAmount =
        maxRuneBalance && amount.gt(maxRuneBalance)
          ? maxRuneBalance
          : RUNEAsset.set(amount.getValue('string'));
      const baseAssetAmount = baseRuneAmount.mul(runeUnitPrice).div(assetUnitPrice);
      const exceedsAssetAmount = maxPoolAssetBalance && baseAssetAmount.gt(maxPoolAssetBalance);

      const assetAmount = exceedsAssetAmount ? maxPoolAssetBalance : baseAssetAmount;
      const runeAmount = exceedsAssetAmount
        ? baseRuneAmount.set(assetAmount.mul(assetUnitPrice).div(runeUnitPrice))
        : baseRuneAmount;

      return { assetAmount, runeAmount };
    },
    [assetUnitPrice, maxPoolAssetBalance, maxRuneBalance, runeUnitPrice],
  );

  const handleChangeAssetAmount = useCallback(
    (amount: SwapKitNumber) => {
      const { assetAmount, runeAmount } = getBalancedAmountsForAsset(amount);

      setAssetAmount(
        new SwapKitNumber({ value: assetAmount.getValue('string'), decimal: assetAmount.decimal }),
      );
      setRuneAmount(
        new SwapKitNumber({ value: runeAmount.getValue('string'), decimal: runeAmount.decimal }),
      );
    },
    [getBalancedAmountsForAsset],
  );

  const handleChangeRuneAmount = useCallback(
    (amount: SwapKitNumber) => {
      const { assetAmount, runeAmount } = getBalancedAmountsForRune(amount);

      setAssetAmount(
        new SwapKitNumber({ value: assetAmount.getValue('string'), decimal: assetAmount.decimal }),
      );
      setRuneAmount(
        new SwapKitNumber({ value: runeAmount.getValue('string'), decimal: runeAmount.decimal }),
      );
    },
    [getBalancedAmountsForRune],
  );

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false);
    if (wallet) {
      const runeAssetAmount = RUNEAsset.set(runeAmount.getValue('string')) as AssetValue;
      const poolAssetAmount = poolAsset.set(assetAmount?.getValue('string') || 0) as AssetValue;
      const runeId = v4();
      const assetId = v4();

      appDispatch(
        addTransaction({
          id: runeId,
          label: t('txManager.addAmountAsset', {
            asset: RUNEAsset.ticker,
            amount: runeAssetAmount.toSignificant(6),
          }),
          type: TransactionType.TC_LP_ADD,
          inChain: Chain.THORChain,
        }),
      );

      appDispatch(
        addTransaction({
          id: assetId,
          label: t('txManager.addAmountAsset', {
            asset: poolAsset.ticker,
            amount: poolAssetAmount.toSignificant(6),
          }),
          type: TransactionType.TC_LP_ADD,
          inChain: poolAsset.chain,
        }),
      );

      let runeTx, assetTx;

      const { thorchain } = await (await import('services/swapKit')).getSwapKitClient();
      if (!thorchain) throw new Error('SwapKit client not found');

      try {
        const response = await thorchain.createLiquidity({
          runeAssetValue: runeAssetAmount,
          assetValue: poolAssetAmount,
        });

        runeTx = await response.runeTx;
        assetTx = await response.assetTx;

        runeTx && appDispatch(updateTransaction({ id: runeId, txid: runeTx }));
        assetTx && appDispatch(updateTransaction({ id: assetId, txid: assetTx }));
      } catch (error: NotWorth) {
        logException(error as Error);
        !runeTx && appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        !assetTx && appDispatch(completeTransaction({ id: assetId, status: 'error' }));

        showErrorToast(t('notification.submitFail'), error?.toString(), undefined, error as Error);
      }
    }
  }, [wallet, runeAmount, poolAsset, assetAmount, appDispatch]);

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false);

    if (isWalletAssetConnected(poolAsset)) {
      const id = v4();
      const type =
        poolAsset.chain === Chain.Ethereum
          ? TransactionType.ETH_APPROVAL
          : TransactionType.AVAX_APPROVAL;

      appDispatch(
        addTransaction({
          id,
          label: `${t('txManager.approve')} ${poolAsset.ticker}`,
          inChain: poolAsset.chain,
          type,
        }),
      );

      const { thorchain } = await (await import('services/swapKit')).getSwapKitClient();
      if (!thorchain) throw new Error('SwapKit client not found');

      try {
        const txid = await thorchain.approveAssetValue({ assetValue: poolAsset });

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error: NotWorth) {
        logException(error as Error);
        showErrorToast(t('notification.approveFailed'), undefined, undefined, error as Error);
        appDispatch(completeTransaction({ id, status: 'error' }));
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

  const depositAssets = useMemo(() => [poolAsset, RUNEAsset], [poolAsset]);

  const depositAssetInputs = useMemo(
    () => [
      { asset: RUNEAsset, value: runeAmount.toSignificant(6) },
      { asset: poolAsset, value: assetAmount?.toSignificant(6) || '' },
    ],
    [poolAsset, assetAmount, runeAmount],
  );

  const minRuneAmount = useMemo(() => getMinAmountByChain(Chain.THORChain), []);
  const minAssetAmount = useMemo(
    () =>
      poolAsset.isGasAsset
        ? getMinAmountByChain(poolAsset.chain)
        : getMinAmountByChain(Chain.THORChain),
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

    if (!runeAmount.gt(minRuneAmount) || !assetAmount?.gt(minAssetAmount)) {
      return {
        valid: false,
        msg: t('notification.invalidAmount'),
      };
    }

    return { valid: true };
  }, [isLPActionPaused, runeAmount, assetAmount, minRuneAmount, minAssetAmount, inputAssets]);

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
      asset: RUNEAsset,
      value: runeAmount,
      balance: runeBalance,
      usdPrice: runeUSDPrice,
    }),
    [runeAmount, runeBalance, runeUSDPrice],
  );

  const assetSelectList = useAssetsWithBalanceFromTokens(tokens);
  const filteredAssets = useMemo(
    () =>
      assetSelectList.filter((x) =>
        inputAssets.some((asset) => {
          return asset.toString().toUpperCase() === x.asset.toString().toUpperCase();
        }),
      ),
    [assetSelectList, inputAssets],
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
      // TODO Make sure this works
      { chain: poolAsset.chain, fee: inboundAssetFee.toSignificant() },
      { chain: Chain.THORChain, fee: inboundRuneFee.toSignificant() },
    ],
  });

  const approveConfirmInfo = useApproveInfoItems({
    assetName: poolAsset.ticker,
    assetValue: assetAmount?.toSignificant(6) || '0',
    // TODO Make sure this works
    fee: inboundAssetFee.toSignificant(),
  });

  const isDepositAvailable = useMemo(
    () => isWalletConnected && !isApproveRequired,
    [isWalletConnected, isApproveRequired],
  );

  const actionsComponent = useMemo(() => <GlobalSettingsPopover />, []);

  return (
    <PanelView
      header={
        <ViewHeader actionsComponent={actionsComponent} title={t('common.createLiquidity')} />
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
