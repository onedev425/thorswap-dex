import { Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Amount, AssetAmount, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import { Box, Card, Icon, Tooltip } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoTable } from 'components/InfoTable';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { useLendingAssets } from 'views/Lending/useLendingAssets';

import { ActionButton } from './ActionButton';
import { BorrowPositionsTab } from './BorrowPositionsTab';
import { LendingConfirmModal } from './LendingConfirmModal';
import { LendingTab, LendingViewTab } from './types';
import { useBorrow } from './useBorrow';

const Borrow = () => {
  const appDispatch = useAppDispatch();
  const { lendingAssets } = useLendingAssets();
  const listAssets = useAssetsWithBalance(lendingAssets);

  const { getMaxBalance } = useBalance();
  const { isChainHalted } = useMimir();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [collateralAsset, setCollateralAsset] = useState(getSignatureAssetFor(Chain.Bitcoin));
  const [borrowAsset, setBorrowAsset] = useState(getSignatureAssetFor(Chain.Bitcoin));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(LendingTab.Borrow);
  const [viewTab, setViewTab] = useState(LendingViewTab.Borrow);
  const collateralUsdPrice = usePoolAssetPriceInUsd({ asset: collateralAsset, amount });
  const isBorrow = tab === LendingTab.Borrow;

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.L1Chain]?.address || '',
    [wallet, collateralAsset.L1Chain],
  );
  const borrowAddress = useMemo(
    () => wallet?.[borrowAsset.L1Chain]?.address || '',
    [wallet, borrowAsset.L1Chain],
  );

  const {
    expectedOutput,
    expectedOutputMaxSlippage: slippage,
    memo,
    hasError,
  } = useBorrow({
    senderAddress: collateralAddress,
    recipientAddress: borrowAddress,
    amount: amount.assetAmount.toNumber(),
    assetIn: `${collateralAsset.chain}.${collateralAsset.chain}`,
    assetOut: `${borrowAsset.chain}.${borrowAsset.chain}`,
  });
  const borrowUsdPrice = usePoolAssetPriceInUsd({
    asset: borrowAsset,
    amount: expectedOutput,
  });

  const collaterallBalance = useMemo(
    () => (collateralAddress ? getMaxBalance(collateralAsset) : undefined),
    [collateralAddress, collateralAsset, getMaxBalance],
  );
  const borrowBalance = useMemo(
    () => (borrowAddress ? getMaxBalance(borrowAsset) : undefined),
    [borrowAddress, borrowAsset, getMaxBalance],
  );

  const handleSwapkitAction = useCallback(async () => {
    const { openLoan, closeLoan } = await (await import('services/swapKit')).getSwapKitClient();

    return isBorrow
      ? openLoan({
          assetAmount: new AssetAmount(collateralAsset, amount),
          assetTicker: `${borrowAsset.getAssetObj().chain}.${borrowAsset.getAssetObj().ticker}`,
          memo,
        })
      : closeLoan({
          assetAmount: new AssetAmount(collateralAsset, amount),
          assetTicker: `${borrowAsset.getAssetObj().chain}.${borrowAsset.getAssetObj().ticker}`,
        });
  }, [amount, collateralAsset, isBorrow, borrowAsset, memo]);

  const handleBorrowSubmit = useCallback(
    async (expectedAmount: string) => {
      setIsConfirmOpen(false);

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          label: t(isBorrow ? 'txManager.openLoan' : 'txManager.closeLoan', {
            asset: collateralAsset.name,
            amount: expectedAmount,
          }),
          type: isBorrow ? TransactionType.TC_SAVINGS_ADD : TransactionType.TC_SAVINGS_WITHDRAW,
          inChain: collateralAsset.L1Chain,
        }),
      );

      try {
        const txid = await handleSwapkitAction();
        setAmount(Amount.fromAssetAmount(0, 8));
        if (txid) appDispatch(updateTransaction({ id, txid }));
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [appDispatch, collateralAsset.L1Chain, collateralAsset.name, handleSwapkitAction, isBorrow],
  );

  const buttonDisabled = useMemo(
    () =>
      amount.lte(Amount.fromAssetAmount(0, 8)) ||
      (isBorrow && collaterallBalance && amount.gt(collaterallBalance)) ||
      isChainHalted[collateralAsset.L1Chain],
    [amount, collateralAsset.L1Chain, collaterallBalance, isChainHalted, isBorrow],
  );

  const tabLabel = tab === LendingTab.Borrow ? t('common.borrow') : t('common.repay');
  const selectedCollateralAsset = useMemo(
    () => ({
      asset: collateralAsset,
      value: amount,
      balance: collaterallBalance,
      usdPrice: collateralUsdPrice,
    }),
    [collateralAsset, amount, collaterallBalance, collateralUsdPrice],
  );
  const selectedBorrowAsset = useMemo(
    () => ({
      asset: borrowAsset,
      value: expectedOutput,
      balance: borrowBalance,
      usdPrice: borrowUsdPrice,
    }),
    [borrowAsset, expectedOutput, borrowBalance, borrowUsdPrice],
  );

  const summary = useMemo(
    () => [
      {
        label: t('common.slippage'),
        value: (
          <Box center>
            <Text textStyle="caption">
              {`${slippage ? slippage?.toSignificant(6) : 0} ${collateralAsset.name}`}
            </Text>
          </Box>
        ),
      },
    ],
    [slippage, collateralAsset.name],
  );

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <Helmet
        content="Deposit and borrow native assets with THORSwap LENDING"
        keywords="Borrow, Lending, THORSwap, APY, Native assets"
        title={t('views.lending.borrow')}
      />

      <Tabs index={viewTab} onChange={setViewTab}>
        <TabList>
          <Tab>{t('views.lending.borrow')}</Tab>
          <Tab>{t('views.lending.myLoans')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box col className="gap-3">
              <Box className="flex w-full justify-between">
                <Box alignCenter>
                  <Text className="ml-3 mr-2" textStyle="h3">
                    {t('views.lending.header', { asset: borrowAsset.name })}
                  </Text>

                  <Tooltip
                    content={t('views.lending.tooltipDescription', { asset: collateralAsset.name })}
                    place="bottom"
                  >
                    <Icon color="primaryBtn" name="infoCircle" size={24} />
                  </Tooltip>
                </Box>
              </Box>

              <Box alignCenter className="px-3 gap-3">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('views.lending.description', {
                    asset: collateralAsset.name,
                    borrowAsset: borrowAsset.name,
                  })}
                  {/* <Link className="text-twitter-blue cursor-pointer" to={SAVERS_MEDIUM}>
                    <Text fontWeight="medium" textStyle="caption" variant="blue">
                      {`${t('common.learnMore')} →`}
                    </Text>
                  </Link> */}
                </Text>
              </Box>

              <Box row className="justify-center gap-5">
                <Box col className={classNames('flex h-full')}>
                  <Card
                    className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
                    size="lg"
                  >
                    <Box col className="self-stretch gap-2">
                      <AssetInput
                        noFilters
                        assets={listAssets}
                        className="flex-1"
                        onAssetChange={setCollateralAsset}
                        onValueChange={setAmount}
                        poolAsset={selectedCollateralAsset}
                        selectedAsset={selectedCollateralAsset}
                        title={t('views.lending.collateralToDeposit')}
                      />

                      <AssetInput
                        disabled
                        noFilters
                        assets={listAssets}
                        className="flex-1"
                        onAssetChange={setBorrowAsset}
                        poolAsset={selectedBorrowAsset}
                        selectedAsset={selectedBorrowAsset}
                        title={t('views.lending.borrowAmount')}
                      />

                      <InfoTable horizontalInset items={summary} />

                      <ActionButton
                        address={collateralAddress}
                        disabled={buttonDisabled}
                        handleSubmit={() => setIsConfirmOpen(true)}
                        hasError={!amount || hasError}
                        label={tabLabel}
                        setIsConnectModalOpen={setIsConnectModalOpen}
                      />
                    </Box>
                  </Card>

                  <LendingConfirmModal
                    amount={amount}
                    asset={collateralAsset}
                    expectedOutputAmount={expectedOutput}
                    isOpened={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleBorrowSubmit}
                    tabLabel={tabLabel}
                  />
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <BorrowPositionsTab
              setCollateralAsset={setCollateralAsset}
              setTab={setTab}
              setViewTab={setViewTab}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Borrow;
