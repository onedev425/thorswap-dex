import { Box, Flex } from '@chakra-ui/react';
import { QuoteRoute } from '@thorswap-lib/swapkit-api';
import { AssetEntity, getSignatureAssetFor, QuoteMode } from '@thorswap-lib/swapkit-core';
import { BaseDecimal, Chain, WalletOption } from '@thorswap-lib/types';
import { Analysis } from 'components/Analysis/Analysis';
import { easeInOutTransition } from 'components/constants';
import { InfoTip } from 'components/InfoTip';
import { PanelView } from 'components/PanelView';
import { SwapRouter } from 'components/SwapRouter';
import { AVAX_AGG_PROXY_ADDRESS, ETH_AGG_PROXY_ADDRESS } from 'config/constants';
import { isAVAXAsset, isETHAsset } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { hasWalletConnected } from 'helpers/wallet';
import { useBalance } from 'hooks/useBalance';
import { useVTHORBalance } from 'hooks/useHasVTHOR';
import { useRouteFees } from 'hooks/useRouteFees';
import { useSlippage } from 'hooks/useSlippage';
import { useSwapTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { IS_DEV_API, IS_PROD } from 'settings/config';
import { getKyberSwapRoute, getSwapRoute } from 'settings/router';
import { useApp } from 'store/app/hooks';
import { useWallet } from 'store/wallet/hooks';
import { FeeModal } from 'views/Swap/FeeModal';
import { useKyberSwap } from 'views/Swap/hooks/useKyberSwap';
import { useTokenList } from 'views/Swap/hooks/useTokenList';
import RUNEInfoContent from 'views/Swap/RUNEInfoContent';
import THORInfoContent from 'views/Swap/THORInfoContent';

import { ApproveModal } from './ApproveModal';
import { AssetInputs } from './AssetInputs';
import { ConfirmSwapModal } from './ConfirmSwapModal';
import { CustomRecipientInput } from './CustomRecipientInput';
import { useIsAssetApproved } from './hooks/useIsAssetApproved';
import { useSwap } from './hooks/useSwap';
import { useSwapApprove } from './hooks/useSwapApprove';
import { useSwapPair } from './hooks/useSwapPair';
import { useSwapQuote } from './hooks/useSwapQuote';
import { SwapHeader } from './SwapHeader';
import { SwapInfo } from './SwapInfo';
import { SwapSubmitButton } from './SwapSubmitButton';

const SwapView = () => {
  const navigate = useNavigate();
  const { getMaxBalance } = useBalance();
  const { inputAmount, setInputAmount, inputAsset, outputAsset } = useSwapPair();
  const { wallet, keystore } = useWallet();
  const { analyticsVisible, toggleAnalytics } = useApp();

  const [recipient, setRecipient] = useState('');
  const [sender, setSender] = useState('');
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [feeModalOpened, setFeeModalOpened] = useState(false);
  const formatPrice = useFormatPrice({ groupSize: 0 });

  const { tokens } = useTokenList();

  useEffect(() => {
    import('services/swapKit')
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getAddress }) => {
        setRecipient(getAddress(outputAsset.L1Chain) || '');
        setSender(getAddress(inputAsset.L1Chain) || '');
      });
  }, [inputAsset.L1Chain, outputAsset, wallet]);

  useEffect(() => {
    const inputToken = tokens.find(
      ({ identifier }) => identifier === `${inputAsset.L1Chain}.${inputAsset.ticker}`,
    );
    const outputToken = tokens.find(
      ({ identifier }) => identifier === `${outputAsset.L1Chain}.${outputAsset.ticker}`,
    );
    const inputDecimal =
      isETHAsset(inputAsset) || isAVAXAsset(inputAsset) ? BaseDecimal.ETH : inputToken?.decimals;
    const outputDecimal =
      isETHAsset(outputAsset) || isAVAXAsset(outputAsset) ? BaseDecimal.ETH : outputToken?.decimals;

    if (tokens.length) {
      inputAsset.setDecimal(inputDecimal);
      outputAsset.setDecimal(outputDecimal);
    }
  }, [inputAsset, outputAsset, tokens]);

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);
  const VTHORBalance = useVTHORBalance(ethAddr);

  const affiliateBasisPoints = useMemo(() => {
    if ((!IS_PROD && !IS_DEV_API) || VTHORBalance >= 500_000) return '0';
    if (VTHORBalance >= 100_000) return '10';
    if (VTHORBalance >= 10_000) return '15';
    if (VTHORBalance >= 1_000) return '25';
    return '30';
  }, [VTHORBalance]);

  const {
    estimatedTime,
    isFetching,
    minReceive,
    outputAmount,
    refetch: refetchQuote,
    routes,
    selectedRoute,
    setSwapRoute,
    quoteId,
  } = useSwapQuote({
    affiliateBasisPoints,
    inputAmount,
    inputAsset,
    outputAsset,
    senderAddress: sender,
    recipientAddress: recipient,
  });

  const { isKyberSwapPage, kyberRoutes } = useKyberSwap({
    routes,
  });

  const {
    prices: { inputUSDPrice, outputUSDPrice },
    isLoading: isPriceLoading,
    refetch: refetchPrice,
  } = useSwapTokenPrices({ inputAmount, inputAsset, outputAmount, outputAsset });

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
      value: inputAmount,
      balance: inputAssetBalance,
      usdPrice: inputUSDPrice,
      priceLoading: isPriceLoading,
    }),
    [inputAsset, inputAmount, inputAssetBalance, inputUSDPrice, isPriceLoading],
  );

  const outputAssetProps = useMemo(
    () => ({
      asset: outputAsset,
      value: outputAmount,
      usdPrice: outputUSDPrice,
      loading: isFetching,
      priceLoading: isPriceLoading || isFetching,
    }),
    [outputAsset, outputAmount, outputUSDPrice, isFetching, isPriceLoading],
  );

  const { fees, contract: contractAddress } = selectedRoute || {};
  const quoteMode = useMemo(
    () => (selectedRoute?.meta?.quoteMode || '') as QuoteMode,
    [selectedRoute?.meta?.quoteMode],
  );

  const { firstNetworkFee, affiliateFee, networkFee, totalFee } = useRouteFees(fees);

  const contract = useMemo(
    () =>
      [QuoteMode.ETH_TO_ETH, QuoteMode.AVAX_TO_AVAX].includes(quoteMode)
        ? contractAddress
        : [QuoteMode.AVAX_TO_ETH, QuoteMode.AVAX_TO_TC_SUPPORTED].includes(quoteMode)
        ? AVAX_AGG_PROXY_ADDRESS
        : [QuoteMode.ETH_TO_AVAX, QuoteMode.ETH_TO_TC_SUPPORTED].includes(quoteMode)
        ? ETH_AGG_PROXY_ADDRESS
        : undefined,
    [quoteMode, contractAddress],
  );

  const { isApproved, isLoading: isApproveAssetLoading } = useIsAssetApproved({
    force: true,
    asset: inputAsset,
    contract,
    amount: inputAmount,
  });
  const handleApprove = useSwapApprove({ contract, inputAsset });

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

      navigate(!isKyberSwapPage ? getSwapRoute(input, output) : getKyberSwapRoute(input, output));
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
        ? getSignatureAssetFor('ETH_THOR')
        : getSignatureAssetFor(Chain.Ethereum);
      const output = unsupportedOutput ? defaultAsset : inputAsset;
      navigate(
        !isKyberSwapPage
          ? getSwapRoute(outputAsset, output)
          : getKyberSwapRoute(outputAsset, output),
      );
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
  const noPriceProtection = useMemo(
    () =>
      [Chain.Litecoin, Chain.Doge, Chain.BitcoinCash].includes(inputAsset.L1Chain) &&
      wallet?.[inputAsset.L1Chain]?.walletType === WalletOption.LEDGER,
    [inputAsset.L1Chain, wallet],
  );

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

          <CustomRecipientInput
            isOutputWalletConnected={isOutputWalletConnected}
            outputAssetL1Chain={outputAsset.L1Chain}
            recipient={recipient}
            setRecipient={setRecipient}
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

          <SwapRouter
            outputAsset={outputAsset}
            outputUSDPrice={outputUSDPrice}
            routes={!isKyberSwapPage ? routes : kyberRoutes}
            selectedRoute={!isKyberSwapPage ? selectedRoute : kyberRoutes[0]}
            setSwapRoute={setSwapRoute}
            slippage={slippage}
          />

          <SwapSubmitButton
            hasQuote={!!selectedRoute}
            inputAmount={inputAmount}
            inputAsset={inputAsset}
            invalidSwap={invalidSwap}
            isApproved={isApproved}
            isInputWalletConnected={isInputWalletConnected}
            isLoading={isFetching || isPriceLoading || isApproveAssetLoading}
            outputAsset={outputAsset}
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

      {!IS_PROD && (
        <Analysis
          analyticsVisible={analyticsVisible}
          inputAssetChain={inputAsset.L1Chain}
          toggleAnalytics={toggleAnalytics}
        />
      )}
    </Flex>
  );
};

export default SwapView;
