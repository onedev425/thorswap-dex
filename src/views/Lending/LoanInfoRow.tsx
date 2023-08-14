import { Card, Collapse, Flex, Text } from '@chakra-ui/react';
import { Amount, AmountType, AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { AssetSelect } from 'components/AssetSelect';
import { AssetSelectButton } from 'components/AssetSelect/AssetSelectButton';
import { Button, Icon } from 'components/Atomic';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { InputAmount } from 'components/InputAmount';
import { PercentageSlider } from 'components/PercentageSlider';
import { formatDuration } from 'components/TransactionTracker/helpers';
import { BTCAsset } from 'helpers/assets';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useTCBlockTimer } from 'hooks/useTCBlockTimer';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { MATURITY_BLOCKS } from 'views/Lending/Borrow';
import { LendingConfirmModal } from 'views/Lending/LendingConfirmModal';
import { LoanInfoRowCell } from 'views/Lending/LoanInfoRowCell';
import { LoanPosition } from 'views/Lending/types';
import { useLendingAssets } from 'views/Lending/useLendingAssets';
import { useLoanRepay } from 'views/Lending/useLoanRepay';
import { usePercentageDebtValue } from 'views/Lending/usePercentageDebtValue';

type Props = {
  loan: LoanPosition;
  setBorrowTab: () => void;
  setCollateralAsset: (value: AssetEntity) => void;
};

