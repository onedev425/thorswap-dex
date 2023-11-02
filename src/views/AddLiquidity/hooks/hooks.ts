import type { AssetEntity, Wallet } from '@thorswap-lib/swapkit-core';
import {
  Amount,
  AssetAmount,
  getLiquiditySlippage,
  getMinAmountByChain,
  isGasAsset,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { RUNEAsset } from 'helpers/assets';
import { getEstimatedTxTime } from 'helpers/getEstimatedTxTime';
import { parseToPercent } from 'helpers/parseHelpers';
import { hasWalletConnected } from 'helpers/wallet';
import { useLPMemberData } from 'hooks/useLiquidityData';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { getInboundData } from 'store/midgard/actions';
import type { PoolDetail } from 'store/midgard/types';
import { LiquidityTypeOption } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { useAddLiquidityUtils } from 'views/AddLiquidity/hooks/useAddLiquidityUtils';
import type { DepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { useConfirmInfoItems } from './useConfirmInfoItems';

type Props = {
  depositAssetsBalance: DepositAssetsBalance;
  liquidityType: LiquidityTypeOption;
  onAddLiquidity?: (params: { runeAmount: AssetAmount; poolAsset: AssetEntity }) => void;
  poolAsset: AssetEntity;
  poolData?: PoolDetail;
  setLiquidityType: (option: LiquidityTypeOption) => void;
  skipWalletCheck?: boolean;
  wallet: Wallet | null;
};

const toRuneAmount = (amount: Amount) => Amount.fromAssetAmount(amount.assetAmount.toString(), 8);

const toAssetAmount = (amount: Amount, asset: AssetEntity) =>
  Amount.fromAssetAmount(amount.assetAmount.toString(), asset.decimal);

const getEstimatedPoolShareAfterAdd = ({
  runeDepth,
  poolUnits,
  assetDepth,
  liquidityUnits,
  runeAmount,
  assetAmount,
}: {
  poolUnits: string;
  liquidityUnits: string;
  runeAmount: string;
  assetAmount: string;
  runeDepth: string;
  assetDepth: string;
}) => {
  const R = Amount.fromMidgard(runeDepth);
  const A = Amount.fromMidgard(assetDepth);
  const P = Amount.fromMidgard(poolUnits);
  const poolLiquidityUnits = Amount.fromMidgard(liquidityUnits);
  const runeAddAmount = Amount.fromMidgard(runeAmount);
  const assetAddAmount = Amount.fromMidgard(assetAmount);

  // liquidityUnits = P * (r*A + a*R + 2*r*a) / (r*A + a*R + 2*R*A)
  const rA = runeAddAmount.mul(A);
  const aR = assetAddAmount.mul(R);
  const ra = runeAddAmount.mul(assetAddAmount);
  const RA = R.mul(A);
  const numerator = P.mul(rA.add(aR.add(ra.mul(2))));
  const denominator = rA.add(aR.add(RA.mul(2)));
  const diffAfterAdd = numerator.div(denominator);
  const estimatedLiquidityUnits = poolLiquidityUnits.mul(diffAfterAdd);

  if (diffAfterAdd.gt(0)) {
    return estimatedLiquidityUnits.div(P).assetAmount.toNumber();
  }

  return 0;
};

const getMaxSymAmounts = ({
  assetAmount,
  runeAmount,
  runePriceInAsset,
  assetPriceInRune,
  minAssetAmount,
  minRuneAmount,
}: {
  assetAmount: Amount;
  runeAmount: Amount;
  runePriceInAsset: number;
  assetPriceInRune: number;
  minAssetAmount: Amount;
  minRuneAmount: Amount;
}) => {
  const symAssetAmount = runeAmount.mul(runePriceInAsset);

  if (symAssetAmount.gt(assetAmount)) {
    const maxSymAssetAmount = assetAmount.lte(minAssetAmount) ? minAssetAmount : assetAmount;
    const maxSymRuneAmount = maxSymAssetAmount.mul(assetPriceInRune).lte(minRuneAmount)
      ? minRuneAmount
      : maxSymAssetAmount.mul(assetPriceInRune);

    return {
      maxSymAssetAmount,
      maxSymRuneAmount,
    };
  }
  const maxSymAssetAmount = symAssetAmount.lte(minAssetAmount) ? minAssetAmount : symAssetAmount;
  const maxSymRuneAmount = runeAmount.lte(minRuneAmount) ? minRuneAmount : runeAmount;

  return {
    maxSymAssetAmount,
    maxSymRuneAmount,
  };
};

export const useAddLiquidity = ({
  onAddLiquidity,
  skipWalletCheck,
  liquidityType,
  setLiquidityType,
  poolAsset,
  poolData,
  depositAssetsBalance,
  wallet,
}: Props) => {
  const appDispatch = useAppDispatch();
  const { expertMode } = useApp();
  const [contract, setContract] = useState<string | undefined>();
  const { data: tokenPricesData } = useTokenPrices([RUNEAsset, poolAsset]);

  const {
    isWalletAssetConnected,
    runeBalance,
    maxRuneBalance,
    poolAssetBalance,
    maxPoolAssetBalance,
  } = depositAssetsBalance;
  const { setIsConnectModalOpen } = useWallet();
  const { isLPActionPaused } = useAddLiquidityUtils({ poolAsset });
  const { lpMemberData, isAssetPending, isRunePending } = useLPMemberData(poolAsset.symbol);

  const isSymDeposit = useMemo(
    () => liquidityType === LiquidityTypeOption.SYMMETRICAL && !expertMode,
    [liquidityType, expertMode],
  );

  const [assetAmount, setAssetAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));
  const [runeAmount, setRuneAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [asymmTipVisible, setAsymmTipVisible] = useState(true);

  const {
    feeInUSD,
    inputFee: inboundAssetFee,
    outputFee: inboundRuneFee,
  } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: RUNEAsset,
  });

  const liquidityParams = useMemo(
    () => ({
      runeAmount: runeAmount.assetAmount.toString(),
      assetAmount: assetAmount.assetAmount.toString(),
      runeDepth: poolData?.runeDepth ?? '0',
      assetDepth: poolData?.assetDepth ?? '0',
      liquidityUnits: poolData?.liquidityUnits ?? '0',
      poolUnits: poolData?.units ?? '0',
    }),
    [
      assetAmount.assetAmount,
      poolData?.assetDepth,
      poolData?.liquidityUnits,
      poolData?.runeDepth,
      poolData?.units,
      runeAmount.assetAmount,
    ],
  );

  const runePriceInAsset =
    parseInt(poolData?.assetDepth || '0') / parseInt(poolData?.runeDepth || '0');
  const assetPriceInRune =
    parseInt(poolData?.runeDepth || '0') / parseInt(poolData?.assetDepth || '0');

  const addLiquiditySlip = useMemo(
    () => getLiquiditySlippage(liquidityParams).toFixed(2),
    [liquidityParams],
  );

  const poolShareEst = useMemo(
    () => parseToPercent(getEstimatedPoolShareAfterAdd(liquidityParams)),
    [liquidityParams],
  );

  const isWalletConnected = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.ASSET) {
      return hasWalletConnected({ wallet, inputAssets: [poolAsset] });
    }
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return hasWalletConnected({ wallet, inputAssets: [RUNEAsset] });
    }

    // symm
    return (
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [RUNEAsset] })
    );
  }, [wallet, poolAsset, liquidityType]);

  const getContractAddress = useCallback(async (chain: Chain) => {
    const inboundData = (await getInboundData()) || [];
    const { router, halted } = inboundData.find((item) => item.chain === chain) || {};

    if (halted && !router) {
      throw new Error('Trading & LP is temporarily halted, please try again later.');
    }

    setContract(router);
  }, []);

  useEffect(() => {
    getContractAddress(poolAsset.chain);
  }, [getContractAddress, poolAsset.chain]);

  const { isApproved, isLoading } = useIsAssetApproved({
    asset: poolAsset,
    contract,
    force: true,
    amount: assetAmount.gt(0) ? assetAmount : undefined,
  });

  const poolAssetPriceInUSD = useMemo(() => {
    const price =
      Number(poolData?.assetPriceUSD) || tokenPricesData[poolAsset.symbol]?.price_usd || 0;
    const amount =
      (isAssetPending &&
        Amount.fromMidgard(lpMemberData?.assetPending || '0').assetAmount.toNumber()) ||
      assetAmount.assetAmount.toNumber();

    return price * amount;
  }, [
    poolData,
    tokenPricesData,
    poolAsset.symbol,
    isAssetPending,
    lpMemberData?.assetPending,
    assetAmount.assetAmount,
  ]);

  const minRuneAmount: Amount = useMemo(
    () => getMinAmountByChain(Chain.THORChain as Chain).amount,
    [],
  );
  const minAssetAmount: Amount = useMemo(() => {
    if (isGasAsset(poolAsset)) {
      return getMinAmountByChain(poolAsset.chain);
    }

    return Amount.fromAssetAmount(0, 8);
  }, [poolAsset]);

  const { maxSymAssetAmount, maxSymRuneAmount } = useMemo(() => {
    if (!poolData) {
      return {
        maxSymAssetAmount: Amount.fromAssetAmount(0, 8),
        maxSymRuneAmount: Amount.fromAssetAmount(0, 8),
      };
    }

    if (isAssetPending && lpMemberData) {
      return getMaxSymAmounts({
        runeAmount: maxRuneBalance,
        assetAmount: Amount.fromMidgard(lpMemberData?.assetPending),
        runePriceInAsset,
        assetPriceInRune,
        minAssetAmount,
        minRuneAmount,
      });
    }

    if (isRunePending && lpMemberData) {
      return getMaxSymAmounts({
        runeAmount: Amount.fromMidgard(lpMemberData?.runePending),
        assetAmount: maxPoolAssetBalance,
        runePriceInAsset,
        assetPriceInRune,
        minAssetAmount,
        minRuneAmount,
      });
    }

    return getMaxSymAmounts({
      runeAmount: maxRuneBalance,
      assetAmount: maxPoolAssetBalance,
      runePriceInAsset,
      assetPriceInRune,
      minAssetAmount,
      minRuneAmount,
    });
  }, [
    poolData,
    isAssetPending,
    lpMemberData,
    isRunePending,
    maxRuneBalance,
    maxPoolAssetBalance,
    runePriceInAsset,
    assetPriceInRune,
    minAssetAmount,
    minRuneAmount,
  ]);

  const handleSelectLiquidityType = useCallback(
    (type: LiquidityTypeOption) => {
      if (type === LiquidityTypeOption.ASSET) {
        setRuneAmount(Amount.fromAssetAmount(0, 8));
      } else if (type === LiquidityTypeOption.RUNE) {
        setAssetAmount(Amount.fromAssetAmount(0, 8));
      }

      setLiquidityType(type);
    },
    [setLiquidityType],
  );

  const handleChangeAssetAmount = useCallback(
    (amount: Amount) => {
      if (!poolData) {
        setAssetAmount(toAssetAmount(amount, poolAsset));
        return;
      }

      const maxAmount = isSymDeposit ? maxSymAssetAmount : maxPoolAssetBalance;

      if (amount.gt(maxAmount) && !skipWalletCheck) {
        setAssetAmount(toAssetAmount(maxAmount, poolAsset));

        if (isSymDeposit) {
          setRuneAmount(toRuneAmount(maxAmount.mul(assetPriceInRune)));
        }
      } else {
        setAssetAmount(toAssetAmount(amount, poolAsset));

        if (isSymDeposit) {
          setRuneAmount(toRuneAmount(amount.mul(assetPriceInRune)));
        }
      }
    },
    [
      poolData,
      isSymDeposit,
      maxSymAssetAmount,
      maxPoolAssetBalance,
      skipWalletCheck,
      poolAsset,
      assetPriceInRune,
    ],
  );

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      if (!poolData) {
        setRuneAmount(toRuneAmount(amount));
        return;
      }

      const maxAmount = isSymDeposit ? maxSymRuneAmount : maxRuneBalance;
      if (amount.gt(maxAmount) && !skipWalletCheck) {
        setRuneAmount(toRuneAmount(maxAmount));

        if (isSymDeposit) {
          setAssetAmount(toAssetAmount(maxAmount.mul(runePriceInAsset), poolAsset));
        }
      } else {
        setRuneAmount(toRuneAmount(amount));
        if (isSymDeposit) {
          setAssetAmount(toAssetAmount(amount.mul(runePriceInAsset), poolAsset));
        }
      }
    },
    [
      poolData,
      isSymDeposit,
      maxSymRuneAmount,
      maxRuneBalance,
      skipWalletCheck,
      runePriceInAsset,
      poolAsset,
    ],
  );

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false);
    if (onAddLiquidity && poolAsset && liquidityType !== LiquidityTypeOption.ASSET) {
      const runeAssetAmount = new AssetAmount(RUNEAsset, runeAmount);
      onAddLiquidity({ poolAsset, runeAmount: runeAssetAmount });

      return;
    }

    if (wallet && poolData) {
      const runeAssetAmount =
        liquidityType !== LiquidityTypeOption.ASSET
          ? new AssetAmount(RUNEAsset, runeAmount)
          : undefined;
      const poolAssetAmount =
        liquidityType !== LiquidityTypeOption.RUNE
          ? new AssetAmount(
              poolAsset,
              Amount.fromAssetAmount(assetAmount.assetAmount.toString(), poolAsset.decimal),
            )
          : undefined;

      const runeId = v4();
      const assetId = v4();

      if (!isRunePending && runeAssetAmount) {
        appDispatch(
          addTransaction({
            id: runeId,
            label: t('txManager.addAmountAsset', {
              asset: RUNEAsset.name,
              amount: runeAmount.toSignificant(6),
            }),
            type: TransactionType.TC_LP_ADD,
            inChain: Chain.THORChain,
          }),
        );
      }

      if (!isAssetPending && poolAssetAmount) {
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
      }

      const isPendingSymmAsset =
        isRunePending || isAssetPending || liquidityType === LiquidityTypeOption.SYMMETRICAL;

      const addresses =
        isRunePending || isAssetPending || liquidityType === LiquidityTypeOption.SYMMETRICAL
          ? {
              runeAddr: lpMemberData?.runeAddress,
              assetAddr: lpMemberData?.assetAddress,
            }
          : {};

      const mode =
        liquidityType === LiquidityTypeOption.SYMMETRICAL
          ? ('sym' as const)
          : liquidityType === LiquidityTypeOption.ASSET
          ? ('asset' as const)
          : ('rune' as const);

      const params = {
        pool: { asset: poolAsset },
        runeAmount: isRunePending ? undefined : runeAssetAmount,
        assetAmount: isAssetPending ? undefined : poolAssetAmount,
        isPendingSymmAsset,
        mode,
        ...addresses,
      };

      const { addLiquidity } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        // @ts-expect-error remove this when swapkit is updated
        const { runeTx, assetTx } = await addLiquidity(params);

        if (runeTx !== 'failed') {
          appDispatch(updateTransaction({ id: runeId, txid: runeTx }));
        } else {
          appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        }

        if (assetTx !== 'failed') {
          appDispatch(updateTransaction({ id: assetId, txid: assetTx }));
        } else {
          appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        }
      } catch (error: NotWorth) {
        const message = error?.data?.originalError || error.message;
        appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        showErrorToast(t('notification.submitFail'), message);
      }
    }
  }, [
    onAddLiquidity,
    poolAsset,
    wallet,
    poolData,
    liquidityType,
    runeAmount,
    assetAmount,
    lpMemberData?.runeAddress,
    lpMemberData?.assetAddress,
    isRunePending,
    isAssetPending,
    appDispatch,
  ]);

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
          type,
          label: `${t('txManager.approve')} ${poolAsset.name}`,
          inChain: poolAsset.L1Chain,
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
  }, [appDispatch, poolAsset, isWalletAssetConnected]);

  const handleAddLiquidity = useCallback(() => {
    if (!isWalletConnected && !skipWalletCheck) {
      return showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }

    setVisibleConfirmModal(true);
  }, [isWalletConnected, skipWalletCheck]);

  const handleApprove = useCallback(() => {
    if (wallet) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [wallet]);

  const depositAssets: AssetEntity[] = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [RUNEAsset];
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [poolAsset];
    }

    return [poolAsset, RUNEAsset];
  }, [liquidityType, poolAsset]);

  const depositAssetInputs = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [{ asset: RUNEAsset, value: runeAmount.toSignificant(6) }];
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [{ asset: poolAsset, value: assetAmount.toSignificant(6) }];
    }

    return [
      { asset: RUNEAsset, value: runeAmount.toSignificant(6) },
      { asset: poolAsset, value: assetAmount.toSignificant(6) },
    ];
  }, [liquidityType, poolAsset, assetAmount, runeAmount]);

  const isValidDeposit: {
    valid: boolean;
    msg?: string;
  } = useMemo(() => {
    if (isLPActionPaused) {
      return { valid: false, msg: t('notification.notAvailableDeposit') };
    }
    // only invalid scenario is
    // 1. rune asym
    // 2. rune-asset sym

    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      if (!runeAmount.gte(minRuneAmount) || !assetAmount.gte(minAssetAmount)) {
        return {
          valid: false,
          msg: t('notification.invalidAmount'),
        };
      }

      if (lpMemberData && !!lpMemberData.assetPending && !!lpMemberData.runePending) {
        // if runeAsym or assetAsym already exist, cannot deposit symmetrically
        if (lpMemberData.runeAdded) {
          return { valid: false, msg: t('notification.alreadyHaveRune') };
        }
      }
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      if (!assetAmount.gte(minAssetAmount)) {
        return { valid: false, msg: t('notification.insufficientAmount') };
      }
    }

    if (liquidityType === LiquidityTypeOption.RUNE) {
      if (!runeAmount.gte(minRuneAmount)) {
        return { valid: false, msg: t('notification.insufficientAmount') };
      }
    }

    return { valid: true };
  }, [
    lpMemberData,
    isLPActionPaused,
    liquidityType,
    runeAmount,
    assetAmount,
    minRuneAmount,
    minAssetAmount,
  ]);

  const isInputWalletConnected = useMemo(
    () => poolAsset && hasWalletConnected({ wallet, inputAssets: [poolAsset] }),
    [wallet, poolAsset],
  );

  const isApproveRequired = useMemo(
    () =>
      isInputWalletConnected && isApproved === false && liquidityType !== LiquidityTypeOption.RUNE,
    [isInputWalletConnected, isApproved, liquidityType],
  );

  const poolAssetInput = useMemo(
    () => ({
      asset: poolAsset,
      balance: poolAssetBalance,
      usdPrice: poolAssetPriceInUSD,
      value: Amount.fromAssetAmount(
        (isAssetPending && lpMemberData
          ? Amount.fromMidgard(lpMemberData.assetPending)
          : assetAmount
        ).assetAmount.toString(),
        poolAsset.decimal,
      ),
    }),
    [poolAsset, poolAssetBalance, poolAssetPriceInUSD, isAssetPending, lpMemberData, assetAmount],
  );

  const runeAssetInput = useMemo(() => {
    const value =
      isRunePending && lpMemberData ? Amount.fromMidgard(lpMemberData.runePending) : runeAmount;
    const runePrice = tokenPricesData[`${RUNEAsset.chain}.${RUNEAsset.symbol}`]?.price_usd || 0;

    return {
      asset: RUNEAsset,
      balance: runeBalance,
      usdPrice: runePrice * value.assetAmount.toNumber(),
      value,
    };
  }, [isRunePending, lpMemberData, runeAmount, runeBalance, tokenPricesData]);

  const title = useMemo(() => `Add ${poolAsset.ticker} Liquidity`, [poolAsset]);

  const btnLabel = useMemo(() => {
    if (!isValidDeposit.valid) return isValidDeposit.msg;

    if (isApproveRequired) return 'Add';

    return 'Add Liquidity';
  }, [isValidDeposit, isApproveRequired]);

  const estimatedTime = useMemo(() => {
    const isRuneLiquidity = liquidityType === LiquidityTypeOption.RUNE;

    return getEstimatedTxTime({
      amount: isRuneLiquidity ? runeAmount : assetAmount,
      chain: isRuneLiquidity ? Chain.THORChain : poolAsset.chain,
    });
  }, [liquidityType, assetAmount, runeAmount, poolAsset]);

  const confirmInfo = useConfirmInfoItems({
    assets: depositAssetInputs,
    poolShare: poolShareEst,
    slippage: addLiquiditySlip || 'N/A',
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

  const rate = useMemo(() => {
    const runePrice = tokenPricesData[RUNEAsset.symbol]?.price_usd || 0;
    const assetPrice = tokenPricesData[poolAsset.symbol]?.price_usd || 0;

    return runePrice / assetPrice;
  }, [poolAsset.symbol, tokenPricesData]);

  return {
    addLiquiditySlip,
    approveConfirmInfo,
    asymmTipVisible,
    btnLabel,
    confirmInfo,
    depositAssets,
    handleAddLiquidity,
    handleApprove,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    handleConfirmAdd,
    handleConfirmApprove,
    handleSelectLiquidityType,
    isApproveRequired,
    isAssetApproveLoading: isLoading,
    isAssetPending,
    isDepositAvailable,
    isRunePending,
    isValidDeposit,
    isWalletConnected,
    lpMemberData,
    poolAssetInput,
    poolShareEst,
    rate,
    runeAssetInput,
    setAsymmTipVisible,
    setIsConnectModalOpen,
    setVisibleApproveModal,
    setVisibleConfirmModal,
    title,
    feeInUSD,
    visibleApproveModal,
    visibleConfirmModal,
  };
};
