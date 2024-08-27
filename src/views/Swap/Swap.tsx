import { Flex, Text } from "@chakra-ui/react";
import type { QuoteResponseRoute, QuoteRoute } from "@swapkit/api";
import type { QuoteMode } from "@swapkit/sdk";
import { AssetValue, BaseDecimal, Chain, SwapKitNumber, WalletOption } from "@swapkit/sdk";
import { Analysis } from "components/Analysis/Analysis";
import { Box } from "components/Atomic";
import { InfoTip } from "components/InfoTip";
import { PanelView } from "components/PanelView";
import { SwapRouter } from "components/SwapRouter";
import { easeInOutTransition } from "components/constants";
import { useKeystore, useWallet } from "context/wallet/hooks";
import { isAVAXAsset, isETHAsset } from "helpers/assets";
import { useFormatPrice } from "helpers/formatPrice";
import { useBalance } from "hooks/useBalance";
import { useRouteFees } from "hooks/useRouteFees";
import { useTokenPrices } from "hooks/useTokenPrices";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { t } from "services/i18n";
import { logEvent } from "services/logger";
import { IS_LEDGER_LIVE } from "settings/config";
import { ROUTES, getSwapRoute } from "settings/router";
import { useApp } from "store/app/hooks";
import { useAppSelector } from "store/store";
import { V2Providers } from "store/thorswap/api";
import type { SwapWarning } from "store/thorswap/types";
import { zeroAmount } from "types/app";
import { FeeModal } from "views/Swap/FeeModal";
import RUNEInfoContent from "views/Swap/RUNEInfoContent";
import { SwapSettings } from "views/Swap/SwapSettings";
import THORInfoContent from "views/Swap/THORInfoContent";
import { useSwapParams } from "views/Swap/hooks/useSwapParams";
import { Provider, useTokenList } from "views/Swap/hooks/useTokenList";

import { ApproveModal } from "./ApproveModal";
import { AssetInputs } from "./AssetInputs";
import { ConfirmSwapModal } from "./ConfirmSwapModal";
import { CustomRecipientInput } from "./CustomRecipientInput";
import { SwapHeader } from "./SwapHeader";
import { SwapInfo } from "./SwapInfo";
import { SwapSubmitButton } from "./SwapSubmitButton";
import { useSwap } from "./hooks/useSwap";
import { useSwapApprove } from "./hooks/useSwapApprove";
import { useSwapQuote } from "./hooks/useSwapQuote";