export const LoanInfoRow = ({ loan, setBorrowTab, setCollateralAsset }: Props) => {
  const [show, setShow] = useState(false);
  const [sliderValue, setSliderValue] = useState(new Amount(0, AmountType.ASSET_AMOUNT, 2));
  const [repayAsset, setRepayAsset] = useState(BTCAsset);
  const { getMaxBalance } = useBalance();
  const { wallet } = useWallet();

  const { lendingAssets } = useLendingAssets();
  const listAssets = useAssetsWithBalance(lendingAssets);

  const { collateralCurrent, debtCurrent, asset } = loan;

  const handleToggle = () => setShow(!show);

  const collateralUsd = usePoolAssetPriceInUsd({
    asset,
    amount: collateralCurrent,
  }).toCurrencyFormat(2);
  const { repayAssetAmount, isLoading } = usePercentageDebtValue({
    asset: repayAsset,
    collateralAsset: asset,
    percentage: sliderValue,
    totalAmount: debtCurrent,
  });

  const repayAddress = useMemo(
    () => wallet?.[repayAsset.L1Chain]?.address || '',
    [wallet, repayAsset.L1Chain],
  );
  const repayUsdPrice = usePoolAssetPriceInUsd({ asset: repayAsset, amount: repayAssetAmount });

  const repayBalance = useMemo(
    () => (repayAddress ? getMaxBalance(repayAsset) : undefined),
    [repayAddress, repayAsset, getMaxBalance],
  );
  const selectedRepayAsset = useMemo(
    () => ({
      asset: repayAsset,
      value: repayAssetAmount,
      balance: repayBalance,
      usdPrice: repayUsdPrice,
    }),
    [repayAsset, repayAssetAmount, repayBalance, repayUsdPrice],
  );

  const canRepay = useMemo(() => {
    if (repayAssetAmount.lte(0)) return false;
    if (repayBalance?.lt(repayAssetAmount)) return false;

    return true;
  }, [repayAssetAmount, repayBalance]);

  const onSuccess = useCallback(() => {
    setSliderValue(new Amount(0, AmountType.ASSET_AMOUNT, 2));
  }, []);

  const { openRepayConfirm, handleRepay, isConfirmOpen, closeRepayConfirm } = useLoanRepay({
    repayAsset,
    amount: repayAssetAmount,
    onSuccess,
  });

  const { getBlockTimeDifference } = useTCBlockTimer();

  return (
    <Flex
      alignSelf="stretch"
      direction="column"
      justify="center"
      key={`${asset.symbol} + ${asset.symbol}`}
      w="full"
    >
      <Card
        className="!rounded-3xl flex-col flex !gap-0 !px-3 !py-3"
        variant="filledContainerSecondary"
      >
        <Flex direction={{ base: 'column', lg: 'row' }} flex={4} gap={1}>
          <Flex flex={5}>
            <Flex align="center">
              <AssetIcon asset={getSignatureAssetFor(asset.symbol as Chain)} size={36} />
            </Flex>
            <LoanInfoRowCell>
              <Text textAlign="end">{`${collateralCurrent.toSignificant(4)} ${asset.symbol}`}</Text>
              <Text textAlign="end">{collateralUsd}</Text>
            </LoanInfoRowCell>
            <LoanInfoRowCell>
              <Text textAlign="end">{`${debtCurrent.toFixed(2)} TOR`}</Text>
              <Text textAlign="end">{`$${debtCurrent.toFixed(2)}`}</Text>
            </LoanInfoRowCell>
            <LoanInfoRowCell>
              <InfoWithTooltip
                tooltip={t('views.lending.maturityDescription')}
                value={t('views.lending.maturity')}
              />
              <Text>
                {formatDuration(getBlockTimeDifference(loan.lastOpenHeight + MATURITY_BLOCKS), {
                  approx: true,
                })}
              </Text>
            </LoanInfoRowCell>
          </Flex>
          <Flex
            align="center"
            direction="row"
            flex={{ md: 2, lg: 3, xl: 4 }}
            gap={2}
            justify="end"
            mt={{ base: 2, md: 0 }}
            pl={{ md: 4, lg: 8 }}
          >
            <Button
              flex={1}
              onClick={(e) => {
                e.stopPropagation();
                setBorrowTab();
                setCollateralAsset(asset);
              }}
              variant="outlinePrimary"
            >
              {t('views.lending.borrow')}
            </Button>

            <Button
              flex={1}
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              rightIcon={
                <Icon
                  className={classNames({
                    '-rotate-180': show,
                  })}
                  name="chevronDown"
                  size={14}
                />
              }
              variant="outlineSecondary"
            >
              {t('views.lending.repay')}
            </Button>

            {/* <Button
              disabled
              flex={1}
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant="outlineSecondary"
            >
              {t('views.lending.withdraw')}
            </Button> */}
          </Flex>
        </Flex>
        <Collapse in={show}>
          <Flex align="center" flex={1} justify="center" w="full">
            <Card
              bg="borderPrimary"
              borderRadius="3xl"
              mt={{ base: 2, md: 4 }}
              variant="filledContainerPrimary"
              w="full"
            >
              <Flex align="center" direction="column" display="flex" flex={1} justify="center">
                <Flex
                  alignSelf="stretch"
                  direction={{ base: 'column', lg: 'row' }}
                  flex={1}
                  gap={{ base: 4, lg: 8 }}
                >
                  <Flex direction="column" flex={1}>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text textStyle="caption">{t('views.lending.repayAsset')}:</Text>
                      <AssetSelect
                        showAssetType
                        assets={listAssets}
                        onSelect={setRepayAsset as (asset: AssetEntity) => void}
                        selected={selectedRepayAsset.asset}
                      />
                    </Flex>
                    <PercentageSlider
                      highlightDisabled
                      className="!p-0"
                      onChange={(v) => setSliderValue(v)}
                      percent={sliderValue}
                      slideClassName="!pb-0"
                      title={t('views.lending.repayPercent')}
                    />
                  </Flex>

                  <Flex direction="column" flex={1}>
                    <Flex alignItems="center" minH="40px">
                      <Text textStyle="caption">{t('views.lending.repayAmount')}:</Text>
                    </Flex>

                    <Flex>
                      <Flex flex={1} justifyContent="space-between">
                        {isLoading ? (
                          <Flex alignItems="center" minH="44px">
                            <Icon spin color="primary" name="loader" size={22} />
                          </Flex>
                        ) : (
                          <InputAmount
                            disabled
                            amountValue={repayAssetAmount}
                            className="!text-2xl  pt-[1.5px] md:!w-full"
                          />
                        )}
                      </Flex>

                      <AssetSelectButton
                        showAssetType
                        className="cursor-default p-2"
                        selected={selectedRepayAsset.asset}
                      />
                    </Flex>

                    <Flex mt={3}>
                      <Flex flex={1} justifyContent="space-between">
                        {isLoading ? (
                          <Flex alignItems="center" minH="21px">
                            <Icon spin color="secondary" name="loader" size={16} />
                          </Flex>
                        ) : (
                          <Text variant="secondary">
                            {selectedRepayAsset.usdPrice.toCurrencyFormat(2)}
                          </Text>
                        )}

                        <Flex mr={4}>
                          <Text variant="secondary">
                            {t('common.balance')}:{' '}
                            {selectedRepayAsset.balance?.toSignificant(6) || '0'}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
                <Button
                  stretch
                  disabled={!canRepay}
                  error={!canRepay}
                  mt={6}
                  onClick={(e) => {
                    e.stopPropagation();
                    openRepayConfirm();
                  }}
                  size="md"
                  variant="fancy"
                >
                  {t('views.lending.repay')}
                </Button>
              </Flex>
            </Card>
          </Flex>
        </Collapse>
      </Card>
      <LendingConfirmModal
        amount={repayAssetAmount}
        asset={repayAsset}
        expectedOutputAmount={repayAssetAmount}
        isOpened={isConfirmOpen}
        onClose={closeRepayConfirm}
        onConfirm={handleRepay}
        tabLabel={t('views.lending.repay')}
      />
    </Flex>
  );
};
