import { Box, Flex } from '@chakra-ui/react';
import { QuoteRoute } from '@thorswap-lib/swapkit-api';
import {
  Amount,
  AssetEntity,
  getSignatureAssetFor,
  Price,
  QuoteMode,
} from '@thorswap-lib/swapkit-core';
import { BaseDecimal, Chain, WalletOption } from '@thorswap-lib/types';
import BigNumber from 'bignumber.js';
import { Analysis } from 'components/Analysis/Analysis';
import { easeInOutTransition } from 'components/constants';
import { InfoTip } from 'components/InfoTip';
import { PanelView } from 'components/PanelView';
import { SwapRouter } from 'components/SwapRouter';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { hasWalletConnected } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useRouteFees } from 'hooks/useRouteFees';
import { useSlippage } from 'hooks/useSlippage';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { IS_LEDGER_LIVE } from 'settings/config';
import { getKyberSwapRoute, getSwapRoute } from 'settings/router';
import { useApp } from 'store/app/hooks';
import { useWallet } from 'store/wallet/hooks';
import { FeeModal } from 'views/Swap/FeeModal';
import { useKyberSwap } from 'views/Swap/hooks/useKyberSwap';
import { useTokenList } from 'views/Swap/hooks/useTokenList';
import RUNEInfoContent from 'views/Swap/RUNEInfoContent';
import { SwapOptimizeSection } from 'views/Swap/SwapOptimizeSection';
import THORInfoContent from 'views/Swap/THORInfoContent';

import { ApproveModal } from './ApproveModal';
import { AssetInputs } from './AssetInputs';
import { ConfirmSwapModal } from './ConfirmSwapModal';
import { CustomRecipientInput } from './CustomRecipientInput';
import { useSwap } from './hooks/useSwap';
import { useSwapApprove } from './hooks/useSwapApprove';
import { useSwapPair } from './hooks/useSwapPair';
import { useSwapQuote } from './hooks/useSwapQuote';
import { SwapHeader } from './SwapHeader';
import { SwapInfo } from './SwapInfo';
import { SwapSubmitButton } from './SwapSubmitButton';