const baseInput = AssetValue.from({ chain: IS_LEDGER_LIVE ? Chain.Bitcoin : Chain.Ethereum });
const baseOutput = AssetValue.from({ chain: IS_LEDGER_LIVE ? Chain.Ethereum : Chain.Bitcoin });
const chainsWithSynths = [Chain.THORChain, Chain.Maya];
const SwapView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getMaxBalance } = useBalance();
  const { keystore } = useKeystore();
  const { getWallet, getWalletAddress } = useWallet();

  const isOKXPage = useMemo(
    () => location.pathname.split("/").includes("okx"),
    [location.pathname],
  );

  const { analyticsVisible, toggleAnalytics } = useApp();
  const { pair } = useParams<{ pair: string }>();
  const [inputString, outputString] = useMemo(() => (pair || "").split("_"), [pair]);

  const input = useMemo(() => {
    if (!(pair && inputString)) return baseInput;

    const [chain, synthChain, symbol] = inputString.split(".");
    const isSynth = chainsWithSynths.includes(chain as Chain) && symbol;
    const assetString = isSynth ? `${chain}.${synthChain}/${symbol}` : inputString;

    return AssetValue.from({ asset: assetString }) || baseInput;
  }, [inputString, pair]);

  const output = useMemo(() => {
    if (!(pair && outputString)) return baseOutput;

    const [chain, synthChain, symbol] = outputString.split(".");
    const isSynth = chainsWithSynths.includes(chain as Chain) && symbol;
    const assetString = isSynth ? `${chain}.${synthChain}/${symbol}` : outputString;

    return AssetValue.from({ asset: assetString }) || baseOutput;
  }, [outputString, pair]);

  const inputAsset = useMemo(() => input, [input]);
  const outputAsset = useMemo(() => output, [output]);

  useEffect(() => {
    logEvent("swap_pair", {
      sell: inputAsset.toString(),
      buy: outputAsset.toString(),
    });
  }, [inputAsset, outputAsset]);

  const [maxNewInputBalance, setMaxNewInputBalance] = useState(zeroAmount);
  const [maxInputBalance, setMaxInputBalance] = useState<AssetValue | undefined>(input.set(0));

  const [recipient, setRecipient] = useState("");
  const [isValidRecipient, setIsValidRecipient] = useState(true);
  const [walletRecipient, setWalletRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [feeModalOpened, setFeeModalOpened] = useState(false);
  const [priceImpact, setPriceImpact] = useState("0");
  const formatPrice = useFormatPrice();
  const [isChainflipBoostEnable, setIsChainflipBoostEnable] = useState(false);
  const ethAddress = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);

  const { tokens, tradingPairs } = useTokenList(true);

  const [inputToken, outputToken] = useMemo(
    () => [
      tokens.find(
        ({ chain, ticker, address }) =>
          `${chain}.${ticker}${address ? `-${address}` : ""}`.toUpperCase() ===
          `${inputAsset.chain}.${inputAsset.symbol}`.toUpperCase(),
      ),
      tokens.find(
        ({ chain, ticker, address }) =>
          `${chain}.${ticker}${address ? `-${address}` : ""}`.toUpperCase() ===
          `${outputAsset.chain}.${outputAsset.symbol}`.toUpperCase(),
      ),
    ],
    [inputAsset.chain, inputAsset.symbol, outputAsset.chain, outputAsset.symbol, tokens],
  );

  const inputAmount = useMemo(
    () =>
      new SwapKitNumber({
        value: searchParams.get("sellAmount") || "0",
        decimal: inputAsset.decimal,
      }),
    [inputAsset.decimal, searchParams],
  );

  const setInputAmount = useCallback(
    (value: SwapKitNumber) => {
      const assetAmountString = value.getValue("string");
      const assetRoutePath = location.pathname.split("?")[0];

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
    const walletRecipientAddress = getWalletAddress(outputAsset.chain);
    setRecipient(walletRecipientAddress || "");
    setWalletRecipient(walletRecipientAddress || "");
    setSender(getWalletAddress(inputAsset.chain) || "");

    // import('services/swapKit')
    //   .then(({ getSwapKitClient }) => getSwapKitClient())
    //   .then(({ getAddress }) => {
    //   });
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

  const {
    refetch: refetchPrice,
    isLoading: isPriceLoading,
    inputUnitPrice: inputUnitPriceFallback,
    outputUnitPrice: outputUnitPriceFallback,
  } = useTokenPrices([inputAsset, outputAsset]);

  //   useEffect(() => {
  //     // reset slippage if assets change
  //     if (inputAsset || outputAsset) {
  //       setSlippagePercent(0);
  //     }
  //   }, [inputAsset, outputAsset]);

  //   const providers = useMemo(() => {
  //     const outputProviders = tradingPairs.get(
  //       outputAsset.toString({ includeSynthProtocol: true }).toLowerCase(),
  //     )?.providers;
  //     const inputProviders = tradingPairs.get(
  //       inputAsset.toString({ includeSynthProtocol: true }).toLowerCase(),
  //     )?.providers;
  //     const commonProviders = outputProviders?.filter((provider) =>
  //       inputProviders?.includes(provider),
  //     );

  //     return commonProviders || [];
  //   }, [tradingPairs, outputAsset, inputAsset]);

  const {
    affiliateBasisPoints,
    estimatedTime,
    isFetching,
    refetch: refetchQuote,
    routes,
    error,
    selectedRoute: selectedRouteRaw,
    setSwapRoute,
    quoteId,
    vTHORDiscount,
  } = useSwapQuote({
    ethAddress,
    inputAmount,
    inputAsset,
    inputUSDPrice: inputUnitPriceFallback,
    outputAsset,
    recipientAddress: recipient || walletRecipient,
    senderAddress: sender,
  });

  const inputUnitPrice = useMemo(() => {
    return (
      (selectedRouteRaw as unknown as QuoteResponseRoute)?.meta?.assets?.find(
        (asset) => asset.asset.toUpperCase() === inputAsset.toString().toUpperCase(),
      )?.price || inputUnitPriceFallback
    );
  }, [selectedRouteRaw, inputUnitPriceFallback]);

  const outputUnitPrice = useMemo(() => {
    return (
      (selectedRouteRaw as unknown as QuoteResponseRoute)?.meta?.assets?.find(
        (asset) => asset.asset.toUpperCase() === outputAsset.toString().toUpperCase(),
      )?.price || outputUnitPriceFallback
    );
  }, [selectedRouteRaw, outputUnitPriceFallback]);

  const isChainflip = useMemo(
    () => selectedRouteRaw?.providers?.includes("CHAINFLIP"),
    [selectedRouteRaw?.providers],
  );

  const isMayaSpecial = useMemo(
    () => selectedRouteRaw?.providers?.includes("MAYACHAIN"),
    [selectedRouteRaw?.providers],
  );

  const noPriceProtection = useMemo(
    () =>
      [Chain.Litecoin, Chain.Dogecoin, Chain.BitcoinCash, Chain.Dash].includes(inputAsset.chain) &&
      getWallet(inputAsset.chain)?.walletType === WalletOption.LEDGER,
    [getWallet, inputAsset.chain],
  );

  const inputUSDPrice = useMemo(
    () => inputAmount.mul(inputUnitPrice).getValue("number"),
    [inputAmount, inputUnitPrice],
  );

  const amountTooLowForLimit = useMemo(
    () =>
      selectedRouteRaw &&
      new SwapKitNumber({
        value:
          inputUSDPrice ||
          selectedRouteRaw.expectedOutputUSD ||
          // @ts-expect-error TODO fix typing v2 quotes
          selectedRouteRaw.expectedBuyAmountUSD ||
          0,
      }).lte(500),
    [selectedRouteRaw, inputUSDPrice],
  );

  // TODO remove after full v2 migration
  const highValueImpact = useMemo(() => {
    if (!(selectedRouteRaw?.calldata && inputUSDPrice)) return false;
    const buyAmountUSD = new SwapKitNumber(selectedRouteRaw.expectedOutputUSD);
    const priceImpact = buyAmountUSD.div(inputUSDPrice).sub(1).mul(100);
    setPriceImpact(priceImpact.toFixed(2));
    return buyAmountUSD && priceImpact.lt("-5");
  }, [selectedRouteRaw, inputUSDPrice]);

  const {
    streamSwap,
    canStreamSwap,
    minReceive,
    outputAmount,
    fees,
    route: selectedRoute,
    streamingSwapParams,
    setStreamingSwapParams,
    slippagePercent,
    defaultInterval,
  } = useSwapParams({
    selectedRoute: selectedRouteRaw,
    inputAmount,
    noPriceProtection,
    outputAsset,
    isChainflip,
    noSlipProtection: amountTooLowForLimit,
  });

  const outputUSDPrice = useMemo(
    () => outputAmount.mul(outputUnitPrice).getValue("number"),
    [outputUnitPrice, outputAmount],
  );

  //   const { isApproved, isLoading } = useIsAssetApproved({
  //     assetValue: inputAsset.set(inputAmount.getValue('string')),
  //     contract:
  //       selectedRoute?.approvalTarget ||
  //       selectedRoute?.allowanceTarget ||
  //       selectedRoute?.targetAddress ||
  //       selectedRoute?.providers[0].toLowerCase(),
  //   });

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

  const { approvalTarget, allowanceTarget, targetAddress, meta } = selectedRoute || {};

  const quoteMode = useMemo(
    () => (selectedRoute?.meta?.quoteMode || "") as QuoteMode,
    [selectedRoute?.meta?.quoteMode],
  );

  const { firstNetworkFee, affiliateFee, networkFee, totalFee } = useRouteFees(fees);

  const handleApprove = useSwapApprove({
    contract:
      //@ts-expect-error TODO fix typing v2 quotes
      meta?.approvalAddress ||
      approvalTarget ||
      allowanceTarget ||
      targetAddress ||
      selectedRoute?.providers?.[0],
    inputAsset,
  });

  const feeAssets = useMemo(() => {
    const assets = Object.values(fees || {})
      .flat()
      .map(({ asset }) => new AssetValue({ identifier: asset, decimal: 2, value: 0 }).ticker);

    return Array.from(new Set(assets)).join(", ");
  }, [fees]);

  const handleSelectAsset = useCallback(
    (type: "input" | "output") => async (asset: AssetValue) => {
      const isInput = type === "input";
      const input = isInput ? asset : asset.eqAsset(inputAsset) ? outputAsset : inputAsset;
      const output = isInput ? (asset.eqAsset(outputAsset) ? inputAsset : outputAsset) : asset;

      if (isInput) {
        const maxNewInputBalance = (await getMaxBalance(asset)) || zeroAmount;
        setInputAmount(
          inputAmount.gt(maxNewInputBalance)
            ? new SwapKitNumber({
                value: maxNewInputBalance.getValue("string"),
                decimal: maxNewInputBalance.decimal,
              })
            : inputAmount,
        );
      }

      const route = getSwapRoute(input, output, isOKXPage ? ROUTES.Okx : ROUTES.Swap);

      navigate(`${route}?sellAmount=${inputAmount.getValue("string")}`);
    },
    [getMaxBalance, inputAmount, inputAsset, isOKXPage, navigate, outputAsset, setInputAmount],
  );

  const handleSwitchPair = useCallback(
    (unsupportedOutput?: boolean) => {
      setMaxNewInputBalance(
        outputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : outputAmount,
      );
      const defaultAsset = isETHAsset(outputAsset)
        ? AssetValue.fromChainOrSignature(IS_LEDGER_LIVE ? Chain.Bitcoin : "ETH.THOR")
        : AssetValue.from({ chain: Chain.Ethereum });
      const output = unsupportedOutput ? defaultAsset : inputAsset;

      const route = getSwapRoute(outputAsset, output, isOKXPage ? ROUTES.Okx : ROUTES.Swap);

      navigate(`${route}?sellAmount=${outputAmount.getValue("string")}`);
    },
    [outputAmount, maxNewInputBalance, outputAsset, inputAsset, isOKXPage, navigate],
  );

  const refetchData = useCallback(() => {
    refetchPrice();
    refetchQuote();
  }, [refetchPrice, refetchQuote]);

  const handleSwap = useSwap({
    inputAsset: AssetValue.from({
      asset: inputAsset.toString({ includeSynthProtocol: true }),
      value: inputAmount.getValue("string"),
    }),
    outputAsset: AssetValue.from({
      asset: outputAsset.toString({ includeSynthProtocol: true }),
      value: outputAmount.getValue("string"),
    }),
    quoteMode,
    recipient,
    route: selectedRoute as unknown as QuoteRoute,
    quoteId,
    streamSwap,
    isChainflipBoostEnable,
  });

  useEffect(() => {
    setMaxInputBalance(undefined);
    getMaxBalance(inputAsset).then((maxBalance) => setMaxInputBalance(maxBalance));
  }, [inputAsset, getMaxBalance]);

  const minReceiveInfo = useMemo(
    () =>
      minReceive.gte(0)
        ? `${minReceive.toSignificant(6)} ${outputAsset.ticker.toUpperCase()}`
        : "-",
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
    () => outputAsset.ticker.includes("THOR") && outputAsset.chain === Chain.Avalanche,
    [outputAsset],
  );
  const isEthRUNE = useMemo(
    () => outputAsset.ticker === "RUNE" && outputAsset.chain === Chain.Ethereum,
    [outputAsset],
  );

  const tokenOutputWarning = useMemo(() => isAvaxTHOR || isEthRUNE, [isAvaxTHOR, isEthRUNE]);

  const tokenOutputContent = useMemo(() => {
    if (isAvaxTHOR) {
      return <THORInfoContent inputAsset={inputAsset} />;
    }
    if (isEthRUNE) {
      return <RUNEInfoContent inputAsset={inputAsset} />;
    }

    return null;
  }, [inputAsset, isAvaxTHOR, isEthRUNE]);

  const invalidSwap = useMemo(
    () => (maxInputBalance ? inputAmount.gt(maxInputBalance) : false),
    [inputAmount, maxInputBalance],
  );

  const assetTickers = useMemo(
    () => [inputAsset.ticker, outputAsset.ticker] as [string, string],
    [inputAsset.ticker, outputAsset.ticker],
  );

  const onInputAmountChange = useCallback(() => handleSelectAsset("input"), [handleSelectAsset]);
  const onOutputAmountChange = useCallback(() => handleSelectAsset("output"), [handleSelectAsset]);

  const isWidget = useAppSelector(({ app }) => app.iframeData?.isWidget);

  const swapWarnings: SwapWarning[] = streamSwap
    ? selectedRoute?.streamingSwap?.warnings
    : // @ts-ignore TODO add typings for new v2 response
      selectedRoute?.warnings;

  return (
    <Flex alignSelf="center" gap={3} w="full">
      <Flex flex={1} justify="center" transition={easeInOutTransition}>
        <PanelView
          description={t("views.swap.description", {
            inputAsset: inputAsset.ticker.toUpperCase(),
            outputAsset: outputAsset.ticker.toUpperCase(),
          })}
          header={
            isWidget ? null : (
              <SwapHeader
                inputAssetChain={inputAsset.chain}
                isSidebarVisible={analyticsVisible}
                refetchData={
                  !selectedRoute || isFetching || isPriceLoading ? undefined : refetchData
                }
                toggleSidebar={() => toggleAnalytics(!analyticsVisible)}
              />
            )
          }
          keywords={`${inputAsset.ticker}, ${outputAsset.ticker}, SWAP, THORSwap, THORChain, DEX, DeFi`}
          title={`${t("common.swap")} ${inputAsset.ticker} to ${outputAsset.ticker}`}
        >
          <AssetInputs
            inputAsset={inputAssetProps}
            onInputAmountChange={setInputAmount}
            onInputAssetChange={onInputAmountChange()}
            onOutputAssetChange={onOutputAmountChange()}
            onSwitchPair={handleSwitchPair}
            outputAsset={outputAssetProps}
            tokens={tokens}
            tradingPairs={
              tradingPairs.get(inputAsset.toString().toLowerCase()) || {
                tokens: tokens,
                providers: [Provider.V1_PROVIDERS, Provider.CHAINFLIP, Provider.MAYACHAIN],
              }
            }
          />
          {!IS_LEDGER_LIVE && isInputWalletConnected && (
            <CustomRecipientInput
              isOutputWalletConnected={isOutputWalletConnected}
              outputAssetChain={outputAsset.chain}
              recipient={recipient || walletRecipient}
              setIsValidRecipient={setIsValidRecipient}
              setRecipient={setRecipient}
            />
          )}

          <SwapInfo
            affiliateBasisPoints={Number(isMayaSpecial ? 0 : affiliateBasisPoints)}
            affiliateFee={affiliateFee}
            assets={assetTickers}
            expectedOutput={`${outputAmount?.toSignificant(6)} ${outputAsset.ticker.toUpperCase()}`}
            inputUnitPrice={inputUnitPrice}
            isLoading={isPriceLoading}
            minReceive={minReceiveInfo}
            minReceiveSlippage={slippagePercent}
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
              content={t("views.swap.priceProtectionUnavailableDesc", {
                chain: inputAsset.chain,
              })}
              title={t("views.swap.priceProtectionUnavailable")}
              type="warn"
            />
          )}

          <SwapRouter
            outputAsset={outputAsset}
            outputUnitPrice={outputUnitPrice}
            routes={routes}
            selectedRoute={selectedRoute}
            setSwapRoute={setSwapRoute}
            streamSwap={streamSwap}
          />

          {(!isWidget || !!selectedRoute) && (
            <SwapSettings
              canStreamSwap={canStreamSwap}
              defaultInterval={defaultInterval}
              isChainflip={isChainflip}
              isChainflipBoostEnable={isChainflipBoostEnable}
              setIsChainflipBoostEnable={setIsChainflipBoostEnable}
              minReceive={minReceive}
              noSlipProtection={amountTooLowForLimit || noPriceProtection}
              onSettingsChange={setStreamingSwapParams}
              outputAmount={outputAmount}
              outputAsset={outputAsset}
              route={selectedRoute}
              streamSwap={streamSwap}
              streamingSwapParams={streamingSwapParams}
            />
          )}

          {
            // @ts-ignore TODO add typings for new v2 response
            swapWarnings?.map((warning: { code: string; display: string; tooltip: string }) => (
              <InfoTip
                className="!mt-2"
                key={warning.code}
                title={
                  warning.code === "highPriceImpact" ? (
                    <Box row className="pl-4 self-stretch w-[100%]" justify="between">
                      <Text>{t(`views.swap.warning.${warning.code}`)}</Text>{" "}
                      <Text color="red">{warning.display}</Text>
                    </Box>
                  ) : (
                    t(`views.swap.warning.${warning.code}`)
                  )
                }
                tooltip={warning.tooltip}
                type="warn"
              />
            ))
          }

          {highValueImpact &&
            !streamSwap &&
            !selectedRoute?.providers.some((provider) => V2Providers.includes(provider)) && (
              <InfoTip
                className="!mt-2"
                key="highValueImpact-v1"
                title={
                  <Box row className="pl-4 self-stretch w-[100%]" justify="between">
                    <Text>{t("views.swap.warning.highPriceImpact")}</Text>{" "}
                    <Text color="red">{`${priceImpact}%`}</Text>
                  </Box>
                }
                tooltip={t("views.swap.warning.highPriceImpactTooltip")}
                type="warn"
              />
            )}

          {amountTooLowForLimit && !isChainflip && (
            <InfoTip
              className="!mt-2"
              key="amountTooLowForLimit"
              title={t("views.swap.priceProtectionUnavailable")}
              type="warn"
            />
          )}

          <SwapSubmitButton
            hasQuote={!!selectedRoute}
            inputAmount={inputAmount}
            inputAsset={inputAsset}
            invalidSwap={invalidSwap}
            isApproved={!!selectedRoute?.isApproved}
            isInputWalletConnected={isInputWalletConnected}
            isLoading={(isFetching || isPriceLoading) && !error}
            outputAsset={outputAsset}
            quoteError={!!error}
            recipient={isValidRecipient ? recipient || walletRecipient : null}
            setVisibleApproveModal={setVisibleApproveModal}
            setVisibleConfirmModal={setVisibleConfirmModal}
          />
          <ConfirmSwapModal
            affiliateFee={formatPrice(affiliateFee)}
            estimatedTime={estimatedTime}
            feeAssets={feeAssets}
            handleSwap={handleSwap}
            inputAssetProps={inputAssetProps}
            isChainflip={isChainflip}
            minReceive={minReceiveInfo}
            outputAssetProps={outputAssetProps}
            recipient={recipient}
            selectedRoute={selectedRoute}
            setVisible={setVisibleConfirmModal}
            slippagePercent={
              isChainflip ? 5 : amountTooLowForLimit || noPriceProtection ? 0 : slippagePercent
            }
            streamSwap={streamSwap}
            totalFee={formatPrice(totalFee)}
            visible={visibleConfirmModal}
          />
          <ApproveModal
            balance={maxInputBalance}
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
      </Flex>

      <Analysis
        analyticsVisible={analyticsVisible}
        inputAssetChain={inputAsset.chain}
        toggleAnalytics={toggleAnalytics}
      />
    </Flex>
  );
};

export default SwapView;
