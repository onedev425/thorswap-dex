import type { AssetValue, Wallet } from '@swapkit/core';
import { BaseDecimal, Chain, getMinAmountByChain, isGasAsset, SwapKitNumber } from '@swapkit/core';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { RUNEAsset } from 'helpers/assets';
import { getEstimatedTxTime } from 'helpers/getEstimatedTxTime';
import { parseToPercent } from 'helpers/parseHelpers';
import { useLPMemberData } from 'hooks/useLiquidityData';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useApp } from 'store/app/hooks';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { getInboundData } from 'store/midgard/actions';
import type { PoolDetail } from 'store/midgard/types';
import { LiquidityTypeOption } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';
import type { DepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { useConfirmInfoItems } from './useConfirmInfoItems';

type Props = {
  depositAssetsBalance: DepositAssetsBalance;
  liquidityType: LiquidityTypeOption;
  onAddLiquidity?: (params: { runeAmount: AssetValue; poolAsset: AssetValue }) => void;
  poolAsset: AssetValue;
  poolData?: PoolDetail;
  setLiquidityType: (option: LiquidityTypeOption) => void;
  skipWalletCheck?: boolean;
  wallet?: Wallet | null;
};

const toTCSwapKitNumber = (value: string) =>
  SwapKitNumber.fromBigInt(BigInt(value), BaseDecimal.THOR);

const getEstimatedPoolShareForPoolDepth = ({
  depth,
  poolUnits,
  liquidityUnits,
}: {
  poolUnits: string;
  liquidityUnits: string;
  depth: string;
}) => new SwapKitNumber(depth).mul(liquidityUnits).div(poolUnits).getValue('string');

const getLiquiditySlippage = ({
  runeAmount,
  assetAmount,
  runeDepth,
  assetDepth,
}: {
  runeAmount: string;
  assetAmount: string;
  runeDepth: string;
  assetDepth: string;
}) => {
  if ((runeAmount === '0' && assetAmount === '0') || runeDepth === '0' || assetDepth === '0')
    return 0;

  if (runeAmount === '0' || assetAmount === '0') {
    // Get current pool balance
    const poolBalanceRune = SwapKitNumber.fromBigInt(BigInt(runeDepth));
    const poolBalanceAsset = SwapKitNumber.fromBigInt(BigInt(assetDepth));
    const poolBalanceRatioRune = poolBalanceAsset.div(poolBalanceRune);
    //   const poolValueInRune = poolBalanceRune.mul(2);

    const runeInputValue = new SwapKitNumber(runeAmount);
    const assetInputValueRune = new SwapKitNumber(assetAmount).div(poolBalanceRatioRune);

    if (runeInputValue.eqValue(assetInputValueRune)) return 0;

    const slippageAsset = assetInputValueRune.gt(runeInputValue)
      ? assetInputValueRune
      : runeInputValue;

    const slippage = slippageAsset.div(2).div(slippageAsset.add(poolBalanceRune)).mul(100);
    return slippage.getValue('number');
  }

  // formula: (t * R - T * r)/ (T*r + R*T)
  const R = toTCSwapKitNumber(runeDepth);
  const T = toTCSwapKitNumber(assetDepth);
  const assetAddAmount = new SwapKitNumber(assetAmount);
  const runeAddAmount = new SwapKitNumber(runeAmount);

  const numerator = assetAddAmount.mul(R).sub(T.mul(runeAddAmount));
  const denominator = T.mul(runeAddAmount).add(R.mul(T));
  // set absolute value of percent, no negative allowed
  return Math.abs(numerator.div(denominator).mul(100).getValue('number'));
};

const getEstimatedPoolShareAfterAdd = ({
  runeDepth,
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
  if (runeAmount === '0' && assetAmount === '0') return 0;

  const R = new SwapKitNumber({ value: runeDepth, decimal: 8 });
  const A = new SwapKitNumber({ value: assetDepth, decimal: 8 });
  const P = new SwapKitNumber({ value: liquidityUnits, decimal: 8 });
  const runeAddAmount = new SwapKitNumber(runeAmount).mul(10 ** 8);
  const assetAddAmount = new SwapKitNumber(assetAmount).mul(10 ** 8);

  // liquidityUnits = P * (r*A + a*R + 2*r*a) / (r*A + a*R + 2*R*A)
  const rA = runeAddAmount.mul(A);
  const aR = assetAddAmount.mul(R);
  const ra = runeAddAmount.mul(assetAddAmount);
  const RA = R.mul(A);
  const numerator = P.mul(rA.add(aR.add(ra.mul(2))));
  const denominator = rA.add(aR.add(RA.mul(2)));
  const diffAfterAdd = numerator.div(denominator || 1);

  if (diffAfterAdd.gt(0)) {
    return diffAfterAdd.div(P || 1).getValue('number');
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
  assetAmount: AssetValue | SwapKitNumber;
  runeAmount: AssetValue | SwapKitNumber;
  runePriceInAsset: number;
  assetPriceInRune: number;
  minAssetAmount: SwapKitNumber | AssetValue;
  minRuneAmount: SwapKitNumber | AssetValue;
}) => {
  const calcSymmAmount = runeAmount.mul(runePriceInAsset);

  if (calcSymmAmount.gt(assetAmount)) {
    const symAssetAmount = assetAmount.lte(minAssetAmount) ? minAssetAmount : assetAmount;
    const symRuneAmount = runeAmount.lte(minRuneAmount) ? minRuneAmount : runeAmount;

    const maxRuneAmount = Math.min(
      symAssetAmount.set(symAssetAmount.getValue('number') / runePriceInAsset).getValue('number'),
      runeAmount.getValue('number'),
    );
    const maxAssetAmount = Math.min(
      symRuneAmount.set(symRuneAmount.getValue('number') / assetPriceInRune).getValue('number'),
      assetAmount.getValue('number'),
    );

    return {
      maxSymAssetAmount: symAssetAmount.set(maxAssetAmount),
      maxSymRuneAmount: assetAmount.set(maxRuneAmount),
    };
  }

  const maxSymAssetAmount = calcSymmAmount.lte(minAssetAmount) ? minAssetAmount : calcSymmAmount;
  const maxSymRuneAmount = runeAmount.lte(minRuneAmount) ? minRuneAmount : runeAmount;

  return { maxSymAssetAmount, maxSymRuneAmount };
};

type Actions =
  | { type: 'setLpProgressModal'; payload: boolean }
  | { type: 'setContract'; payload: string }
  | {
      type: 'setLPProgressState';
      payload: {
        assetAddress?: string;
        poolAddress: string;
        poolAssetValue?: AssetValue;
        runeAddress?: string;
        symmetric: boolean;
        runeAssetValue?: AssetValue;
      };
    };

const initialState = {
  assetAddress: '',
  contract: '',
  symmetric: false,
  lpProgressModal: false,
  poolAddress: '',
  poolAssetValue: undefined as AssetValue | undefined,
  runeAddress: '',
  runeAssetValue: undefined as AssetValue | undefined,
};

const reducer = (state: typeof initialState, { type, payload }: Actions) => {
  switch (type) {
    case 'setLpProgressModal':
      return { ...state, lpProgressModal: payload };

    case 'setContract':
      return { ...state, contract: payload };

    case 'setLPProgressState':
      return { ...state, ...payload, lpProgressModal: true };

    default:
      return state;
  }
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
  const { hasWallet, getWallet } = useWallet();
  const appDispatch = useAppDispatch();
  const { expertMode } = useApp();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { isChainPauseLPAction } = useMimir();
  const { getChainDepositLPPaused } = useExternalConfig();
  const { data: tokenPricesData } = useTokenPrices([RUNEAsset, poolAsset]);
  const [state, reducerDispatch] = useReducer(reducer, initialState);

  const {
    isWalletAssetConnected,
    runeBalance,
    maxRuneBalance,
    poolAssetBalance,
    maxPoolAssetBalance,
  } = depositAssetsBalance;

  const getChainWallet = useCallback(
    (chain: Chain) => getWallet(chain) || wallet?.[chain],
    [getWallet, wallet],
  );

  const isLPActionPaused = useMemo(() => {
    return isChainPauseLPAction(poolAsset.chain) || getChainDepositLPPaused(poolAsset.chain);
  }, [isChainPauseLPAction, poolAsset.chain, getChainDepositLPPaused]);

  const { lpMemberData, isAssetPending, isRunePending } = useLPMemberData({
    assetString: poolAsset.toString(),
    liquidityType,
  });

  const isSymDeposit = useMemo(
    () => liquidityType === LiquidityTypeOption.SYMMETRICAL && !expertMode,
    [liquidityType, expertMode],
  );

  const [assetAmount, setAssetAmount] = useState(new SwapKitNumber({ value: 0, decimal: 8 }));
  const [runeAmount, setRuneAmount] = useState(new SwapKitNumber({ value: 0, decimal: 8 }));

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
      runeAmount: runeAmount.getValue('string'),
      assetAmount: assetAmount.getValue('string'),
      runeDepth: poolData?.runeDepth ?? '0',
      assetDepth: poolData?.assetDepth ?? '0',
      liquidityUnits: poolData?.liquidityUnits ?? '0',
      poolUnits: poolData?.units ?? '0',
    }),
    [
      assetAmount,
      poolData?.assetDepth,
      poolData?.liquidityUnits,
      poolData?.runeDepth,
      poolData?.units,
      runeAmount,
    ],
  );

  const runePriceInAsset =
    Number.parseInt(poolData?.assetDepth || '0') / Number.parseInt(poolData?.runeDepth || '0');
  const assetPriceInRune =
    Number.parseInt(poolData?.runeDepth || '0') / Number.parseInt(poolData?.assetDepth || '0');

  const addLiquiditySlip = useMemo(
    () => `${getLiquiditySlippage(liquidityParams).toFixed(2)}%`,
    [liquidityParams],
  );

  const poolShareEst = useMemo(
    () => parseToPercent(getEstimatedPoolShareAfterAdd(liquidityParams)),
    [liquidityParams],
  );

  const isWalletConnected = useMemo(() => {
    const poolChainConnected = !!getChainWallet(poolAsset.chain);
    const runeChainConnected = !!getChainWallet(RUNEAsset.chain);
    if (liquidityType === LiquidityTypeOption.ASSET) return poolChainConnected;
    if (liquidityType === LiquidityTypeOption.RUNE) return runeChainConnected;

    // symm
    return poolChainConnected && runeChainConnected;
  }, [getChainWallet, poolAsset.chain, liquidityType]);

  const getContractAddress = useCallback(async (chain: Chain) => {
    const inboundData = (await getInboundData()) || [];
    const { router, halted } = inboundData.find((item) => item.chain === chain) || {};

    if (halted && !router) {
      throw new Error('Trading & LP is temporarily halted, please try again later.');
    }

    reducerDispatch({ type: 'setContract', payload: router || '' });
  }, []);

  useEffect(() => {
    getContractAddress(poolAsset.chain);
  }, [getContractAddress, poolAsset.chain]);

  const { isApproved, isLoading } = useIsAssetApproved({
    assetValue: poolAsset.set(assetAmount.getValue('string')),
    contract: state.contract,
    force: true,
  });

  const poolString = useMemo(() => poolAsset.toString(), [poolAsset]);

  const poolAssetPriceInUSD = useMemo(() => {
    const price = tokenPricesData[poolString]?.price_usd || 0;
    const amount =
      (isAssetPending &&
        SwapKitNumber.fromBigInt(BigInt(lpMemberData?.assetPending || '0')).getValue('number')) ||
      assetAmount.getValue('number');

    return price * amount;
  }, [tokenPricesData, poolString, isAssetPending, lpMemberData?.assetPending, assetAmount]);

  const minRuneAmount = useMemo(() => getMinAmountByChain(Chain.THORChain as Chain), []);
  const minAssetAmount = useMemo(() => {
    if (isGasAsset(poolAsset)) {
      return getMinAmountByChain(poolAsset.chain);
    }

    return new SwapKitNumber({ value: 0, decimal: 8 });
  }, [poolAsset]);

  const { maxSymAssetAmount, maxSymRuneAmount } = useMemo(() => {
    if (!poolData) {
      return {
        maxSymAssetAmount: new SwapKitNumber({ value: 0, decimal: 8 }),
        maxSymRuneAmount: new SwapKitNumber({ value: 0, decimal: 8 }),
      };
    }

    if (isAssetPending && lpMemberData) {
      return getMaxSymAmounts({
        runeAmount: maxRuneBalance,
        assetAmount: SwapKitNumber.fromBigInt(BigInt(lpMemberData.assetPending), 8),
        runePriceInAsset,
        assetPriceInRune,
        minAssetAmount,
        minRuneAmount,
      });
    }

    if (maxPoolAssetBalance && isRunePending && lpMemberData) {
      return getMaxSymAmounts({
        runeAmount: SwapKitNumber.fromBigInt(BigInt(lpMemberData.runePending), 8),
        assetAmount: maxPoolAssetBalance,
        runePriceInAsset,
        assetPriceInRune,
        minAssetAmount,
        minRuneAmount,
      });
    }

    return getMaxSymAmounts({
      runeAmount: maxRuneBalance || SwapKitNumber.fromBigInt(BigInt(0), 8),
      assetAmount: maxPoolAssetBalance || SwapKitNumber.fromBigInt(BigInt(0), 8),
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
        setRuneAmount(new SwapKitNumber({ value: 0, decimal: 8 }));
      } else if (type === LiquidityTypeOption.RUNE) {
        setAssetAmount(new SwapKitNumber({ value: 0, decimal: 8 }));
      }

      setLiquidityType(type);
    },
    [setLiquidityType],
  );

  const handleChangeAssetAmount = useCallback(
    (amount: SwapKitNumber) => {
      if (!poolData) {
        setAssetAmount(amount);
        return;
      }

      const maxAmount = isSymDeposit ? maxSymAssetAmount : maxPoolAssetBalance;

      if (maxAmount && amount.gt(maxAmount) && !skipWalletCheck) {
        setAssetAmount(
          new SwapKitNumber({
            value: maxAmount.getValue('string'),
            decimal: 8,
          }),
        );

        if (isSymDeposit) {
          setRuneAmount(
            new SwapKitNumber({
              value: maxAmount.mul(assetPriceInRune).getValue('string'),
              decimal: 8,
            }),
          );
        }
      } else {
        setAssetAmount(amount);

        if (isSymDeposit) {
          setRuneAmount(
            new SwapKitNumber({
              value: amount.mul(assetPriceInRune).getValue('string'),
              decimal: 8,
            }),
          );
        }
      }
    },
    [
      poolData,
      isSymDeposit,
      maxSymAssetAmount,
      maxPoolAssetBalance,
      skipWalletCheck,
      assetPriceInRune,
    ],
  );

  const handleChangeRuneAmount = useCallback(
    (amount: SwapKitNumber) => {
      if (!poolData) {
        setRuneAmount(amount);
        return;
      }
      const maxAmount = isSymDeposit ? maxSymRuneAmount : maxRuneBalance;

      if (maxAmount && amount.gt(maxAmount) && !skipWalletCheck) {
        setRuneAmount(
          new SwapKitNumber({
            value: maxAmount.getValue('string'),
            decimal: 8,
          }),
        );

        if (isSymDeposit) {
          setAssetAmount(
            new SwapKitNumber({
              value: maxAmount.mul(runePriceInAsset).getValue('string'),
              decimal: 8,
            }),
          );
        }
      } else {
        setRuneAmount(amount);
        if (isSymDeposit) {
          setAssetAmount(amount.mul(runePriceInAsset));
        }
      }
    },
    [poolData, isSymDeposit, maxSymRuneAmount, maxRuneBalance, skipWalletCheck, runePriceInAsset],
  );

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false);
    if (onAddLiquidity && poolAsset && liquidityType !== LiquidityTypeOption.ASSET) {
      onAddLiquidity({
        poolAsset,
        runeAmount: RUNEAsset.set(runeAmount.getValue('string')),
      });

      return;
    }

    if (hasWallet && poolData) {
      const runeAssetAmount =
        liquidityType !== LiquidityTypeOption.ASSET
          ? RUNEAsset.set(runeAmount.getValue('string'))
          : undefined;
      const poolAssetAmount =
        liquidityType !== LiquidityTypeOption.RUNE
          ? poolAsset.set(assetAmount.getValue('string'))
          : undefined;

      const runeId = v4();
      const assetId = v4();

      if (!isRunePending && runeAssetAmount) {
        appDispatch(
          addTransaction({
            id: runeId,
            label: t('txManager.addAmountAsset', {
              asset: RUNEAsset.ticker,
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
              asset: poolAsset.ticker,
              amount: assetAmount.toSignificant(6),
            }),
            type: TransactionType.TC_LP_ADD,
            inChain: poolAsset.chain,
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
        runeAssetValue: RUNEAsset.set(runeAmount.getValue('string')),
        assetValue: poolAsset.set(assetAmount.getValue('string')),
        isPendingSymmAsset,
        mode,
        poolIdentifier: '',
        ...addresses,
      };

      const { thorchain } = await (await import('services/swapKit')).getSwapKitClient();
      if (!thorchain) throw new Error('SwapKit client not found');
      try {
        const { runeTx, assetTx } = await thorchain.addLiquidity(params);

        if (runeTx !== 'failed' && typeof runeTx === 'string') {
          appDispatch(updateTransaction({ id: runeId, txid: runeTx }));
        } else {
          appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        }

        if (assetTx !== 'failed' && typeof assetTx === 'string') {
          appDispatch(updateTransaction({ id: assetId, txid: assetTx }));
        } else {
          appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        }
      } catch (error: NotWorth) {
        const message = error?.data?.originalError || error.message;
        appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        showErrorToast(t('notification.submitFail'), message, undefined, error as Error);
      }
    }
  }, [
    onAddLiquidity,
    poolAsset,
    liquidityType,
    hasWallet,
    poolData,
    runeAmount,
    assetAmount,
    isRunePending,
    isAssetPending,
    lpMemberData?.runeAddress,
    lpMemberData?.assetAddress,
    appDispatch,
  ]);

  const handleConfirmProgressModal = useCallback(async () => {
    setVisibleConfirmModal(false);

    if (hasWallet && poolData) {
      const runeAssetValue =
        liquidityType !== LiquidityTypeOption.ASSET && !isRunePending
          ? RUNEAsset.set(runeAmount.getValue('string'))
          : undefined;
      const poolAssetValue =
        liquidityType !== LiquidityTypeOption.RUNE && !isAssetPending
          ? poolAsset.set(assetAmount.getValue('string'))
          : undefined;

      const { getAddress } = await (await import('services/swapKit')).getSwapKitClient();

      reducerDispatch({
        type: 'setLPProgressState',
        payload: {
          runeAssetValue,
          poolAssetValue,
          symmetric: liquidityType === LiquidityTypeOption.SYMMETRICAL,
          poolAddress: poolAsset.toString(),
          runeAddress: getAddress(Chain.THORChain),
          assetAddress: getAddress(poolAsset.chain),
        },
      });
    }
  }, [
    hasWallet,
    poolData,
    liquidityType,
    isAssetPending,
    runeAmount,
    isRunePending,
    poolAsset,
    assetAmount,
  ]);

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
          type,
          label: `${t('txManager.approve')} ${poolAsset.ticker}`,
          inChain: poolAsset.chain,
        }),
      );

      const { thorchain } = await (await import('services/swapKit')).getSwapKitClient();
      if (!thorchain) throw new Error('SwapKit client not found');

      try {
        const txid = await thorchain.approveAssetValue({
          assetValue: poolAsset,
        });

        if (typeof txid === 'string') {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error: NotWorth) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: 'error' }));

        showErrorToast(t('notification.approveFailed'), undefined, undefined, error as Error);
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
    if (hasWallet) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [hasWallet]);

  const depositAssets = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [RUNEAsset];
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [poolAsset];
    }

    return [poolAsset, RUNEAsset];
  }, [liquidityType, poolAsset]);

  const depositAssetInputs = useMemo(() => {
    if (isAssetPending || liquidityType === LiquidityTypeOption.RUNE) {
      return [{ asset: RUNEAsset, value: runeAmount.toSignificant(6) }];
    }

    if (isRunePending || liquidityType === LiquidityTypeOption.ASSET) {
      return [{ asset: poolAsset, value: assetAmount.toSignificant(6) }];
    }

    return [
      { asset: RUNEAsset, value: runeAmount.toSignificant(6) },
      { asset: poolAsset, value: assetAmount.toSignificant(6) },
    ];
  }, [isAssetPending, liquidityType, isRunePending, runeAmount, poolAsset, assetAmount]);

  const isValidDeposit = useMemo(() => {
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

      if (
        lpMemberData &&
        !!(Number(lpMemberData.assetPending) || Number(lpMemberData.runePending))
      ) {
        // if runeAsym or assetAsym already exist, cannot deposit symmetrically
        if (Number(lpMemberData.runeAdded) && !Number(lpMemberData.assetAdded)) {
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

  const isApproveRequired = useMemo(
    () =>
      !!getChainWallet(poolAsset.chain) &&
      isApproved === false &&
      liquidityType !== LiquidityTypeOption.RUNE,
    [getChainWallet, isApproved, liquidityType, poolAsset.chain],
  );

  const poolAssetInput = useMemo(
    () => ({
      asset: poolAsset,
      balance: poolAssetBalance,
      usdPrice: poolAssetPriceInUSD,
      value:
        isAssetPending && lpMemberData
          ? SwapKitNumber.fromBigInt(BigInt(lpMemberData.assetPending), poolAsset.decimal)
          : assetAmount,
    }),
    [poolAsset, poolAssetBalance, poolAssetPriceInUSD, isAssetPending, lpMemberData, assetAmount],
  );

  const runeAssetInput = useMemo(() => {
    const value =
      isRunePending && lpMemberData
        ? SwapKitNumber.fromBigInt(BigInt(lpMemberData.runePending), 8)
        : runeAmount;
    // This might not be correct
    const runePrice = tokenPricesData[RUNEAsset.toString()]?.price_usd || 0;

    return {
      asset: RUNEAsset,
      balance: runeBalance,
      usdPrice: runePrice * value.getValue('number'),
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
      // TODO make sure this works
      { chain: poolAsset.chain, fee: inboundAssetFee.toSignificant() },
      { chain: Chain.THORChain, fee: inboundRuneFee.toSignificant() },
    ],
  });

  const approveConfirmInfo = useApproveInfoItems({
    assetName: poolAsset.ticker,
    assetValue: assetAmount.toSignificant(6),
    // TODO make sure this works
    fee: inboundAssetFee.toSignificant(),
  });

  const isDepositAvailable = useMemo(
    () => isWalletConnected && !isApproveRequired,
    [isWalletConnected, isApproveRequired],
  );

  const rate = useMemo(() => {
    const runePrice = tokenPricesData[RUNEAsset.toString()]?.price_usd || 0;
    const assetPrice = tokenPricesData[poolString]?.price_usd || 0.001;
    const priceRate = runePrice / assetPrice;

    return Number.isNaN(priceRate) ? 0 : priceRate;
  }, [poolString, tokenPricesData]);

  const setLpProgressModal = useCallback(
    (value: boolean) => reducerDispatch({ type: 'setLpProgressModal', payload: value }),
    [reducerDispatch],
  );

  return {
    ...state,
    addLiquiditySlip,
    approveConfirmInfo,
    asymmTipVisible,
    btnLabel,
    confirmInfo,
    depositAssets,
    feeInUSD,
    getEstimatedPoolShareForPoolDepth,
    handleAddLiquidity,
    handleApprove,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    handleConfirmAdd,
    handleConfirmProgressModal,
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
    setLpProgressModal,
    setVisibleApproveModal,
    setVisibleConfirmModal,
    title,
    visibleApproveModal,
    visibleConfirmModal,
  };
};
