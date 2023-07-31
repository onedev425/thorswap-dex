import { Text } from '@chakra-ui/react';
import { BigNumber } from '@ethersproject/bignumber';
import { Amount, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { WalletOption } from '@thorswap-lib/types';
import BN from 'bignumber.js';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Card, Icon, Tooltip } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { Helmet } from 'components/Helmet';
import { HighlightCard } from 'components/HighlightCard';
import { InputAmount } from 'components/InputAmount';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { stakingV2Addr, VestingType } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fromWei, getCustomContract, toWeiFromString } from 'services/contract';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';

import { ConfirmVThorButton } from './ConfirmVThorButton';
import { ConfirmVThorModal } from './ConfirmVThorModal';
import { StakeActions, useVthorUtil } from './hooks';
import { VThorInfo } from './VThorInfo';

const getTokenBalance = async (contractType: VestingType, ethAddr: string) => {
  const contract = getCustomContract(stakingV2Addr[contractType]);
  const tokenBalance = await contract.balanceOf(ethAddr);

  return tokenBalance;
};

const Staking = () => {
  const tabs = [
    { label: t('views.stakingVThor.stakeVThor'), value: StakeActions.Deposit },
    { label: t('views.stakingVThor.unstake'), value: StakeActions.Unstake },
  ];

  const [action, setAction] = useState(StakeActions.Deposit);
  const [thorBalBn, setThorBalBn] = useState(BigNumber.from(0));
  const [vthorBalBn, setVthorBalBn] = useState(BigNumber.from(0));
  const [inputAmount, setInputAmount] = useState(Amount.fromAssetAmount(0, 3));
  const [outputAmount, setOutputAmount] = useState(0);
  const [isReverted, setReverted] = useState(true);
  const [isModalOpened, setModalOpened] = useState(false);

  const formatter = useFormatPrice({ prefix: '' });
  const { getRateString, previewDeposit, previewRedeem, stakeThor, unstakeThor } = useVthorUtil();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const isDeposit = useMemo(() => action === StakeActions.Deposit, [action]);

  const stakingAsset = useMemo(
    () => getSignatureAssetFor(isDeposit ? 'ETH_THOR' : 'ETH_VTHOR'),
    [isDeposit],
  );

  const { walletType: ethWalletType, address: ethAddress } = useMemo(
    () => wallet?.ETH || { walletType: undefined, address: undefined },
    [wallet?.ETH],
  );

  const getTokenInfo = useCallback(
    async (contractType: VestingType, address: string, setBalance: (num: BigNumber) => void) => {
      const tokenBalance = await getTokenBalance(contractType, address).catch(() =>
        BigNumber.from(0),
      );
      setBalance(tokenBalance);
    },
    [],
  );

  useEffect(() => {
    if (ethAddress) {
      getTokenInfo(VestingType.THOR, ethAddress, setThorBalBn);
      getTokenInfo(VestingType.VTHOR, ethAddress, setVthorBalBn);
    } else {
      setThorBalBn(BigNumber.from(0));
      setVthorBalBn(BigNumber.from(0));
    }
  }, [ethAddress, getTokenInfo]);

  const handleMaxClick = useCallback(() => {
    const maxAmountBN = Amount.fromBaseAmount(
      isDeposit ? new BN(thorBalBn.toString()) : new BN(vthorBalBn.toString()),
      18,
    ).assetAmount;

    setInputAmount(Amount.fromAssetAmount(new BN(maxAmountBN.toString()), 18));

    if (isDeposit) {
      const expectedOutput = previewDeposit(
        BigNumber.from(toWeiFromString(maxAmountBN.toString())),
      );
      setOutputAmount(expectedOutput);
    } else {
      const expectedOutput = previewRedeem(toWeiFromString(maxAmountBN.toString()));
      setOutputAmount(expectedOutput);
    }
  }, [isDeposit, thorBalBn, vthorBalBn, previewDeposit, previewRedeem]);

  const onAmountChange = useCallback(
    (amount: Amount, targetAction?: StakeActions) => {
      setInputAmount(amount);
      const amountBN = toWeiFromString(amount.assetAmount.toFixed());
      const expectedOutput =
        targetAction === StakeActions.Deposit || isDeposit
          ? previewDeposit(amountBN)
          : previewRedeem(amountBN);

      setOutputAmount(expectedOutput);
    },
    [isDeposit, previewDeposit, previewRedeem],
  );

  const handleAction = useCallback(() => {
    if (!ethAddress) return;

    const amount = toWeiFromString(inputAmount.assetAmount.toFixed());
    const thorAction = isDeposit ? stakeThor : unstakeThor;
    thorAction(amount, ethAddress);
  }, [ethAddress, inputAmount.assetAmount, isDeposit, stakeThor, unstakeThor]);

  const handleVthorAction = useCallback(() => {
    if (ethWalletType === WalletOption.KEYSTORE) {
      setModalOpened(true);
    } else {
      handleAction();
    }
  }, [ethWalletType, handleAction]);

  const handleStakeTypeChange = useCallback(() => {
    setAction((v) => (v === StakeActions.Deposit ? StakeActions.Unstake : StakeActions.Deposit));
  }, []);

  const closeModal = useCallback(() => {
    setModalOpened(false);
  }, []);

  const handleTabChange = useCallback(
    (val: string) => {
      setAction(val as StakeActions);
      setReverted(val !== StakeActions.Deposit);
      onAmountChange(inputAmount, val as StakeActions);
    },
    [inputAmount, onAmountChange],
  );

  const disabledButton = useMemo(() => {
    return (
      inputAmount.lte(0) ||
      (action === StakeActions.Deposit && thorBalBn.lte(0)) ||
      (action === StakeActions.Unstake && vthorBalBn.lte(0))
    );
  }, [action, inputAmount, thorBalBn, vthorBalBn]);

  return (
    <Box col className="self-center w-full max-w-[480px] mt-2">
      <Helmet
        content={t('views.stakingVThor.description')}
        keywords="THOR, vTHOR, Staking, THORSwap, DEFI, DEX"
        title={t('views.stakingVThor.title')}
      />

      <ViewHeader title={t('views.stakingVThor.stakeVThorTitle')} />

      <Box alignCenter className="px-3" justify="between">
        <Text fontWeight="medium" textStyle="caption" variant="secondary">
          {t('views.stakingVThor.stakeVThorSubtitle')}
        </Text>

        <Tooltip content={t('views.stakingVThor.stakeInfo')} place="bottom">
          <Icon color="primaryBtn" name="infoCircle" size={24} />
        </Tooltip>
      </Box>

      <VThorInfo ethAddress={ethAddress} walletType={ethWalletType} />

      <Card
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
        size="lg"
      >
        <Box className="self-stretch">
          <TabsSelect onChange={handleTabChange} tabs={tabs} value={action} />
        </Box>

        <Box className="relative self-stretch">
          <Box
            center
            className={classNames(
              'z-10 absolute -mt-0.5 -bottom-6 left-1/2 -translate-x-1/2',
              'p-1 md:p-2 rounded-xl md:rounded-[18px] cursor-pointer',
              'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent hover:brightness-125 transition',
            )}
            onClick={handleStakeTypeChange}
          >
            <Icon
              className={classNames('p-1 transition-all', {
                '-scale-x-100': isDeposit,
              })}
              color="white"
              name="arrowDown"
              size={20}
            />
          </Box>

          <HighlightCard
            className={classNames('!gap-1 !justify-start flex-1 !px-4 md:!px-6 !py-4')}
          >
            <Box alignCenter col className="self-stretch flex-1 md:pl-0">
              <Box className="gap-3 self-stretch !mb-3">
                <Box alignCenter flex={1} justify="between">
                  <Text className="-ml-1" fontWeight="normal" variant="secondary">
                    {t('views.stakingVThor.send')}
                  </Text>
                  <Box center row className="gap-1 pr-2 md:pr-0">
                    <Text fontWeight="medium" variant="secondary">
                      {t('common.balance')}:{' '}
                      {isDeposit
                        ? toOptionalFixed(fromWei(thorBalBn))
                        : toOptionalFixed(fromWei(vthorBalBn))}
                    </Text>

                    <Button
                      className="!h-5 !px-1.5"
                      onClick={handleMaxClick}
                      textTransform="uppercase"
                      variant="outlineSecondary"
                    >
                      {t('common.max')}
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Box className="self-stretch flex-1">
                <Box flex={1}>
                  <InputAmount
                    stretch
                    amountValue={inputAmount}
                    className={classNames('-ml-1 !text-2xl font-normal text-left flex-1')}
                    containerClassName="!py-0"
                    onAmountChange={onAmountChange}
                  />
                </Box>

                <Box center className="gap-3">
                  <Text textStyle="subtitle2">{stakingAsset.name}</Text>
                  <AssetIcon asset={stakingAsset} size={34} />
                </Box>
              </Box>
            </Box>
          </HighlightCard>
        </Box>

        <Card className="!bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl self-stretch !py-3 gap-2 justify-between md:px-6">
          <Box col className="self-stretch flex-1 md:pl-0">
            <Box className="gap-3 self-stretch !mb-3">
              <Text className="-ml-1" fontWeight="normal" variant="secondary">
                {t('views.stakingVThor.receive')}:
              </Text>
            </Box>

            <Box className="self-stretch flex-1">
              <Box flex={1}>
                <Text className="-ml-1 !text-2xl text-left flex-1" fontWeight="normal">
                  {formatter(toOptionalFixed(outputAmount))}
                </Text>
              </Box>

              <Box center className="gap-3">
                <Text textStyle="subtitle2">{isDeposit ? 'vTHOR' : 'THOR'}</Text>
                <AssetIcon asset={stakingAsset} size={34} />
              </Box>
            </Box>
          </Box>
        </Card>

        <Card className="self-stretch align-center !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl !py-2.5">
          <Box alignCenter className="flex-1 gap-2" justify="between">
            <Box center className="gap-2">
              <Button
                className="!p-1 !h-auto"
                leftIcon={<Icon name="switch" size={16} />}
                onClick={() => setReverted((prev) => !prev)}
                variant="outlinePrimary"
              />

              <Text fontWeight="normal" textStyle="caption" variant="primary">
                {getRateString(isReverted)}
              </Text>
            </Box>

            <Tooltip content={t('views.wallet.priceRate')}>
              <Icon className={baseTextHoverClass} color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        </Card>

        <ConfirmVThorButton
          action={action}
          disabledButton={disabledButton}
          ethAddress={ethAddress}
          handleVthorAction={handleVthorAction}
          inputAmount={inputAmount}
          setIsConnectModalOpen={setIsConnectModalOpen}
        />
      </Card>

      <ConfirmVThorModal
        closeModal={closeModal}
        handleAction={handleAction}
        inputAmount={inputAmount}
        isOpened={isModalOpened}
        outputAmount={outputAmount}
        stakingAsset={stakingAsset}
      />
    </Box>
  );
};

export default Staking;
