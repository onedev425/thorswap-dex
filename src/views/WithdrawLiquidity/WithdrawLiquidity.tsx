import { Flex, Text } from '@chakra-ui/react';
import {
  Amount,
  AmountType,
  AssetEntity,
  getAsymmetricAssetWithdrawAmount,
  getAsymmetricRuneWithdrawAmount,
  getSignatureAssetFor,
  getSymmetricWithdraw,
  Pool,
  Price,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { LiquidityType } from 'components/LiquidityType/LiquidityType';
import { LPTypeSelector } from 'components/LPTypeSelector';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelView } from 'components/PanelView';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { isETHAsset, poolByAsset, USDAsset } from 'helpers/assets';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { hasWalletConnected } from 'helpers/wallet';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getThorYieldLPInfoBaseRoute } from 'settings/router';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { useMidgard } from 'store/midgard/hooks';
import { LiquidityTypeOption, PoolMemberData, PoolShareType } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { AssetInputs } from 'views/WithdrawLiquidity/AssetInputs';

import { useConfirmInfoItems } from './useConfirmInfoItems';

export const WithdrawLiquidity = () => {
  const { assetParam = getSignatureAssetFor(Chain.Bitcoin).toString() } = useParams<{
    assetParam: string;
  }>();
  const [assetObj, setAssetObj] = useState<AssetEntity>();
  const [pool, setPool] = useState<Pool>();

  const { pools, poolLoading, loadMemberDetailsByChain, chainMemberDetails } = useMidgard();

  useEffect(() => {
    if (!pool) return;
    loadMemberDetailsByChain(pool.asset.chain as Chain);
  }, [loadMemberDetailsByChain, pool]);

  const poolMemberData: PoolMemberData | null = useMemo(() => {
    if (!pool) return null;
    return chainMemberDetails?.[pool.asset.chain]?.[pool.asset.toString()] ?? null;
  }, [chainMemberDetails, pool]);

  useEffect(() => {
    if (!poolLoading && pools.length && assetObj) {
      const assetPool = poolByAsset(assetObj, pools);

      if (assetPool) setPool(assetPool);
    }
  }, [pools, poolLoading, assetObj]);

  useEffect(() => {
    const getAssetEntity = async () => {
      if (!assetParam) {
        return;
      }
      const assetEntity = AssetEntity.decodeFromURL(assetParam);

      if (assetEntity) {
        if (assetEntity.isRUNE()) return;
        const assetDecimals = await getEVMDecimal(assetEntity);
        await assetEntity.setDecimal(assetDecimals);

        setAssetObj(assetEntity);
      }
    };

    getAssetEntity();
  }, [assetParam]);

  const shares = useMemo(
    () =>
      [
        poolMemberData?.pending && PoolShareType.PENDING,
        poolMemberData?.sym && PoolShareType.SYM,
        poolMemberData?.runeAsym && PoolShareType.RUNE_ASYM,
        poolMemberData?.assetAsym && PoolShareType.ASSET_ASYM,
      ].filter(Boolean) as PoolShareType[],
    [
      poolMemberData?.assetAsym,
      poolMemberData?.pending,
      poolMemberData?.runeAsym,
      poolMemberData?.sym,
    ],
  );

  if (pool && pools.length && shares.length > 0) {
    return (
      <WithdrawPanel
        pool={pool}
        poolMemberData={poolMemberData}
        pools={pools}
        shareTypes={shares}
      />
    );
  }

  return (
    <PanelView
      header={
        <ViewHeader
          withBack
          actionsComponent={<GlobalSettingsPopover />}
          title={t('views.liquidity.withdrawLiquidity')}
        />
      }
      title={t('views.liquidity.withdrawLiquidity')}
    >
      <Text>{t('views.liquidity.noLiquidityToWithdraw')}</Text>
    </PanelView>
  );
};

