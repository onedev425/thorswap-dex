import {
  AddLiquidityParams,
  Amount,
  AssetAmount,
  AssetEntity,
  getMinAmountByChain,
  getSignatureAssetFor,
  isGasAsset,
  Liquidity,
  Percent,
  Pool,
  Price,
  Wallet,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import BigNumber from 'bignumber.js';
import { LiquidityTypeOption } from 'components/LiquidityType/types';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { RUNEAsset, USDAsset } from 'helpers/assets';
import { getEstimatedTxTime } from 'helpers/getEstimatedTxTime';
import { hasWalletConnected } from 'helpers/wallet';
import { useMimir } from 'hooks/useMimir';
import { getSumAmountInUSD, useNetworkFee } from 'hooks/useNetworkFee';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useRunePrice } from 'hooks/useRuneToCurrency';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { midgardApi } from 'services/midgard';
import { useApp } from 'store/app/hooks';
import { isPendingLP } from 'store/midgard/utils';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { useAddLiquidityUtils } from 'views/AddLiquidity/hooks/useAddLiquidityUtils';
import { useChainMember } from 'views/AddLiquidity/hooks/useChainMember';
import { DepositAssetsBalance } from 'views/AddLiquidity/hooks/useDepositAssetsBalance';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { getMaxSymAmounts } from '../utils';

import { useConfirmInfoItems } from './useConfirmInfoItems';

type Props = {
  onAddLiquidity?: (params: AddLiquidityParams) => void;
  skipWalletCheck?: boolean;
  liquidityType: LiquidityTypeOption;
  setLiquidityType: (option: LiquidityTypeOption) => void;
  pools: Pool[];
  pool?: Pool;
  poolAsset: AssetEntity;
  poolAssets: AssetEntity[];
  depositAssetsBalance: DepositAssetsBalance;
  wallet: Wallet | null;
};

const runeAsset = getSignatureAssetFor(Chain.THORChain);

