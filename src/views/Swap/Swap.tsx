import { Box, Flex } from '@chakra-ui/react';
import type { QuoteRoute } from '@swapkit/api';
import type { QuoteMode } from '@swapkit/core';
import { AssetValue, BaseDecimal, Chain, SwapKitNumber, WalletOption } from '@swapkit/core';
import { Analysis } from 'components/Analysis/Analysis';
import { easeInOutTransition } from 'components/constants';
import { InfoTip } from 'components/InfoTip';
import { PanelView } from 'components/PanelView';
import { SwapRouter } from 'components/SwapRouter';
import { TxOptimizeSection } from 'components/TxOptimize/TxOptimizeSection';
import { useKeystore, useWallet } from 'context/wallet/hooks';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { useBalance } from 'hooks/useBalance';
import { useRouteFees } from 'hooks/useRouteFees';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { captureEvent } from 'services/postHog';
import { IS_LEDGER_LIVE } from 'settings/config';
import { getKyberSwapRoute, getSwapRoute } from 'settings/router';
import { useApp } from 'store/app/hooks';
import { zeroAmount } from 'types/app';
import { FeeModal } from 'views/Swap/FeeModal';
import { useKyberSwap } from 'views/Swap/hooks/useKyberSwap';
import { useTokenList } from 'views/Swap/hooks/useTokenList';
import RUNEInfoContent from 'views/Swap/RUNEInfoContent';
import THORInfoContent from 'views/Swap/THORInfoContent';

import { ApproveModal } from './ApproveModal';
import { AssetInputs } from './AssetInputs';
import { ConfirmSwapModal } from './ConfirmSwapModal';
import { CustomRecipientInput } from './CustomRecipientInput';
import { useSwap } from './hooks/useSwap';
import { useSwapApprove } from './hooks/useSwapApprove';
import { useSwapQuote } from './hooks/useSwapQuote';
import { SwapHeader } from './SwapHeader';
import { SwapInfo } from './SwapInfo';
import { SwapSubmitButton } from './SwapSubmitButton';

const baseInput = AssetValue.fromChainOrSignature(IS_LEDGER_LIVE ? Chain.Bitcoin : Chain.Ethereum);
const baseOutput = AssetValue.fromChainOrSignature(IS_LEDGER_LIVE ? Chain.Ethereum : Chain.Bitcoin);