const SwapView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getMaxBalance } = useBalance();
  const { inputAmountAssetString, setInputAmountAssetString, inputAsset, outputAsset } =
    useSwapPair();
  const { wallet, keystore } = useWallet();
  const { analyticsVisible, toggleAnalytics } = useApp();

  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [feeModalOpened, setFeeModalOpened] = useState(false);
  const formatPrice = useFormatPrice({ groupSize: 0 });
  const ethAddress = useMemo(() => wallet?.ETH?.address, [wallet]);

  const { tokens } = useTokenList();

  const [inputToken, outputToken] = useMemo(
    () => [
      tokens.find(
        ({ identifier }) =>
          identifier.toUpperCase() === `${inputAsset.L1Chain}.${inputAsset.symbol}`.toUpperCase(),
      ),
      tokens.find(
        ({ identifier }) =>
          identifier.toUpperCase() === `${outputAsset.L1Chain}.${outputAsset.symbol}`.toUpperCase(),
      ),
    ],
    [inputAsset.L1Chain, inputAsset.symbol, outputAsset.L1Chain, outputAsset.symbol, tokens],
  );

  const inputAmount = useMemo(
    () => Amount.fromAssetAmount(inputAmountAssetString, inputAsset.decimal),
    [inputAsset, inputAmountAssetString],
  );

  const setInputAmount = useCallback(
    (value: Amount) => {
      const assetAmountString = value.assetAmount.toString();
      const assetRoutePath = location.pathname.split('?')[0];

      navigate(`${assetRoutePath}?sellAmount=${assetAmountString}`);
      setInputAmountAssetString(assetAmountString);
    },
    [location.pathname, navigate, setInputAmountAssetString],
  );

  useEffect(() => {
    if (IS_LEDGER_LIVE) {
      setRecipient(wallet[outputAsset.L1Chain]?.address || '');
      setSender(wallet[inputAsset.L1Chain]?.address || '');
      return;
    }
    import('services/swapKit')
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getAddress }) => {
        setRecipient(getAddress(outputAsset.L1Chain) || '');
        setSender(getAddress(inputAsset.L1Chain) || '');
      });
  }, [inputAsset.L1Chain, outputAsset, wallet]);

  useEffect(() => {
    const inputDecimal =
      isETHAsset(inputAsset) || isAVAXAsset(inputAsset) ? BaseDecimal.ETH : inputToken?.decimals;
    const outputDecimal =
      isETHAsset(outputAsset) || isAVAXAsset(outputAsset) ? BaseDecimal.ETH : outputToken?.decimals;

    if (tokens.length) {
      inputAsset.setDecimal(inputDecimal);
      outputAsset.setDecimal(outputDecimal);
    }
  }, [inputAsset, inputToken?.decimals, outputAsset, outputToken?.decimals, tokens]);

  const noPriceProtection = useMemo(
    () =>
      [Chain.Litecoin, Chain.Dogecoin, Chain.BitcoinCash].includes(inputAsset.L1Chain) &&
      wallet?.[inputAsset.L1Chain]?.walletType === WalletOption.LEDGER,
    [inputAsset.L1Chain, wallet],
  );

  const {
    data: pricesData,
    refetch: refetchPrice,
    isLoading: isPriceLoading,
  } = useTokenPrices([inputAsset, outputAsset]);

  const { inputUSDValue, inputUSDPrice, outputUnitPrice, inputUnitPrice } = useMemo(() => {
    const inputUnitPrice = pricesData?.[inputAsset.toString()]?.price_usd || 0;
    const outputUnitPrice = pricesData?.[outputAsset.toString()]?.price_usd || 0;
    const inputUSDPrice = new Price({
      baseAsset: inputAsset,
      unitPrice: new BigNumber(inputUnitPrice),
      priceAmount: inputAmount,
    });

    return {
      inputUnitPrice,
      outputUnitPrice,
      inputUSDPrice,
      inputUSDValue: inputUSDPrice.price.toNumber(),
    };
  }, [pricesData, inputAsset, inputAmount, outputAsset]);

  const {
    affiliateBasisPoints,
    estimatedTime,
    isFetching,
    minReceive,
    outputAmount,
    refetch: refetchQuote,
    routes,
    error,
    selectedRoute,
    setSwapRoute,
    quoteId,
    streamSwap,
    toggleStreamSwap,
    canStreamSwap,
    selectedRouteFees: fees,
    vTHORDiscount,
  } = useSwapQuote({
    inputUSDValue,
    ethAddress,
    noPriceProtection,
    inputAmount,
    inputAsset,
    outputAsset,
    senderAddress: sender,
    recipientAddress: recipient,
  });

  const { isKyberSwapPage, kyberRoutes } = useKyberSwap({
    routes,
  });

  const outputUSDPrice = useMemo(
    () =>
      new Price({
        baseAsset: outputAsset,
        unitPrice: new BigNumber(outputUnitPrice),
        priceAmount: outputAmount,
      }),
    [outputAsset, outputUnitPrice, outputAmount],
  );

  const isInputWalletConnected = useMemo(
    () => inputAsset && hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  );

  const maxInputBalance = useMemo(() => getMaxBalance(inputAsset), [inputAsset, getMaxBalance]);

  const inputAssetBalance = useMemo(
    () => (isInputWalletConnected ? maxInputBalance : undefined),
    [isInputWalletConnected, maxInputBalance],
  );

  const inputAssetProps = useMemo(
    () => ({
      asset: inputAsset,
      logoURI: inputToken?.logoURI,
      value: inputAmount,
      balance: inputAssetBalance,
      usdPrice: inputUSDPrice,
      priceLoading: isPriceLoading,
    }),
    [
      inputAsset,
      inputToken?.logoURI,
      inputAmount,
      inputAssetBalance,
      inputUSDPrice,
      isPriceLoading,
    ],
  );

  const outputAssetProps = useMemo(
    () => ({
      asset: outputAsset,
      logoURI: outputToken?.logoURI,
      value: outputAmount,
      usdPrice: outputUSDPrice,
      loading: isFetching,
      priceLoading: isPriceLoading || isFetching,
    }),
    [outputAsset, outputToken?.logoURI, outputAmount, outputUSDPrice, isFetching, isPriceLoading],
  );

  const { approvalTarget, allowanceTarget, targetAddress } = selectedRoute || {};

  const quoteMode = useMemo(
    () => (selectedRoute?.meta?.quoteMode || '') as QuoteMode,
    [selectedRoute?.meta?.quoteMode],
  );

  const { firstNetworkFee, affiliateFee, networkFee, totalFee } = useRouteFees(fees);

  const handleApprove = useSwapApprove({
    contract: approvalTarget || allowanceTarget || targetAddress,
    inputAsset,
  });

  const feeAssets = useMemo(
    () =>
      [
        ...new Set(
          Object.values(fees || {})
            .flat()
            .map(({ asset }) => asset.split('.')[1]),
        ),
      ].join(', '),
    [fees],
  );

  const handleSelectAsset = useCallback(
    (type: 'input' | 'output') => (asset: AssetEntity) => {
      const isInput = type === 'input';
      const input = !isInput ? (asset.eq(inputAsset) ? outputAsset : inputAsset) : asset;
      const output = isInput ? (asset.eq(outputAsset) ? inputAsset : outputAsset) : asset;

      if (isInput) {
        const maxNewInputBalance = getMaxBalance(asset);
        setInputAmount(inputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : inputAmount);
      }

      const route = isKyberSwapPage
        ? getKyberSwapRoute(input, output)
        : getSwapRoute(input, output);

      navigate(`${route}?sellAmount=${inputAmount.assetAmount.toString()}`);
    },
    [
      getMaxBalance,
      inputAmount,
      inputAsset,
      navigate,
      outputAsset,
      setInputAmount,
      isKyberSwapPage,
    ],
  );

  const handleSwitchPair = useCallback(
    (unsupportedOutput?: boolean) => {
      const maxNewInputBalance = getMaxBalance(outputAsset);
      setInputAmount(outputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : outputAmount);
      const defaultAsset = isETHAsset(outputAsset)
        ? getSignatureAssetFor(!IS_LEDGER_LIVE ? 'ETH_THOR' : Chain.Bitcoin)
        : getSignatureAssetFor(Chain.Ethereum);
      const output = unsupportedOutput ? defaultAsset : inputAsset;
      const route = isKyberSwapPage
        ? getKyberSwapRoute(outputAsset, output)
        : getSwapRoute(outputAsset, output);

      navigate(`${route}?sellAmount=${outputAmount.assetAmount.toString()}`);
    },
    [
      getMaxBalance,
      outputAsset,
      setInputAmount,
      outputAmount,
      navigate,
      inputAsset,
      isKyberSwapPage,
    ],
  );

  const refetchData = useCallback(() => {
    refetchPrice();
    refetchQuote();
  }, [refetchPrice, refetchQuote]);

  const handleSwap = useSwap({
    inputAmount,
    inputAsset,
    outputAmount,
    outputAsset,
    quoteMode,
    recipient,
    route: selectedRoute as unknown as QuoteRoute,
    quoteId,
    streamSwap,
  });

  const slippage = useSlippage(inputUSDPrice, outputUSDPrice);

  const minReceiveSlippage = useSlippage(
    inputUSDPrice,
    formatPrice(minReceive.mul(outputUSDPrice.unitPrice), { prefix: '' }),
  );

  const minReceiveInfo = useMemo(
    () =>
      minReceive.gte(0) ? `${minReceive.toSignificant(6)} ${outputAsset.name.toUpperCase()}` : '-',
    [minReceive, outputAsset.name],
  );

  const isOutputWalletConnected = useMemo(
    () => outputAsset && hasWalletConnected({ wallet, inputAssets: [outputAsset] }),
    [wallet, outputAsset],
  );

  const showTransactionFeeSelect = useMemo(
    () => isInputWalletConnected && inputAsset.L1Chain === Chain.Ethereum && !!keystore,
    [inputAsset.L1Chain, isInputWalletConnected, keystore],
  );

  const isAvaxTHOR = useMemo(
    () => outputAsset.ticker.includes('THOR') && outputAsset.chain === Chain.Avalanche,
    [outputAsset],
  );
  const isEthRUNE = useMemo(
    () => outputAsset.ticker === 'RUNE' && outputAsset.chain === Chain.Ethereum,
    [outputAsset],
  );
  const tokenOutputWarning = useMemo(() => isAvaxTHOR || isEthRUNE, [isAvaxTHOR, isEthRUNE]);

  const tokenOutputContent = useMemo(() => {
    if (isAvaxTHOR) {
      return <THORInfoContent inputAsset={inputAsset} />;
    } else if (isEthRUNE) {
      return <RUNEInfoContent inputAsset={inputAsset} />;
    } else {
      return null;
    }
  }, [inputAsset, isAvaxTHOR, isEthRUNE]);

  const invalidSwap = useMemo(
    () => inputAmount.gt(maxInputBalance),
    [inputAmount, maxInputBalance],
  );

  return (
    <Flex alignSelf="center" gap={3} mt={2} w="full">
      <Box m="auto" transition={easeInOutTransition}>
        <PanelView
          description={t('views.swap.description', {
            inputAsset: inputAsset.name.toUpperCase(),
            outputAsset: outputAsset.name.toUpperCase(),
          })}
          header={
            <SwapHeader
              inputAssetChain={inputAsset.L1Chain}
              isSidebarVisible={analyticsVisible}
              refetchData={!selectedRoute || isFetching || isPriceLoading ? undefined : refetchData}
              toggleSidebar={() => toggleAnalytics(!analyticsVisible)}
            />
          }
          keywords={`${inputAsset.name}, ${outputAsset.name}, SWAP, THORSwap, THORChain, DEX, DeFi`}
          title={`${t('common.swap')} ${inputAsset.name} to ${outputAsset.name}`}
        >
          <AssetInputs
            inputAsset={inputAssetProps}
            onInputAmountChange={setInputAmount}
            onInputAssetChange={handleSelectAsset('input')}
            onOutputAssetChange={handleSelectAsset('output')}
            onSwitchPair={handleSwitchPair}
            outputAsset={outputAssetProps}
            tokens={tokens}
          />

          {!IS_LEDGER_LIVE && (
            <CustomRecipientInput
              isOutputWalletConnected={isOutputWalletConnected}
              outputAssetL1Chain={outputAsset.L1Chain}
              recipient={recipient}
              setRecipient={setRecipient}
            />
          )}

          <SwapOptimizeSection
            canStreamSwap={canStreamSwap}
            outputAsset={outputAsset}
            route={selectedRoute}
            streamSwap={streamSwap}
            toggleStreamSwap={toggleStreamSwap}
          />

          <SwapInfo
            affiliateBasisPoints={Number(affiliateBasisPoints)}
            affiliateFee={affiliateFee}
            expectedOutput={`${outputAmount?.toSignificant(6)} ${outputAsset.name.toUpperCase()}`}
            inputUSDPrice={inputUSDPrice}
            isLoading={isPriceLoading}
            minReceive={minReceiveInfo}
            minReceiveSlippage={minReceiveSlippage}
            networkFee={networkFee}
            outputUSDPrice={outputUSDPrice}
            setFeeModalOpened={setFeeModalOpened}
            showTransactionFeeSelect={showTransactionFeeSelect}
            vTHORDiscount={vTHORDiscount}
            whaleDiscount={inputUSDValue >= 1_000_000}
          />

          {tokenOutputWarning && (
            <InfoTip className="!mt-2" content={tokenOutputContent} type="warn" />
          )}

          {noPriceProtection && (
            <InfoTip
              className="!mt-2"
              content={t('views.swap.priceProtectionUnavailableDesc', {
                chain: inputAsset.L1Chain,
              })}
              title={t('views.swap.priceProtectionUnavailable')}
              type="warn"
            />
          )}

          {streamSwap && (
            <InfoTip className="!mt-2" title={t('views.swap.streamingSwapWarning')} type="warn" />
          )}

          <SwapRouter
            outputAsset={outputAsset}
            outputUSDPrice={outputUSDPrice}
            routes={!isKyberSwapPage ? routes : kyberRoutes}
            selectedRoute={!isKyberSwapPage ? selectedRoute : kyberRoutes[0]}
            setSwapRoute={setSwapRoute}
            streamSwap={streamSwap}
          />

          <SwapSubmitButton
            hasQuote={!!selectedRoute}
            inputAmount={inputAmount}
            inputAsset={inputAsset}
            invalidSwap={invalidSwap}
            isApproved={!!selectedRoute?.isApproved}
            isInputWalletConnected={isInputWalletConnected}
            isLoading={isFetching || isPriceLoading}
            isOutputWalletConnected={isOutputWalletConnected}
            outputAsset={outputAsset}
            quoteError={!!error}
            recipient={recipient}
            setVisibleApproveModal={setVisibleApproveModal}
            setVisibleConfirmModal={setVisibleConfirmModal}
          />

          <ConfirmSwapModal
            affiliateFee={formatPrice(affiliateFee)}
            estimatedTime={estimatedTime}
            feeAssets={feeAssets}
            handleSwap={handleSwap}
            inputAssetProps={inputAssetProps}
            inputUSDPrice={inputUSDPrice.assetAmount.toNumber() * inputUnitPrice}
            minReceive={minReceiveInfo}
            outputAssetProps={outputAssetProps}
            recipient={recipient}
            selectedRoute={selectedRoute}
            setVisible={setVisibleConfirmModal}
            slippageInfo={slippage.toFixed(3)}
            streamSwap={streamSwap}
            totalFee={formatPrice(totalFee)}
            visible={visibleConfirmModal}
          />

          <ApproveModal
            handleApprove={handleApprove}
            inputAmount={inputAmount}
            inputAsset={inputAsset}
            setVisible={setVisibleApproveModal}
            totalFee={formatPrice(firstNetworkFee)}
            visible={visibleApproveModal}
          />

          <FeeModal
            fees={fees}
            isOpened={feeModalOpened}
            onClose={() => setFeeModalOpened(false)}
            totalFee={formatPrice(totalFee)}
          />
        </PanelView>
      </Box>

      <Analysis
        analyticsVisible={analyticsVisible}
        inputAssetChain={inputAsset.L1Chain}
        toggleAnalytics={toggleAnalytics}
      />
    </Flex>
  );
};

export default SwapView;
