import { Flex, Text } from '@chakra-ui/react';
import {
  AssetValue,
  Chain,
  getAsymmetricAssetWithdrawAmount,
  getAsymmetricRuneWithdrawAmount,
  getSymmetricWithdraw,
  SwapKitNumber,
} from '@swapkit/core';
import type { FullMemberPool } from '@thorswap-lib/midgard-sdk';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button } from 'components/Atomic';
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
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { RUNEAsset } from 'helpers/assets';
import { parseAssetToToken } from 'helpers/parseHelpers';
import { useMimir } from 'hooks/useMimir';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute } from 'settings/router';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { LiquidityTypeOption, PoolShareType } from 'store/midgard/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
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
  poolAsset: AssetValue;
}) => {
  const navigate = useNavigate();
  const appDispatch = useAppDispatch();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { hasWallet, getWalletAddress } = useWallet();

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
      lpType === PoolShareType.ASSET_ASYM
        ? poolAsset
        : AssetValue.fromChainOrSignature(Chain.THORChain);

    return !!getWalletAddress(inputAsset.chain);
  }, [getWalletAddress, lpType, poolAsset]);

  const { feeInUSD } = useNetworkFee({
    inputAsset: withdrawType === LiquidityTypeOption.ASSET ? poolAsset : RUNEAsset,
    type: 'outbound',
  });

  const { runeAmount, assetAmount } = useMemo(() => {
    if (!poolData) {
      return {
        runeAmount: new SwapKitNumber(0),
        assetAmount: new SwapKitNumber(0),
      };
    }

    const { assetPending, runePending, sharedUnits, poolUnits, poolAssetDepth, poolRuneDepth } =
      poolData;

    if (lpType === PoolShareType.PENDING) {
      return {
        runeAmount: SwapKitNumber.fromBigInt(BigInt(runePending), 8).mul(percent / 100),
        assetAmount: SwapKitNumber.fromBigInt(BigInt(assetPending), 8).mul(percent / 100),
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
              : SwapKitNumber.fromBigInt(0n, 8),
          assetAmount:
            withdrawType === LiquidityTypeOption.ASSET
              ? getAsymmetricAssetWithdrawAmount(params)
              : SwapKitNumber.fromBigInt(0n, 8),
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

  const handleChangePercent = useCallback((p: SwapKitNumber) => {
    setPercent(Number(p.toFixed(2)) || 0);
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

    if (!hasWallet) return;

    const runeObject = AssetValue.fromChainOrSignature(
      Chain.THORChain,
      runeAmount.getValue('string'),
    );
    const assetObject = poolAsset.add(assetAmount);
    const withdrawChain = withdrawTo === 'asset' ? poolAsset.chain : Chain.THORChain;
    const outAssets =
      withdrawTo === 'sym'
        ? [runeObject, assetObject]
        : withdrawTo === 'rune'
          ? [runeObject]
          : [assetObject];

    const label = outAssets
      .map((outAsset) => `${outAsset.toSignificant(6)} ${outAsset.ticker}`)
      .join(' & ');

    const id = v4();
    appDispatch(
      addTransaction({ id, type: TransactionType.TC_LP_WITHDRAW, inChain: withdrawChain, label }),
    );
    const { withdraw } = await (await import('services/swapKit')).getSwapKitClient();

    try {
      const txid = await withdraw({
        assetValue: poolAsset,
        percent: new SwapKitNumber({ value: percent, decimal: 2 }).getValue('number'),
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
  }, [
    hasWallet,
    runeAmount,
    poolAsset,
    assetAmount,
    withdrawTo,
    appDispatch,
    percent,
    withdrawFrom,
  ]);

  const handleWithdrawLiquidity = useCallback(() => {
    if (hasWallet) {
      setVisibleConfirmModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [hasWallet]);

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
        asset: AssetValue.fromChainOrSignature(Chain.THORChain),
        value: `${runeAmount.toSignificant(6)} RUNE ($${(
          (runePrice || 0) * runeAmount.getValue('number')
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
          (assetPrice || 0) * assetAmount.getValue('number')
        )?.toFixed(2)})`,
      });
    }

    return withdrawArray;
  }, [withdrawType, runeAmount, runePrice, poolAsset, assetAmount, assetPrice]);

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
        ]),
    [feeInUSD, withdrawAssets],
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
        percent={new SwapKitNumber(percent)}
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
            : AssetValue.fromChainOrSignature(Chain.THORChain),
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
