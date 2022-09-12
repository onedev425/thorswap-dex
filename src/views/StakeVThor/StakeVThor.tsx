import { BigNumber } from '@ethersproject/bignumber';
import { Amount, WalletOption } from '@thorswap-lib/multichain-core';
import BN from 'bignumber.js';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Card, Icon, Tooltip, Typography } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { Helmet } from 'components/Helmet';
import { HighlightCard } from 'components/HighlightCard';
import { InputAmount } from 'components/InputAmount';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { VestingType } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { toOptionalFixed } from 'helpers/number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fromWei, toWei, toWeiFromString } from 'services/contract';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { ConfirmVThorButton } from 'views/StakeVThor/ConfirmVThorButton';
import { ConfirmVThorModal } from 'views/StakeVThor/ConfirmVThorModal';
import { StakeActions, vThorAssets } from 'views/StakeVThor/types';
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil';
import { VThorInfo } from 'views/StakeVThor/VThorInfo';

import { getTokenBalance } from './utils';

const StakeVThor = () => {
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
  const { getRate, previewDeposit, previewRedeem, stakeThor, unstakeThor } = useVthorUtil();
  const { wallet, setIsConnectModalOpen } = useWallet();

  const ethAddress = useMemo(() => wallet?.ETH?.address, [wallet]);
  const ethWalletType = useMemo(() => wallet?.ETH?.walletType, [wallet]);

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
      action === StakeActions.Deposit
        ? new BN(thorBalBn.toString())
        : new BN(vthorBalBn.toString()),
      18,
    ).assetAmount;

    setInputAmount(Amount.fromAssetAmount(new BN(maxAmountBN.toString()), 18));

    if (action === StakeActions.Deposit) {
      const expectedOutput = previewDeposit(
        BigNumber.from(toWeiFromString(maxAmountBN.toString())),
      );
      setOutputAmount(expectedOutput);
    } else {
      const expectedOutput = previewRedeem(BigNumber.from(toWeiFromString(maxAmountBN.toString())));
      setOutputAmount(expectedOutput);
    }
  }, [action, thorBalBn, vthorBalBn, previewDeposit, previewRedeem]);

  const onAmountChange = useCallback(
    (amount: Amount, targetAction?: StakeActions) => {
      const stakeAction = targetAction || action;
      // TODO: validation (cannot exceed max amount)
      setInputAmount(amount);
      const amountBN = BigNumber.from(toWei(amount.assetAmount.toNumber()));
      const expectedOutput =
        stakeAction === StakeActions.Deposit ? previewDeposit(amountBN) : previewRedeem(amountBN);

      setOutputAmount(expectedOutput);
    },
    [action, previewDeposit, previewRedeem],
  );

  const handleAction = useCallback(() => {
    if (!ethAddress) return;

    const amount = toWei(inputAmount.assetAmount.toString());
    const thorAction = action === StakeActions.Deposit ? stakeThor : unstakeThor;
    thorAction(amount, ethAddress);
  }, [action, ethAddress, inputAmount.assetAmount, stakeThor, unstakeThor]);

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

  return (
    <Box col className="self-center w-full max-w-[480px] mt-2">
      <Helmet
        content={t('views.stakingVThor.stakeVThorTitle')}
        title={t('views.stakingVThor.stakeVThorTitle')}
      />
      <ViewHeader title={t('views.stakingVThor.stakeVThorTitle')} />

      <Box alignCenter className="px-3" justify="between">
        <Typography color="secondary" fontWeight="medium" variant="caption">
          {t('views.stakingVThor.stakeVThorSubtitle')}
        </Typography>

        <Tooltip content={t('views.stakingVThor.stakeInfo')} place="bottom">
          <Icon color="primaryBtn" name="infoCircle" size={24} />
        </Tooltip>
      </Box>

      <VThorInfo ethAddress={ethAddress} />

      <Card
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
        size="lg"
      >
        <Box className="self-stretch">
          <TabsSelect
            onChange={(val: string) => {
              setAction(val as StakeActions);
              setReverted(val !== StakeActions.Deposit);
              onAmountChange(inputAmount, val as StakeActions);
            }}
            tabs={tabs}
            value={action}
          />
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
                '-scale-x-100': action === StakeActions.Deposit,
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
                  <Typography className="-ml-1" color="secondary" fontWeight="normal">
                    {t('views.stakingVThor.send')}
                  </Typography>
                  <Box center row className="gap-1 pr-2 md:pr-0">
                    <Typography color="secondary" fontWeight="medium">
                      {t('common.balance')}:{' '}
                      {action === StakeActions.Deposit
                        ? toOptionalFixed(fromWei(thorBalBn))
                        : toOptionalFixed(fromWei(vthorBalBn))}
                    </Typography>

                    <Button
                      className="!h-5 !px-1.5"
                      onClick={handleMaxClick}
                      transform="uppercase"
                      type="outline"
                      variant="secondary"
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
                  <Typography variant="subtitle2">
                    {action === StakeActions.Deposit ? 'THOR' : 'vTHOR'}
                  </Typography>
                  <AssetIcon asset={vThorAssets[action]} size={34} />
                </Box>
              </Box>
            </Box>
          </HighlightCard>
        </Box>
        <Card className="!bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl self-stretch !py-3 gap-2 justify-between md:px-6">
          <Box col className="self-stretch flex-1 md:pl-0">
            <Box className="gap-3 self-stretch !mb-3">
              <Typography className="-ml-1" color="secondary" fontWeight="normal">
                {t('views.stakingVThor.receive')}:
              </Typography>
            </Box>

            <Box className="self-stretch flex-1">
              <Box flex={1}>
                <Typography className="-ml-1 !text-2xl text-left flex-1" fontWeight="normal">
                  {formatter(toOptionalFixed(outputAmount))}
                </Typography>
              </Box>

              <Box center className="gap-3">
                <Typography variant="subtitle2">
                  {action === StakeActions.Deposit ? 'vTHOR' : 'THOR'}
                </Typography>
                <AssetIcon
                  asset={
                    action === StakeActions.Deposit
                      ? vThorAssets[StakeActions.Unstake]
                      : vThorAssets[StakeActions.Deposit]
                  }
                  size={34}
                />
              </Box>
            </Box>
          </Box>
        </Card>
        <Card className="self-stretch align-center !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl !py-2.5">
          <Box alignCenter className="flex-1 gap-2" justify="between">
            <Box center className="gap-2">
              <Button
                className="!p-1 !h-auto"
                onClick={() => setReverted((prev) => !prev)}
                startIcon={<Icon name="switch" size={16} />}
                type="outline"
              />

              <Typography color="primary" fontWeight="normal" variant="caption">
                {getRate(isReverted)}
              </Typography>
            </Box>

            <Tooltip content={t('views.wallet.priceRate')}>
              <Icon className={baseTextHoverClass} color="secondary" name="infoCircle" size={20} />
            </Tooltip>
          </Box>
        </Card>

        <ConfirmVThorButton
          action={action}
          emptyInput={inputAmount.assetAmount.toNumber() === 0}
          ethAddress={ethAddress}
          handleVthorAction={handleVthorAction}
          setIsConnectModalOpen={setIsConnectModalOpen}
        />
      </Card>

      <ConfirmVThorModal
        action={action}
        closeModal={closeModal}
        handleAction={handleAction}
        inputAmount={inputAmount}
        isOpened={isModalOpened}
        outputAmount={outputAmount}
      />
    </Box>
  );
};

export default StakeVThor;
