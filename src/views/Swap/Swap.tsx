import { Amount, Asset, hasWalletConnected, QuoteMode } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { PanelView } from 'components/PanelView';
import { SwapRouter } from 'components/SwapRouter';
import { TS_AGGREGATOR_PROXY_ADDRESS } from 'config/constants';
import { useFormatPrice } from 'helpers/formatPrice';
import { useBalance } from 'hooks/useBalance';
import { useSlippage } from 'hooks/useSlippage';
import { useVthorBalance } from 'hooks/useVthorBalance';
import uniq from 'lodash/uniq';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { getSwapRoute } from 'settings/constants';
import { useWallet } from 'store/wallet/hooks';
import { FeeModal } from 'views/Swap/FeeModal';
import { RouteFee } from 'views/Swap/types';

import { ApproveModal } from './ApproveModal';
import { AssetInputs } from './AssetInputs';
import { ConfirmSwapModal } from './ConfirmSwapModal';
import { CustomRecipientInput } from './CustomRecipientInput';
import { useIsAssetApproved } from './hooks/useIsAssetApproved';
import { useSwap } from './hooks/useSwap';
import { useSwapApprove } from './hooks/useSwapApprove';
import { useSwapPair } from './hooks/useSwapPair';
import { useSwapQuote } from './hooks/useSwapQuote';
import { useSwapTokenPrices } from './hooks/useSwapTokenPrices';
import { SwapHeader } from './SwapHeader';
import { SwapInfo } from './SwapInfo';
import { SwapSubmitButton } from './SwapSubmitButton';