export const useAddLiquidity = ({
  onAddLiquidity,
  skipWalletCheck,
  liquidityType,
  setLiquidityType,
  pools,
  pool,
  poolAsset,
  depositAssetsBalance,
  wallet,
}: Props) => {
  const appDispatch = useAppDispatch();
  const { expertMode } = useApp();
  const [contract, setContract] = useState<string | undefined>();

  const {
    isWalletAssetConnected,
    runeBalance,
    maxRuneBalance,
    poolAssetBalance,
    maxPoolAssetBalance,
  } = depositAssetsBalance;
  const { setIsConnectModalOpen } = useWallet();
  const { isFundsCapReached } = useMimir();
  const { isLPActionPaused } = useAddLiquidityUtils({ poolAsset });
  const { memberData, currentAssetHaveLP, poolMemberDetail, isRunePending, isAssetPending } =
    useChainMember({
      poolAsset,
      pools,
      pool,
      liquidityType,
    });

  const runePrice = useRunePrice(pools[0]);
  const isSymDeposit = useMemo(
    () => liquidityType === LiquidityTypeOption.SYMMETRICAL && !expertMode,
    [liquidityType, expertMode],
  );

  const [assetAmount, setAssetAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));
  const [runeAmount, setRuneAmount] = useState<Amount>(Amount.fromAssetAmount(0, 8));

  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [asymmTipVisible, setAsymmTipVisible] = useState(true);
  const [existingLPTipVisible, setExistingLPTipVisible] = useState(true);

  const { inboundFee: inboundAssetFee, outboundFee: inboundRuneFee } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: runeAsset,
  });

  const liquidityUnits = useMemo(() => {
    if (!poolMemberDetail) return Amount.fromMidgard(0);

    return Amount.fromMidgard(poolMemberDetail.liquidityUnits);
  }, [poolMemberDetail]);

  const liquidityEntity = useMemo(() => {
    if (!pool) return null;
    return new Liquidity(pool, liquidityUnits);
  }, [pool, liquidityUnits]);

  const addLiquiditySlip = useMemo(() => {
    if (!liquidityEntity) return null;
    return (liquidityEntity.getLiquiditySlip(runeAmount, assetAmount) as Percent).toFixed(2);
  }, [liquidityEntity, assetAmount, runeAmount]);

  const poolShareEst = useMemo(() => {
    if (!liquidityEntity) return null;
    return liquidityEntity.getPoolShareEst(runeAmount, assetAmount).toSignificant(6, 5);
  }, [liquidityEntity, assetAmount, runeAmount]);

  const isWalletConnected = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.ASSET) {
      return hasWalletConnected({ wallet, inputAssets: [poolAsset] });
    }
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return hasWalletConnected({ wallet, inputAssets: [runeAsset] });
    }

    // symm
    return (
      hasWalletConnected({ wallet, inputAssets: [poolAsset] }) &&
      hasWalletConnected({ wallet, inputAssets: [runeAsset] })
    );
  }, [wallet, poolAsset, liquidityType]);

  const getContractAddress = useCallback(async (chain: Chain) => {
    const inboundData = (await midgardApi.getInboundAddresses()) || [];
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
  });

  const poolAssetPriceInUSD = usePoolAssetPriceInUsd({
    asset: poolAsset,
    amount:
      isAssetPending && poolMemberDetail
        ? Amount.fromMidgard(poolMemberDetail.assetPending)
        : assetAmount,
  });

  const { maxSymAssetAmount, maxSymRuneAmount } = useMemo(() => {
    if (!pool) {
      return {
        maxSymAssetAmount: Amount.fromAssetAmount(0, 8),
        maxSymRuneAmount: Amount.fromAssetAmount(0, 8),
      };
    }

    if (isAssetPending && poolMemberDetail) {
      return getMaxSymAmounts({
        runeAmount: maxRuneBalance,
        assetAmount: Amount.fromMidgard(poolMemberDetail?.assetPending),
        pool,
      });
    }

    if (isRunePending && poolMemberDetail) {
      return getMaxSymAmounts({
        runeAmount: Amount.fromMidgard(poolMemberDetail?.runePending),
        assetAmount: maxPoolAssetBalance,
        pool,
      });
    }

    return getMaxSymAmounts({
      runeAmount: maxRuneBalance,
      assetAmount: maxPoolAssetBalance,
      pool,
    });
  }, [pool, maxRuneBalance, maxPoolAssetBalance, isAssetPending, poolMemberDetail, isRunePending]);

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
      if (!pool) {
        setAssetAmount(amount);
        return;
      }

      const maxAmount = isSymDeposit ? maxSymAssetAmount : maxPoolAssetBalance;

      if (amount.gt(maxAmount) && !skipWalletCheck) {
        setAssetAmount(maxAmount);

        if (isSymDeposit) {
          setRuneAmount(maxAmount.mul(pool.assetPriceInRune));
        }
      } else {
        setAssetAmount(amount);

        if (isSymDeposit) {
          setRuneAmount(amount.mul(pool.assetPriceInRune));
        }
      }
    },
    [pool, skipWalletCheck, isSymDeposit, maxSymAssetAmount, maxPoolAssetBalance],
  );

  const handleChangeRuneAmount = useCallback(
    (amount: Amount) => {
      if (!pool) {
        setRuneAmount(amount);
        return;
      }

      const maxAmount = isSymDeposit ? maxSymRuneAmount : maxRuneBalance;
      if (amount.gt(maxAmount) && !skipWalletCheck) {
        setRuneAmount(maxAmount);

        if (isSymDeposit) {
          setAssetAmount(maxAmount.mul(pool.runePriceInAsset));
        }
      } else {
        setRuneAmount(amount);
        if (isSymDeposit) {
          setAssetAmount(amount.mul(pool.runePriceInAsset));
        }
      }
    },
    [pool, skipWalletCheck, isSymDeposit, maxSymRuneAmount, maxRuneBalance],
  );

  const handleConfirmAdd = useCallback(async () => {
    setVisibleConfirmModal(false);
    if (onAddLiquidity && pool) {
      const runeAssetAmount =
        liquidityType !== LiquidityTypeOption.ASSET
          ? new AssetAmount(runeAsset, runeAmount)
          : undefined;
      const poolAssetAmount =
        liquidityType !== LiquidityTypeOption.RUNE
          ? new AssetAmount(poolAsset, assetAmount)
          : undefined;

      onAddLiquidity({
        pool,
        runeAmount: runeAssetAmount,
        assetAmount: poolAssetAmount,
        runeAddr: poolMemberDetail?.runeAddress,
        assetAddr: poolMemberDetail?.assetAddress,
      });

      return;
    }

    if (wallet && pool) {
      const runeAssetAmount =
        liquidityType !== LiquidityTypeOption.ASSET
          ? new AssetAmount(runeAsset, runeAmount)
          : undefined;
      const poolAssetAmount =
        liquidityType !== LiquidityTypeOption.RUNE
          ? new AssetAmount(poolAsset, assetAmount)
          : undefined;

      const runeId = v4();
      const assetId = v4();

      if (!isRunePending && runeAssetAmount) {
        appDispatch(
          addTransaction({
            id: runeId,
            label: t('txManager.addAmountAsset', {
              asset: runeAsset.name,
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

      const addresses =
        isRunePending || isAssetPending || liquidityType === LiquidityTypeOption.SYMMETRICAL
          ? {
              runeAddr: poolMemberDetail?.runeAddress,
              assetAddr: poolMemberDetail?.assetAddress,
            }
          : {};

      const params = {
        pool,
        runeAmount: isRunePending ? undefined : runeAssetAmount,
        assetAmount: isAssetPending ? undefined : poolAssetAmount,
        isPendingSymmAsset: isAssetPending && liquidityType === LiquidityTypeOption.SYMMETRICAL,
        ...addresses,
      };

      const { addLiquidity } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const { runeTx, assetTx } = await addLiquidity(params);

        runeTx && appDispatch(updateTransaction({ id: runeId, txid: runeTx }));
        assetTx && appDispatch(updateTransaction({ id: assetId, txid: assetTx }));
      } catch (error: NotWorth) {
        const message = error?.data?.originalError || error.message;
        appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        showErrorToast(t('notification.submitFail'), message);
      }
    }
  }, [
    appDispatch,
    onAddLiquidity,
    pool,
    wallet,
    liquidityType,
    runeAmount,
    poolAsset,
    assetAmount,
    isRunePending,
    isAssetPending,
    poolMemberDetail?.runeAddress,
    poolMemberDetail?.assetAddress,
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

    if (isFundsCapReached && !skipWalletCheck) {
      return showInfoToast(
        t('notification.fundsCapReached'),
        t('notification.fundsCapReachedDesc'),
      );
    }

    setVisibleConfirmModal(true);
  }, [isWalletConnected, skipWalletCheck, isFundsCapReached]);

  const handleApprove = useCallback(() => {
    if (wallet) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [wallet]);

  const totalFeeInUSD = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      const totalFee = getSumAmountInUSD(inboundRuneFee, inboundAssetFee, pools);

      return `$${totalFee}`;
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return inboundAssetFee.totalPriceIn(USDAsset, pools).toCurrencyFormat(2);
    }

    // Rune asym
    return inboundRuneFee.totalPriceIn(USDAsset, pools).toCurrencyFormat(2);
  }, [liquidityType, inboundRuneFee, inboundAssetFee, pools]);

  const depositAssets: AssetEntity[] = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [runeAsset];
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [poolAsset];
    }

    return [poolAsset, runeAsset];
  }, [liquidityType, poolAsset]);

  const depositAssetInputs = useMemo(() => {
    if (liquidityType === LiquidityTypeOption.RUNE) {
      return [
        {
          asset: runeAsset,
          value: runeAmount.toSignificant(6),
        },
      ];
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      return [
        {
          asset: poolAsset,
          value: assetAmount.toSignificant(6),
        },
      ];
    }

    return [
      {
        asset: runeAsset,
        value: runeAmount.toSignificant(6),
      },
      {
        asset: poolAsset,
        value: assetAmount.toSignificant(6),
      },
    ];
  }, [liquidityType, poolAsset, assetAmount, runeAmount]);

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
    // only invalid scenario is
    // 1. rune asym
    // 2. rune-asset sym

    if (liquidityType === LiquidityTypeOption.SYMMETRICAL) {
      if (!runeAmount.gt(minRuneAmount) || !assetAmount.gt(minAssetAmount)) {
        return {
          valid: false,
          msg: t('notification.invalidAmount'),
        };
      }

      if (poolMemberDetail && !isPendingLP(poolMemberDetail)) {
        // if runeAsym or assetAsym already exist, cannot deposit symmetrically
        if (memberData?.runeAsym) {
          return {
            valid: false,
            msg: t('notification.alreadyHaveRune'),
          };
        }
      }
    }

    if (liquidityType === LiquidityTypeOption.ASSET) {
      if (!assetAmount.gt(minAssetAmount)) {
        return {
          valid: false,
          msg: t('notification.insufficientAmount'),
        };
      }
    }

    if (liquidityType === LiquidityTypeOption.RUNE) {
      if (!runeAmount.gt(minRuneAmount)) {
        return {
          valid: false,
          msg: t('notification.insufficientAmount'),
        };
      }
    }

    return { valid: true };
  }, [
    poolMemberDetail,
    isLPActionPaused,
    liquidityType,
    runeAmount,
    assetAmount,
    minRuneAmount,
    minAssetAmount,
    memberData,
  ]);

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
      balance: poolAssetBalance,
      usdPrice: poolAssetPriceInUSD,
      value:
        isAssetPending && poolMemberDetail
          ? Amount.fromMidgard(poolMemberDetail.assetPending)
          : assetAmount,
    }),
    [
      poolAsset,
      assetAmount,
      poolAssetBalance,
      poolAssetPriceInUSD,
      isAssetPending,
      poolMemberDetail,
    ],
  );

  const runeAssetInput = useMemo(() => {
    const value =
      isRunePending && poolMemberDetail
        ? Amount.fromMidgard(poolMemberDetail.runePending)
        : runeAmount;

    return {
      asset: runeAsset,
      balance: runeBalance,
      usdPrice: new Price({
        baseAsset: RUNEAsset,
        unitPrice: new BigNumber(runePrice || 0),
        priceAmount: value,
      }),
      value,
    };
  }, [isRunePending, poolMemberDetail, runeAmount, runeBalance, runePrice]);

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

  return {
    title,
    handleSelectLiquidityType,
    poolAssetInput,
    runeAssetInput,
    handleChangeAssetAmount,
    handleChangeRuneAmount,
    isAssetPending,
    isRunePending,
    totalFeeInUSD,
    addLiquiditySlip,
    poolShareEst,
    poolMemberDetail,
    asymmTipVisible,
    setAsymmTipVisible,
    currentAssetHaveLP,
    existingLPTipVisible,
    setExistingLPTipVisible,
    isApproveRequired,
    handleApprove,
    isAssetApproveLoading: isLoading,
    isDepositAvailable,
    isValidDeposit,
    handleAddLiquidity,
    btnLabel,
    isWalletConnected,
    setIsConnectModalOpen,
    depositAssets,
    visibleConfirmModal,
    handleConfirmAdd,
    setVisibleConfirmModal,
    confirmInfo,
    visibleApproveModal,
    setVisibleApproveModal,
    handleConfirmApprove,
    approveConfirmInfo,
  };
};