const SwapView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getMaxBalance } = useBalance();
  const { keystore } = useKeystore();
  const { getWallet, getWalletAddress } = useWallet();

  const { analyticsVisible, toggleAnalytics } = useApp();
  const { pair } = useParams<{ pair: string }>();
  const [inputString, outputString] = useMemo(() => (pair || '').split('_'), [pair]);

  const input = useMemo(() => {
    if (!pair || !inputString) return baseInput;

    return AssetValue.fromStringSync(inputString) || baseInput;
  }, [inputString, pair]);

  const output = useMemo(() => {
    if (!pair || !outputString) return baseOutput;

    return AssetValue.fromStringSync(outputString) || baseOutput;
  }, [outputString, pair]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const inputAsset = useMemo(() => input, [input.toString()]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const outputAsset = useMemo(() => output, [output.toString()]);

  useEffect(() => {
    captureEvent('swapPair', { sell: inputAsset.toString(), buy: outputAsset.toString() });
  }, [inputAsset, outputAsset]);

  const [maxNewInputBalance, setMaxNewInputBalance] = useState(zeroAmount);
  const [maxInputBalance, setMaxInputBalance] = useState<AssetValue | undefined>(input.set(0));

  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [feeModalOpened, setFeeModalOpened] = useState(false);
  const formatPrice = useFormatPrice();
  const ethAddress = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);

  const { tokens } = useTokenList();

  const [inputToken, outputToken] = useMemo(
    () => [
      tokens.find(
        ({ identifier }) =>
          identifier.toUpperCase() === `${inputAsset.chain}.${inputAsset.symbol}`.toUpperCase(),
      ),
      tokens.find(
        ({ identifier }) =>
          identifier.toUpperCase() === `${outputAsset.chain}.${outputAsset.symbol}`.toUpperCase(),
      ),
    ],
    [inputAsset.chain, inputAsset.symbol, outputAsset.chain, outputAsset.symbol, tokens],
  );

  const inputAmount = useMemo(
    () =>
      new SwapKitNumber({
        value: searchParams.get('sellAmount') || '0',
        decimal: inputAsset.decimal,
      }),
    [inputAsset.decimal, searchParams],
  );

  const setInputAmount = useCallback(
    (value: SwapKitNumber) => {
      const assetAmountString = value.getValue('string');
      const assetRoutePath = location.pathname.split('?')[0];

      navigate(`${assetRoutePath}?sellAmount=${assetAmountString}`);
    },
    [location.pathname, navigate],
  );

  useEffect(() => {
    if (IS_LEDGER_LIVE) {
      setRecipient(getWalletAddress(outputAsset.chain));
      setSender(getWalletAddress(inputAsset.chain));
      return;
    }
    import('services/swapKit')
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getAddress }) => {
        setRecipient(getAddress(outputAsset.chain) || '');
        setSender(getAddress(inputAsset.chain) || '');
      });
  }, [getWalletAddress, inputAsset.chain, outputAsset]);

  useEffect(() => {
    const inputDecimal =
      isETHAsset(inputAsset) || isAVAXAsset(inputAsset) ? BaseDecimal.ETH : inputToken?.decimals;
    const outputDecimal =
      isETHAsset(outputAsset) || isAVAXAsset(outputAsset) ? BaseDecimal.ETH : outputToken?.decimals;

    if (tokens.length) {
      inputAsset.decimal = inputDecimal;
      outputAsset.decimal = outputDecimal;
    }
  }, [inputAsset, inputToken?.decimals, outputAsset, outputToken?.decimals, tokens]);

  const noPriceProtection = useMemo(
    () =>
      [Chain.Litecoin, Chain.Dogecoin, Chain.BitcoinCash].includes(inputAsset.chain) &&
      getWallet(inputAsset.chain)?.walletType === WalletOption.LEDGER,
    [getWallet, inputAsset.chain],
  );

  const {
    data: pricesData,
    refetch: refetchPrice,
    isLoading: isPriceLoading,
  } = useTokenPrices([inputAsset, outputAsset]);

  const { inputUSDPrice, inputUnitPrice, outputUnitPrice } = useMemo(() => {
    const inputUnitPrice = pricesData?.[inputAsset.toString()]?.price_usd || 0;
    const outputUnitPrice = pricesData?.[outputAsset.toString()]?.price_usd || 0;

    return {
      outputUnitPrice,
      inputUnitPrice,
      inputUSDPrice: inputUnitPrice * inputAmount.getValue('number'),
    };
  }, [pricesData, inputAsset, outputAsset, inputAmount]);

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
    inputUSDPrice,
    ethAddress,
    noPriceProtection,
    inputAsset,
    inputAmount,
    outputAsset,
    senderAddress: sender,
    recipientAddress: recipient,
  });

  const { isKyberSwapPage, kyberRoutes } = useKyberSwap({ routes });

  const outputUSDPrice = useMemo(
    () => outputUnitPrice * outputAmount.getValue('number'),
    [outputUnitPrice, outputAmount],
  );

  const isInputWalletConnected = useMemo(
    () => !!getWallet(inputAsset.chain),
    [getWallet, inputAsset.chain],
  );

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
    (type: 'input' | 'output') => async (asset: AssetValue) => {
      const isInput = type === 'input';
      const input = !isInput ? (asset.eq(inputAsset) ? outputAsset : inputAsset) : asset;
      const output = isInput ? (asset.eq(outputAsset) ? inputAsset : outputAsset) : asset;

      if (isInput) {
        const maxNewInputBalance = (await getMaxBalance(asset)) || zeroAmount;
        setInputAmount(
          inputAmount.gt(maxNewInputBalance)
            ? new SwapKitNumber({
                value: maxNewInputBalance.getValue('string'),
                decimal: maxNewInputBalance.decimal,
              })
            : inputAmount,
        );
      }

      const route = isKyberSwapPage
        ? getKyberSwapRoute(input, output)
        : getSwapRoute(input, output);

      navigate(`${route}?sellAmount=${inputAmount.getValue('string')}`);
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
      setMaxNewInputBalance(
        outputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : outputAmount,
      );
      const defaultAsset = isETHAsset(outputAsset)
        ? AssetValue.fromChainOrSignature(!IS_LEDGER_LIVE ? 'ETH.THOR' : Chain.Bitcoin)
        : AssetValue.fromChainOrSignature(Chain.Ethereum);
      const output = unsupportedOutput ? defaultAsset : inputAsset;
      const route = isKyberSwapPage
        ? getKyberSwapRoute(outputAsset, output)
        : getSwapRoute(outputAsset, output);

      navigate(`${route}?sellAmount=${outputAmount.getValue('string')}`);
    },
    [outputAmount, maxNewInputBalance, outputAsset, inputAsset, isKyberSwapPage, navigate],
  );

  const refetchData = useCallback(() => {
    refetchPrice();
    refetchQuote();
  }, [refetchPrice, refetchQuote]);

  const handleSwap = useSwap({
    inputAsset: inputAsset.set(inputAmount),
    outputAsset: outputAsset.set(outputAmount),
    quoteMode,
    recipient,
    route: selectedRoute as unknown as QuoteRoute,
    quoteId,
    streamSwap,
  });

  useEffect(() => {
    setMaxInputBalance(undefined);
    getMaxBalance(inputAsset).then((maxBalance) => setMaxInputBalance(maxBalance));
  }, [inputAsset, getMaxBalance]);

  const slippage = (inputUSDPrice - outputUSDPrice) / inputUSDPrice;
  const minReceiveSlippage =
    (inputUSDPrice - minReceive.getValue('number') * outputUnitPrice) / inputUSDPrice;

  const minReceiveInfo = useMemo(
    () =>
      minReceive.gte(0)
        ? `${minReceive.toSignificant(6)} ${outputAsset.ticker.toUpperCase()}`
        : '-',
    [minReceive, outputAsset.ticker],
  );

  const isOutputWalletConnected = useMemo(
    () => !!getWallet(outputAsset.chain),
    [getWallet, outputAsset.chain],
  );

  const showTransactionFeeSelect = useMemo(
    () => isInputWalletConnected && inputAsset.chain === Chain.Ethereum && !!keystore,
    [inputAsset.chain, isInputWalletConnected, keystore],
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
    () => (maxInputBalance ? inputAmount.gt(maxInputBalance) : false),
    [inputAmount, maxInputBalance],
  );

  const assetTickers = useMemo(
    () => [inputAsset.ticker, outputAsset.ticker] as [string, string],
    [inputAsset.ticker, outputAsset.ticker],
  );

  const onInputAmountChange = useCallback(() => handleSelectAsset('input'), [handleSelectAsset]);
  const onOutputAmountChange = useCallback(() => handleSelectAsset('output'), [handleSelectAsset]);

  return (
    <Flex alignSelf="center" gap={3} mt={2} w="full">
      <Box m="auto" transition={easeInOutTransition}>
        <PanelView
          description={t('views.swap.description', {
            inputAsset: inputAsset.ticker.toUpperCase(),
            outputAsset: outputAsset.ticker.toUpperCase(),
          })}
          header={
            <SwapHeader
              inputAssetChain={inputAsset.chain}
              isSidebarVisible={analyticsVisible}
              refetchData={!selectedRoute || isFetching || isPriceLoading ? undefined : refetchData}
              toggleSidebar={() => toggleAnalytics(!analyticsVisible)}
            />
          }
          keywords={`${inputAsset.ticker}, ${outputAsset.ticker}, SWAP, THORSwap, THORChain, DEX, DeFi`}
          title={`${t('common.swap')} ${inputAsset.ticker} to ${outputAsset.ticker}`}
        >
          <AssetInputs
            inputAsset={inputAssetProps}
            onInputAmountChange={setInputAmount}
            onInputAssetChange={onInputAmountChange()}
            onOutputAssetChange={onOutputAmountChange()}
            onSwitchPair={handleSwitchPair}
            outputAsset={outputAssetProps}
            tokens={tokens}
          />

          {!IS_LEDGER_LIVE && (
            <CustomRecipientInput
              isOutputWalletConnected={isOutputWalletConnected}
              outputAssetchain={outputAsset.chain}
              recipient={recipient}
              setRecipient={setRecipient}
            />
          )}

          <TxOptimizeSection
            canStream={canStreamSwap}
            outputAsset={outputAsset}
            quote={selectedRoute}
            stream={streamSwap}
            toggleStream={toggleStreamSwap}
          />

          <SwapInfo
            affiliateBasisPoints={Number(affiliateBasisPoints)}
            affiliateFee={affiliateFee}
            assets={assetTickers}
            expectedOutput={`${outputAmount?.toSignificant(6)} ${outputAsset.ticker.toUpperCase()}`}
            inputUnitPrice={inputUnitPrice}
            isLoading={isPriceLoading}
            minReceive={minReceiveInfo}
            minReceiveSlippage={minReceiveSlippage}
            networkFee={networkFee}
            outputUnitPrice={outputUnitPrice}
            setFeeModalOpened={setFeeModalOpened}
            showTransactionFeeSelect={showTransactionFeeSelect}
            streamSwap={streamSwap}
            vTHORDiscount={vTHORDiscount}
            whaleDiscount={inputUSDPrice >= 1_000_000}
          />

          {tokenOutputWarning && (
            <InfoTip className="!mt-2" content={tokenOutputContent} type="warn" />
          )}

          {noPriceProtection && (
            <InfoTip
              className="!mt-2"
              content={t('views.swap.priceProtectionUnavailableDesc', {
                chain: inputAsset.chain,
              })}
              title={t('views.swap.priceProtectionUnavailable')}
              type="warn"
            />
          )}

          <SwapRouter
            outputAsset={outputAsset}
            outputUnitPrice={outputUnitPrice}
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
            inputUSDPrice={inputUSDPrice}
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
        inputAssetChain={inputAsset.chain}
        toggleAnalytics={toggleAnalytics}
      />
    </Flex>
  );
};

export default SwapView;