const SwapView = () => {
  const navigate = useNavigate();
  const { getMaxBalance } = useBalance();
  const { inputAmount, setInputAmount, inputAsset, outputAsset } = useSwapPair();
  const { wallet, keystore } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [visibleConfirmModal, setVisibleConfirmModal] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [feeModalOpened, setFeeModalOpened] = useState(false);
  const formatPrice = useFormatPrice({ groupSize: 0 });

  useEffect(() => {
    const address = multichain().getWalletAddressByChain(outputAsset.L1Chain);
    setRecipient(address || '');
  }, [outputAsset, wallet]);

  const senderAddress = useMemo(
    () => multichain().getWalletAddressByChain(inputAsset.L1Chain) || '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputAsset, wallet],
  );

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);
  const { hasVThor } = useVthorBalance(ethAddr);

  const {
    estimatedTime,
    isFetching,
    minReceive,
    outputAmount,
    quoteMode,
    refetch: refetchQuote,
    routes,
    selectedRoute,
    setSwapRoute,
  } = useSwapQuote({
    skipAffiliate: hasVThor,
    inputAmount,
    inputAsset,
    outputAsset,
    senderAddress,
    recipientAddress: recipient,
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

  const contract = useMemo(
    () =>
      (quoteMode === QuoteMode.ETH_TO_ETH && selectedRoute?.contract) ||
      TS_AGGREGATOR_PROXY_ADDRESS,
    [quoteMode, selectedRoute?.contract],
  );

  const { isApproved, isLoading: isApproveAssetLoading } = useIsAssetApproved({
    force: true,
    asset: inputAsset,
    contract,
    quoteMode,
  });

  // @ts-expect-error cross-chain-api-sdk
  const routeFees: RouteFee | undefined = selectedRoute?.fees;

  const { affiliateFee, networkFee, totalFee } = useMemo(() => {
    if (!routeFees) {
      return { affiliateFee: 0, networkFee: 0, totalFee: 0 };
    }

    const feesData = Object.values(routeFees || {}).flat();

    const emptyFees = { affiliateFee: 0, networkFee: 0, totalFee: 0 };
    if (feesData.length === 0) return emptyFees;

    const fees = feesData.reduce((acc, fee) => {
      acc.affiliateFee += fee.affiliateFeeUSD;
      acc.networkFee += fee.networkFeeUSD;

      return acc;
    }, emptyFees);

    const affiliateFee = hasVThor ? 0 : fees.affiliateFee;

    return {
      affiliateFee,
      networkFee: fees.networkFee,
      totalFee: affiliateFee + fees.networkFee,
    };
  }, [hasVThor, routeFees]);

  const feeAssets = useMemo(
    () =>
      uniq(
        Object.values(routeFees || {})
          .flat()
          .map(({ asset }) => asset.split('.')[1]),
      ).join(', '),
    [routeFees],
  );

  const handleSelectAsset = useCallback(
    (type: 'input' | 'output') => (asset: Asset) => {
      const isInput = type === 'input';
      const input = !isInput ? (asset.eq(inputAsset) ? outputAsset : inputAsset) : asset;
      const output = isInput ? (asset.eq(outputAsset) ? inputAsset : outputAsset) : asset;

      if (isInput) {
        const maxNewInputBalance = getMaxBalance(asset);
        setInputAmount(inputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : inputAmount);
      }

      navigate(getSwapRoute(input, output));
    },
    [getMaxBalance, inputAmount, inputAsset, navigate, outputAsset, setInputAmount],
  );

  const handleSwitchPair = useCallback(
    (unsupportedOutput?: boolean) => {
      const maxNewInputBalance = getMaxBalance(outputAsset);
      setInputAmount(outputAmount.gt(maxNewInputBalance) ? maxNewInputBalance : outputAmount);
      const defaultAsset = outputAsset.isRUNE() ? Asset.BTC() : Asset.RUNE();

      navigate(getSwapRoute(outputAsset, unsupportedOutput ? defaultAsset : inputAsset));
    },
    [getMaxBalance, outputAsset, setInputAmount, outputAmount, navigate, inputAsset],
  );

  const changeOutputToSynth = useCallback(() => {
    navigate(getSwapRoute(inputAsset, Asset.ETH()));
  }, [inputAsset, navigate]);

  const handleChangeInputAmount = useCallback(
    (amount: Amount) => {
      setInputAmount(isApproved ? (amount.gt(maxInputBalance) ? maxInputBalance : amount) : amount);
    },
    [isApproved, maxInputBalance, setInputAmount],
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
    recipient: multichain().validateAddress({
      chain: inputAsset.L1Chain,
      address: recipient,
    })
      ? recipient
      : '',
    route: selectedRoute,
  });

  const handleApprove = useSwapApprove({
    contract,
    inputAsset,
    quoteMode,
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

  const noSlipProtection = useMemo(
    () => inputAsset.isUTXOAsset() && quoteMode === QuoteMode.TC_SUPPORTED_TO_ETH,
    [inputAsset, quoteMode],
  );

  const showTransactionFeeSelect = useMemo(
    () => isInputWalletConnected && inputAsset.L1Chain === Chain.Ethereum && !!keystore,
    [inputAsset.L1Chain, isInputWalletConnected, keystore],
  );

  return (
    <PanelView
      header={
        <SwapHeader
          asset={inputAsset.isRUNE() ? outputAsset : inputAsset}
          isLoading={isFetching || isPriceLoading}
          refetchData={refetchData}
        />
      }
      title={`${t('common.swap')} ${inputAsset.name} >> ${outputAsset.name}`}
    >
      <AssetInputs
        inputAsset={inputAssetProps}
        onInputAmountChange={handleChangeInputAmount}
        onInputAssetChange={handleSelectAsset('input')}
        onOutputAssetChange={handleSelectAsset('output')}
        onSwitchPair={handleSwitchPair}
        outputAsset={outputAssetProps}
      />

      <CustomRecipientInput
        isOutputWalletConnected={isOutputWalletConnected}
        outputAssetL1Chain={outputAsset.L1Chain}
        recipient={recipient}
        setRecipient={setRecipient}
      />

      <SwapInfo
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

      <SwapRouter
        inputAsset={inputAsset}
        outputAsset={outputAsset}
        outputUSDPrice={outputUSDPrice}
        quoteMode={quoteMode}
        routes={routes}
        selectedRoute={selectedRoute}
        setSwapRoute={setSwapRoute}
        slippage={slippage}
      />

      <Box
        className={classNames('overflow-hidden w-full h-[0px] transition-all', {
          '!h-[125px] pt-3': noSlipProtection,
        })}
        onClick={changeOutputToSynth}
      >
        <InfoTip
          className="w-full"
          content={t('views.swap.noSlipProtectionDesc')}
          title={t('views.swap.swapProtectionUnavailable')}
          type="warn"
        />
      </Box>

      <SwapSubmitButton
        hasQuote={!!selectedRoute}
        inputAmount={inputAmount}
        inputAsset={inputAsset}
        isApproved={isApproved}
        isInputWalletConnected={isInputWalletConnected}
        isLoading={isFetching || isPriceLoading || isApproveAssetLoading}
        outputAsset={outputAsset}
        recipient={recipient}
        setVisibleApproveModal={setVisibleApproveModal}
        setVisibleConfirmModal={setVisibleConfirmModal}
        swapAmountTooSmall={inputUSDPrice.price.lte(totalFee)}
      />

      <ConfirmSwapModal
        affiliateFee={formatPrice(affiliateFee)}
        estimatedTime={estimatedTime}
        feeAssets={feeAssets}
        handleSwap={handleSwap}
        inputAssetProps={inputAssetProps}
        minReceive={minReceiveInfo}
        noSlipProtection={noSlipProtection}
        outputAssetProps={outputAssetProps}
        recipient={recipient}
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
        totalFee={formatPrice(totalFee)}
        visible={visibleApproveModal}
      />

      <FeeModal
        fees={routeFees}
        isOpened={feeModalOpened}
        onClose={() => setFeeModalOpened(false)}
        totalFee={formatPrice(totalFee)}
      />
    </PanelView>
  );
};

export default SwapView;