const WithdrawPanel = ({
  poolMemberData,
  pool,
  pools,
  shareTypes,
}: {
  poolMemberData: PoolMemberData | null;
  shareTypes: PoolShareType[];
  pool: Pool;
  pools: Pool[];
}) => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { isChainPauseLPAction } = useMimir();
  const { getChainWithdrawLPPaused } = useExternalConfig();

  const poolAsset = useMemo(() => pool.asset, [pool]);
  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) || getChainWithdrawLPPaused(poolAsset.chain as Chain)
    );
  }, [isChainPauseLPAction, poolAsset.chain, getChainWithdrawLPPaused]);

  const [lpType, setLPType] = useState(shareTypes[0]);

  const defaultWithdrawType = useMemo(() => {
    switch (lpType) {
      case PoolShareType.RUNE_ASYM:
        return LiquidityTypeOption.RUNE;
      case PoolShareType.ASSET_ASYM:
        return LiquidityTypeOption.ASSET;
      default:
        return LiquidityTypeOption.SYMMETRICAL;
    }
  }, [lpType]);

  const [withdrawType, setWithdrawType] = useState(defaultWithdrawType);
  const [percent, setPercent] = useState(0);
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);

  const isWalletConnected = useMemo(() => {
    const inputAsset =
      lpType === PoolShareType.ASSET_ASYM ? poolAsset : getSignatureAssetFor(Chain.THORChain);

    return hasWalletConnected({ wallet, inputAssets: [inputAsset] });
  }, [lpType, poolAsset, wallet]);

  const { inputFee: inboundAssetFee, outputFee: inboundRuneFee } = useNetworkFee({
    inputAsset: poolAsset,
    outputAsset: getSignatureAssetFor(Chain.THORChain),
  });

  const feeLabel = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.ASSET) {
      return `${inboundAssetFee.toCurrencyFormat()} (${inboundAssetFee
        .totalPriceIn(USDAsset, pools)
        .toCurrencyFormat(2)})`;
    }

    return `${inboundRuneFee.toCurrencyFormat()} (${inboundRuneFee
      .totalPriceIn(USDAsset, pools)
      .toCurrencyFormat(2)})`;
  }, [inboundAssetFee, inboundRuneFee, pools, withdrawType]);

  const memberPoolData = useMemo(() => {
    if (lpType === PoolShareType.PENDING) return poolMemberData?.pending;
    if (lpType === PoolShareType.RUNE_ASYM) return poolMemberData?.runeAsym;
    if (lpType === PoolShareType.ASSET_ASYM) return poolMemberData?.assetAsym;
    if (lpType === PoolShareType.SYM) return poolMemberData?.sym;

    return null;
  }, [poolMemberData, lpType]);

  const { runeAmount, assetAmount } = useMemo(() => {
    if (lpType === PoolShareType.PENDING) {
      return {
        runeAmount: Amount.fromMidgard(memberPoolData?.runePending).mul(percent / 100),
        assetAmount: Amount.fromMidgard(memberPoolData?.assetPending).mul(percent / 100),
      };
    }

    const params = {
      percent,
      liquidityUnits: pool.detail.liquidityUnits,
      poolUnits: pool.detail.units,
      assetDepth: pool.detail.assetDepth,
      runeDepth: pool.detail.runeDepth,
    };

    return withdrawType === LiquidityTypeOption.SYMMETRICAL
      ? getSymmetricWithdraw(params)
      : {
          runeAmount:
            withdrawType === LiquidityTypeOption.RUNE
              ? getAsymmetricRuneWithdrawAmount(params)
              : Amount.fromMidgard(0),
          assetAmount:
            withdrawType === LiquidityTypeOption.ASSET
              ? getAsymmetricAssetWithdrawAmount(params)
              : Amount.fromMidgard(0),
        };
  }, [
    lpType,
    percent,
    pool.detail.liquidityUnits,
    pool.detail.units,
    pool.detail.assetDepth,
    pool.detail.runeDepth,
    withdrawType,
    memberPoolData?.runePending,
    memberPoolData?.assetPending,
  ]);

  const runePriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: getSignatureAssetFor(Chain.THORChain),
        pools,
        priceAmount: runeAmount,
      }),
    [runeAmount, pools],
  );

  const assetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: pool.asset,
        pools,
        priceAmount: assetAmount,
      }),
    [pool, assetAmount, pools],
  );

  const handleSetLPType = useCallback((type: PoolShareType) => {
    setLPType(type);
    if (type === PoolShareType.RUNE_ASYM) {
      setWithdrawType(LiquidityTypeOption.RUNE);
    } else if (type === PoolShareType.ASSET_ASYM) {
      setWithdrawType(LiquidityTypeOption.ASSET);
    } else {
      setWithdrawType(LiquidityTypeOption.SYMMETRICAL);
    }
  }, []);

  const handleChangePercent = useCallback((p: Amount) => {
    setPercent(Number(p.toFixed(2)));
  }, []);

  const withdrawFrom = useMemo(() => {
    switch (lpType) {
      case PoolShareType.PENDING:
      case PoolShareType.SYM:
        return 'sym';
      case PoolShareType.RUNE_ASYM:
        return 'rune';
      case PoolShareType.ASSET_ASYM:
        return 'asset';
    }
  }, [lpType]);

  const withdrawTo = useMemo(() => {
    if ([PoolShareType.ASSET_ASYM, PoolShareType.RUNE_ASYM].includes(lpType)) {
      return withdrawFrom;
    }

    switch (withdrawType) {
      case LiquidityTypeOption.SYMMETRICAL:
        return 'sym';
      case LiquidityTypeOption.RUNE:
        return 'rune';
      case LiquidityTypeOption.ASSET:
        return 'asset';
    }
  }, [lpType, withdrawFrom, withdrawType]);

  const handleConfirmWithdraw = useCallback(async () => {
    setVisibleConfirmModal(false);

    if (!wallet) return;

    const runeObject = {
      asset: getSignatureAssetFor(Chain.THORChain).name,
      amount: runeAmount.toSignificant(6),
    };
    const assetObject = {
      asset: pool.asset.name,
      amount: assetAmount.toSignificant(6),
    };
    const withdrawChain = withdrawTo === 'asset' ? pool.asset.chain : Chain.THORChain;
    const outAssets =
      withdrawTo === 'sym'
        ? [runeObject, assetObject]
        : withdrawTo === 'rune'
        ? [runeObject]
        : [assetObject];

    const label = outAssets.map(({ asset, amount }) => `${amount} ${asset}`).join(' & ');

    const id = v4();
    appDispatch(
      addTransaction({ id, type: TransactionType.TC_LP_WITHDRAW, inChain: withdrawChain, label }),
    );
    const { withdraw } = await (await import('services/swapKit')).getSwapKitClient();

    try {
      const txid = await withdraw({
        asset: pool.asset,
        percent: new Amount(percent, AmountType.ASSET_AMOUNT, 2),
        from: withdrawFrom,
        to: withdrawTo,
      });

      appDispatch(updateTransaction({ id, txid }));
    } catch (error: NotWorth) {
      console.error(error);
      const message = error?.data?.originMessage || error;
      appDispatch(completeTransaction({ id, status: 'error' }));
      showErrorToast(t('notification.submitFail'), message);
    }
  }, [appDispatch, assetAmount, wallet, pool, percent, runeAmount, withdrawFrom, withdrawTo]);

  const handleWithdrawLiquidity = useCallback(() => {
    if (isETHAsset(pool.asset) && pool.detail.status === 'staged') {
      return showInfoToast(
        'notification.cannotWithdrawFromSP',
        t('notification.cannotWithdrawFromSPDesc'),
      );
    }

    if (wallet) {
      setVisibleConfirmModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [wallet, pool]);

  const title = useMemo(
    () => `${t('common.withdraw')} ${poolAsset.ticker} ${t('common.liquidity')}`,
    [poolAsset],
  );

  const withdrawOptions = useMemo(() => {
    // allow only sym withdraw for staged pools
    const isStaged = pool.detail.status === 'staged';
    const isPendingLP = lpType === PoolShareType.PENDING;

    if (isStaged || isPendingLP) {
      return [LiquidityTypeOption.SYMMETRICAL];
    }

    if (lpType === PoolShareType.RUNE_ASYM) return [LiquidityTypeOption.RUNE];
    if (lpType === PoolShareType.ASSET_ASYM) return [LiquidityTypeOption.ASSET];

    return [LiquidityTypeOption.ASSET, LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE];
  }, [lpType, pool.detail.status]);

  const withdrawAssets = useMemo(() => {
    if (withdrawType === LiquidityTypeOption.RUNE) {
      return [
        {
          asset: getSignatureAssetFor(Chain.THORChain),
          value: `${runeAmount.toSignificant(6)} RUNE (${runePriceInUSD.toCurrencyFormat(2)})`,
        },
      ];
    }

    if (withdrawType === LiquidityTypeOption.ASSET) {
      return [
        {
          asset: poolAsset,
          value: `${assetAmount.toSignificant(6)} ${
            poolAsset.ticker
          } (${assetPriceInUSD.toCurrencyFormat(2)})`,
        },
      ];
    }

    return [
      {
        asset: getSignatureAssetFor(Chain.THORChain),
        value: `${runeAmount.toSignificant(6)} RUNE (${runePriceInUSD.toCurrencyFormat(2)})`,
      },
      {
        asset: poolAsset,
        value: `${assetAmount.toSignificant(6)} ${
          poolAsset.ticker
        } (${assetPriceInUSD.toCurrencyFormat(2)})`,
      },
    ];
  }, [withdrawType, runeAmount, runePriceInUSD, poolAsset, assetAmount, assetPriceInUSD]);

  const lpLink: string = useMemo((): string => {
    if (!wallet) return '';
    const lpRoute = getThorYieldLPInfoBaseRoute();
    let queryParams = '';
    if (lpType === PoolShareType.ASSET_ASYM) {
      queryParams = `${poolAsset.chain.toLowerCase()}=${wallet[poolAsset.chain]?.address}`;
    } else if (lpType === PoolShareType.RUNE_ASYM) {
      queryParams = `${Chain.THORChain.toLowerCase()}=${wallet[Chain.THORChain]?.address}`;
    } else if (lpType === PoolShareType.SYM) {
      queryParams = `${Chain.THORChain.toLowerCase()}=${
        wallet[Chain.THORChain]?.address
      }&${poolAsset.chain.toLowerCase()}=${wallet[poolAsset.chain]?.address}`;
    }
    return `${lpRoute}?${queryParams}`;
  }, [lpType, poolAsset, wallet]);

  const hasPending = useMemo(
    () => shareTypes.some((type) => type === PoolShareType.PENDING),
    [shareTypes],
  );

  const warningWithPendingWithdraw = useMemo(() => {
    const hasLiquidityDeposit = shareTypes.some((type) =>
      [PoolShareType.SYM, PoolShareType.ASSET_ASYM, PoolShareType.RUNE_ASYM].includes(type),
    );

    return hasPending && hasLiquidityDeposit;
  }, [hasPending, shareTypes]);

  const confirmInfo = useConfirmInfoItems({
    assets: withdrawAssets,
    fee: feeLabel,
    ILP: (
      <Link external to={lpLink}>
        <Button
          className="px-2.5"
          leftIcon={<Icon name="chart" size={16} />}
          variant="borderlessTint"
        >
          {t('common.viewOnThoryieldNoArrow')}
        </Button>
      </Link>
    ),
  });

  const modalInfoItems = useMemo(
    () =>
      confirmInfo.concat(
        warningWithPendingWithdraw
          ? [
              {
                label: '',
                value: (
                  <Flex alignSelf="center" justify="center" p="4">
                    <Text color="yellow.400">{t('pendingLiquidity.withdrawWarning')}</Text>
                  </Flex>
                ),
              },
            ]
          : [],
      ),
    [confirmInfo, warningWithPendingWithdraw],
  );

  return (
    <PanelView
      header={<ViewHeader withBack actionsComponent={<GlobalSettingsPopover />} title={title} />}
      title={t('views.liquidity.withdrawLiquidity')}
    >
      <LiquidityType
        onChange={setWithdrawType}
        options={withdrawOptions}
        poolAsset={poolAsset}
        selected={withdrawType}
        title={`${t('views.liquidity.withdraw')}:`}
      />

      <LPTypeSelector
        onChange={handleSetLPType}
        options={shareTypes}
        poolAsset={poolAsset}
        selected={lpType}
        title={`${t('views.liquidity.from')}:`}
      />

      <AssetInputs
        assetAmount={assetAmount}
        liquidityType={withdrawType}
        onPercentChange={handleChangePercent}
        percent={Amount.fromNormalAmount(percent)}
        poolAsset={poolAsset}
        runeAmount={runeAmount}
      />

      {hasPending && (
        <InfoTip
          onClick={() => navigate(getAddLiquidityRoute(pool.asset))}
          title={t('pendingLiquidity.content', { asset: `${poolAsset.ticker} or RUNE` })}
          type="warn"
        />
      )}

      {warningWithPendingWithdraw && (
        <InfoTip
          onClick={() => navigate(getAddLiquidityRoute(pool.asset))}
          title={t('pendingLiquidity.withdrawWarning')}
          type="warn"
        />
      )}

      <Box className="w-full pt-4">
        <InfoTable horizontalInset items={confirmInfo} />
      </Box>

      <Box className="self-stretch gap-4 pt-5">
        {isLPActionPaused ? (
          <Button stretch size="lg" variant="secondary">
            {t('views.liquidity.withdrawNotAvailable')}
          </Button>
        ) : isWalletConnected ? (
          <Button stretch onClick={handleWithdrawLiquidity} size="lg" variant="secondary">
            {t('common.withdraw')}
          </Button>
        ) : (
          <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
            {t('common.connectWallet')}
          </Button>
        )}
      </Box>

      <ConfirmModal
        inputAssets={[
          withdrawType === LiquidityTypeOption.ASSET
            ? poolAsset
            : getSignatureAssetFor(Chain.THORChain),
        ]}
        isOpened={visibleConfirmModal}
        onClose={() => setVisibleConfirmModal(false)}
        onConfirm={handleConfirmWithdraw}
      >
        <InfoTable items={modalInfoItems} />
      </ConfirmModal>
    </PanelView>
  );
};

export default WithdrawLiquidity;
