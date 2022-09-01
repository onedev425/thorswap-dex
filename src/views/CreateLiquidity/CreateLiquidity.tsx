import {
  Amount,
  Asset,
  AssetAmount,
  getEstimatedTxTime,
  hasConnectedWallet,
  hasWalletConnected,
  Price,
} from '@thorswap-lib/multichain-sdk';
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
import { useApprove } from 'hooks/useApprove';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { getSumAmountInUSD, useNetworkFee } from 'hooks/useNetworkFee';
import { useTxTracker } from 'hooks/useTxTracker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { TxTrackerStatus, TxTrackerType } from 'store/midgard/types';
import { useAppSelector } from 'store/store';
import { useWallet } from 'store/wallet/hooks';

import { AssetInputs } from './AssetInputs';
import { PoolInfo } from './PoolInfo';
import { useConfirmInfoItems } from './useConfirmInfoItems';

export const CreateLiquidity = () => {
  const { pools } = useAppSelector(({ midgard }) => midgard);
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [inputAssets, setInputAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const getInputAssets = async () => {
      if (hasConnectedWallet(wallet)) {
        const assets = await getInputAssetsForCreate({ wallet, pools });
        const assetsToSet =
          assets.filter((asset) => asset.ticker !== 'RUNE' && !asset.isSynth) || [];

        setInputAssets(assetsToSet);
      } else {
        setInputAssets([]);
      }
    };
    getInputAssets();
  }, [wallet, pools]);

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

  const { submitTransaction, pollTransaction, setTxFailed } = useTxTracker();

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);

  const { inboundFee: inboundAssetFee, outboundFee: inboundRuneFee } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: Asset.RUNE(),
  });

  const isWalletConnected = useMemo(() => {
    // symm
    return (
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] })
    );
  }, [wallet, poolAsset]);

  const { isApproved, assetApproveStatus } = useApprove(poolAsset, isWalletConnected);

  const runeAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        quoteAsset: Asset.USD(),
        pools,
        priceAmount: runeAmount,
      }),
    [runeAmount, pools],
  );

  const poolAssetPriceInUSD = runeAssetPriceInUSD;

  const poolAssetValueInUSD = useMemo(
    () =>
      new Price({
        baseAsset: Asset.RUNE(),
        quoteAsset: Asset.USD(),
        pools,
        priceAmount: runeAmount.div(assetAmount),
      }),
    [runeAmount, assetAmount, pools],
  );

  const price: Amount = useMemo(() => {
    if (assetAmount.eq(0)) return Amount.fromAssetAmount(0, 8);

    return runeAmount.div(assetAmount);
  }, [runeAmount, assetAmount]);

  const poolAssetBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(poolAsset, wallet).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [poolAsset, wallet]);

  const maxPoolAssetBalance: Amount = useMemo(
    () => getMaxBalance(poolAsset),
    [poolAsset, getMaxBalance],
  );

  const runeBalance: Amount = useMemo(() => {
    if (wallet) {
      return getAssetBalance(Asset.RUNE(), wallet).amount;
    }

    // allow max amount if wallet is not connected
    return Amount.fromAssetAmount(10 ** 3, 8);
  }, [wallet]);

  const maxRuneBalance: Amount = useMemo(() => getMaxBalance(Asset.RUNE()), [getMaxBalance]);

  const handleSelectPoolAsset = useCallback((poolAssetData: Asset) => {
    setPoolAsset(poolAssetData);
  }, []);

  const handleChangeAssetAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(maxPoolAssetBalance)) {
        setAssetAmount(maxPoolAssetBalance);
      } else {
        setAssetAmount(amount);
      }
    },
    [maxPoolAssetBalance],
  );

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      if (amount.gt(maxRuneBalance)) {
        setRuneAmount(maxRuneBalance);
      } else {
        setRuneAmount(amount);
      }
    },
    [maxRuneBalance],
  );

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false);
    if (wallet) {
      const runeAssetAmount = new AssetAmount(Asset.RUNE(), runeAmount);
      const poolAssetAmount = new AssetAmount(poolAsset, assetAmount);

      const inAssets = [];
      inAssets.push({
        asset: Asset.RUNE().toString(),
        amount: runeAmount.toSignificant(6),
      });

      inAssets.push({
        asset: poolAsset.toString(),
        amount: assetAmount.toSignificant(6),
      });

      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.AddLiquidity,
        submitTx: {
          inAssets,
          outAssets: [],
          poolAsset: poolAsset.ticker,
        },
      });

      try {
        const txRes = await multichain().createLiquidity({
          runeAmount: runeAssetAmount,
          assetAmount: poolAssetAmount,
        });

        const runeTxHash = txRes?.runeTx;
        const assetTxHash = txRes?.assetTx;

        if (runeTxHash || assetTxHash) {
          // start polling
          pollTransaction({
            type: TxTrackerType.AddLiquidity,
            uuid: trackId,
            submitTx: {
              inAssets,
              outAssets: [],
              txID: runeTxHash || assetTxHash,
              addTx: {
                runeTxID: runeTxHash,
                assetTxID: assetTxHash,
              },
              poolAsset: poolAsset.ticker,
            },
          });
        }
      } catch (error: NotWorth) {
        setTxFailed(trackId);

        showErrorToast(t('notification.submitTxFailed'));
        console.info(error);
      }
    }
  }, [wallet, poolAsset, runeAmount, assetAmount, submitTransaction, pollTransaction, setTxFailed]);

  const handleConfirmApprove = useCallback(async () => {
    setVisibleApproveModal(false);

    if (isWalletAssetConnected(poolAsset)) {
      // register to tx tracker
      const trackId = submitTransaction({
        type: TxTrackerType.Approve,
        submitTx: {
          inAssets: [
            {
              asset: poolAsset.toString(),
              amount: '0', // not needed for approve tx
            },
          ],
        },
      });

      try {
        const txHash = await multichain().approveAsset(poolAsset);

        if (txHash) {
          if (txHash) {
            // start polling
            pollTransaction({
              type: TxTrackerType.Approve,
              uuid: trackId,
              submitTx: {
                inAssets: [
                  {
                    asset: poolAsset.toString(),
                    amount: '0', // not needed for approve tx
                  },
                ],
                txID: txHash,
              },
            });
          }
        }
      } catch (error) {
        setTxFailed(trackId);

        showErrorToast(t('notification.approveFailed'));
      }
    }
  }, [poolAsset, isWalletAssetConnected, pollTransaction, setTxFailed, submitTransaction]);

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

  const depositAssets: Asset[] = useMemo(() => {
    return [poolAsset, Asset.RUNE()];
  }, [poolAsset]);

  const depositAssetInputs = useMemo(() => {
    return [
      { asset: Asset.RUNE(), value: runeAmount.toSignificant(6) },
      { asset: poolAsset, value: assetAmount.toSignificant(6) },
    ];
  }, [poolAsset, assetAmount, runeAmount]);

  const minRuneAmount: Amount = useMemo(
    () => AssetAmount.getMinAmountByChain(Chain.THORChain).amount,
    [],
  );
  const minAssetAmount: Amount = useMemo(() => {
    if (poolAsset.isGasAsset()) {
      return AssetAmount.getMinAmountByChain(poolAsset.chain);
    }

    return Amount.fromAssetAmount(0, 8);
  }, [poolAsset]);

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
      usdPrice: poolAssetPriceInUSD,
    }),
    [poolAsset, assetAmount, poolAssetBalance, poolAssetPriceInUSD],
  );

  const runeAssetInput = useMemo(
    () => ({
      asset: Asset.RUNE(),
      value: runeAmount,
      balance: runeBalance,
      usdPrice: runeAssetPriceInUSD,
    }),
    [runeAmount, runeBalance, runeAssetPriceInUSD],
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
        assetUSDPrice={poolAssetValueInUSD.toCurrencyFormat(3)}
        poolAsset={poolAssetInput}
        poolShare="100%"
        rate={price.toSignificant(6)}
        runeAsset={runeAssetInput}
      />

      {isApproveRequired && (
        <Box className="w-full pt-5">
          <Button
            isFancy
            stretch
            loading={[TxTrackerStatus.Pending, TxTrackerStatus.Submitting].includes(
              assetApproveStatus,
            )}
            onClick={handleApprove}
            size="lg"
          >
            Approve
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
