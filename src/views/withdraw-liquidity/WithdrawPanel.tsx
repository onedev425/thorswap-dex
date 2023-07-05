import { Flex, Text } from '@chakra-ui/react';
import { FullMemberPool } from '@thorswap-lib/midgard-sdk';
import {
  Amount,
  AmountType,
  AssetEntity,
  getAsymmetricAssetWithdrawAmount,
  getAsymmetricRuneWithdrawAmount,
  getSignatureAssetFor,
  getSymmetricWithdraw,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { LiquidityType } from 'components/LiquidityType/LiquidityType';
import { LPTypeSelector } from 'components/LPTypeSelector';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { PanelView } from 'components/PanelView';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { ViewHeader } from 'components/ViewHeader';
import { RUNEAsset } from 'helpers/assets';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { parseAssetToToken } from 'helpers/parseHelpers';
import { hasWalletConnected } from 'helpers/wallet';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getThorYieldLPInfoBaseRoute } from 'settings/router';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { LiquidityTypeOption, PoolShareType } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

import { AssetInputs } from './AssetInputs';

export const WithdrawPanel = ({
  poolAsset,
  shares,
}: {
  shares: Record<
    PoolShareType,
    | null
    | undefined
    | (FullMemberPool & {
        poolUnits?: string;
        poolAssetDepth?: string;
        poolRuneDepth?: string;
      })
  >;
  poolAsset: AssetEntity;
}) => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { isChainPauseLPAction } = useMimir();
  const { getChainWithdrawLPPaused } = useExternalConfig();

  const isLPActionPaused: boolean = useMemo(() => {
    return (
      isChainPauseLPAction(poolAsset.chain) || getChainWithdrawLPPaused(poolAsset.chain as Chain)
    );
  }, [isChainPauseLPAction, poolAsset.chain, getChainWithdrawLPPaused]);

  const [lpType, setLPType] = useState(Object.keys(shares)[0] as PoolShareType);
  const poolData = shares[lpType];

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

  const { feeInUSD } = useNetworkFee({
    inputAsset: withdrawType === LiquidityTypeOption.ASSET ? poolAsset : RUNEAsset,
    type: 'outbound',
  });

  const { runeAmount, assetAmount } = useMemo(() => {
    if (!poolData) {
      return { runeAmount: Amount.fromMidgard(0), assetAmount: Amount.fromMidgard(0) };
    }

    const { assetPending, runePending, sharedUnits, poolUnits, poolAssetDepth, poolRuneDepth } =
      poolData;

    if (lpType === PoolShareType.PENDING) {
      return {
        runeAmount: Amount.fromMidgard(runePending).mul(percent / 100),
        assetAmount: Amount.fromMidgard(assetPending).mul(percent / 100),
      };
    }

    const params = {
      percent: percent / 100,
      liquidityUnits: sharedUnits,
      poolUnits: poolUnits || '0',
      assetDepth: poolAssetDepth || '0',
      runeDepth: poolRuneDepth || '0',
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
  }, [lpType, poolData, percent, withdrawType]);

  const { data: tokenPricesData } = useTokenPrices([RUNEAsset, poolAsset], {
    pollingInterval: 60000,
  });

  const [runePrice, assetPrice] = useMemo(
    () => [
      tokenPricesData[parseAssetToToken(RUNEAsset).identifier as string]?.price_usd,
      tokenPricesData[parseAssetToToken(poolAsset).identifier as string]?.price_usd,
    ],
    [tokenPricesData, poolAsset],
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

    if (!poolAsset.isRUNE()) {
      const assetDecimals = await getEVMDecimal(poolAsset);
      poolAsset.setDecimal(assetDecimals);
    }

    const runeObject = {
      asset: getSignatureAssetFor(Chain.THORChain).name,
      amount: runeAmount.toSignificant(6),
    };
    const assetObject = {
      asset: poolAsset.name,
      amount: assetAmount.toSignificant(6),
    };
    const withdrawChain = withdrawTo === 'asset' ? poolAsset.chain : Chain.THORChain;
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
        asset: poolAsset,
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
  }, [wallet, runeAmount, poolAsset, assetAmount, withdrawTo, appDispatch, percent, withdrawFrom]);

  const handleWithdrawLiquidity = useCallback(() => {
    if (wallet) {
      setVisibleConfirmModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [wallet]);

  const title = useMemo(
    () => `${t('common.withdraw')} ${poolAsset.ticker} ${t('common.liquidity')}`,
    [poolAsset],
  );

  const withdrawOptions = useMemo(() => {
    // allow only sym withdraw for staged pools
    const isPendingLP = lpType === PoolShareType.PENDING;

    if (isPendingLP) {
      return [LiquidityTypeOption.SYMMETRICAL];
    }

    if (lpType === PoolShareType.RUNE_ASYM) return [LiquidityTypeOption.RUNE];
    if (lpType === PoolShareType.ASSET_ASYM) return [LiquidityTypeOption.ASSET];

    return [LiquidityTypeOption.ASSET, LiquidityTypeOption.SYMMETRICAL, LiquidityTypeOption.RUNE];
  }, [lpType]);

  const withdrawAssets = useMemo(() => {
    const withdrawArray = [];

    if (
      withdrawType === LiquidityTypeOption.SYMMETRICAL ||
      withdrawType === LiquidityTypeOption.RUNE
    ) {
      withdrawArray.push({
        asset: getSignatureAssetFor(Chain.THORChain),
        value: `${runeAmount.toSignificant(6)} RUNE ($${(
          (runePrice || 0) * runeAmount.assetAmount.toNumber()
        )?.toFixed(2)})`,
      });
    }

    if (
      withdrawType === LiquidityTypeOption.SYMMETRICAL ||
      withdrawType === LiquidityTypeOption.ASSET
    ) {
      withdrawArray.push({
        asset: poolAsset,
        value: `${assetAmount.toSignificant(6)} ${poolAsset.ticker} ($${(
          (assetPrice || 0) * assetAmount.assetAmount.toNumber()
        )?.toFixed(2)})`,
      });
    }

    return withdrawArray;
  }, [withdrawType, runeAmount, runePrice, poolAsset, assetAmount, assetPrice]);

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

  const warningWithPendingWithdraw = useMemo(
    () => !!shares.pending && Object.keys(shares).length > 1,
    [shares],
  );

  const confirmInfo = useMemo(
    () =>
      withdrawAssets
        .map((data) => ({
          label: `${t('common.withdraw')} ${data.asset.ticker} (${data.asset.type})`,
          value: (
            <Box alignCenter justify="between">
              <Text className="mx-2" fontWeight="semibold">
                {data.value}
              </Text>
              <AssetIcon asset={data.asset} size={24} />
            </Box>
          ),
        }))
        .concat([
          {
            label: t('common.transactionFee'),
            value: (
              <InfoWithTooltip tooltip={t('views.liquidity.gasFeeTooltip')} value={feeInUSD} />
            ),
          },
          {
            label: t('views.liquidity.ilp'),
            value: (
              <InfoWithTooltip
                tooltip={t('views.liquidity.ILPTooltip')}
                value={
                  <Link external to={lpLink}>
                    <Button
                      className="px-2.5"
                      leftIcon={<Icon name="chart" size={16} />}
                      variant="borderlessTint"
                    >
                      {t('common.viewOnThoryieldNoArrow')}
                    </Button>
                  </Link>
                }
              />
            ),
          },
        ]),
    [feeInUSD, lpLink, withdrawAssets],
  );

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
        options={Object.keys(shares) as PoolShareType[]}
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

      {shares.pending && (
        <InfoTip
          onClick={() => navigate(getAddLiquidityRoute(poolAsset))}
          title={t('pendingLiquidity.content', { asset: `${poolAsset.ticker} or RUNE` })}
          type="warn"
        />
      )}

      {warningWithPendingWithdraw && (
        <InfoTip
          onClick={() => navigate(getAddLiquidityRoute(poolAsset))}
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
