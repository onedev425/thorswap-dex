import { BigNumber } from '@ethersproject/bignumber';
import { Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon, AssetLpIcon } from 'components/AssetIcon';
import { Box, Button, Card, Icon, Link, Typography } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
import { HoverIcon } from 'components/HoverIcon';
import { InfoRow } from 'components/InfoRow';
import { shortenAddress } from 'helpers/shortenAddress';
import { getAPR } from 'helpers/staking';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ContractType,
  fromWei,
  getCustomContract,
  getEtherscanContract,
  getLPContractAddress,
  getLpTokenBalance,
  LPContractType,
  triggerContractCall,
} from 'services/contract';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { StakeConfirmModal } from 'views/Stake/components/StakeConfirmModal';
import { FarmActionType } from 'views/Stake/types';

import { useStakingModal } from './hooks';

type Props = {
  exchange: string;
  farmName: string;
  stakingToken: string;
  stakeAddr: string; // Staking Contract address
  withdrawOnly?: boolean;
  assets: Asset[];
  lpAsset: Asset;
  contractType: ContractType;
  lpContractType: LPContractType;
};

export const StakingCard = ({
  assets,
  contractType,
  exchange,
  farmName,
  lpAsset,
  lpContractType,
  stakeAddr,
  stakingToken,
  withdrawOnly,
}: Props) => {
  const appDispatch = useAppDispatch();
  const { wallet, setIsConnectModalOpen } = useWallet();
  // TODO: Refactor to useReducer
  const [isFetching, setIsFetching] = useState(false);
  const [aprRate, setAPRRate] = useState<number>();
  const [lpTokenBal, setLpTokenBal] = useState(0);
  const [lpTokenBalBn, setLpTokenBalBn] = useState(BigNumber.from(0));
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedAmountBn, setStakedAmountBn] = useState(BigNumber.from(0));
  const [pendingRewardDebt, setPendingRewardDebt] = useState(0);
  const [pendingRewardDebtBn, setPendingRewardDebtBn] = useState(BigNumber.from(0));

  const {
    isOpened: isModalOpened,
    open: openConfirm,
    close: closeConfirm,
    type: modalType,
  } = useStakingModal();

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet]);

  const getAccountUrl = useCallback(
    (accountAddr: string) => multichain().getExplorerAddressUrl(Chain.Ethereum, accountAddr),
    [],
  );

  const getPoolUserInfo = useCallback(async () => {
    setIsFetching(true);

    if (wallet?.ETH?.address) {
      const ethereumAddr = wallet.ETH.address;
      const lpContract = getCustomContract(stakingToken);

      const lpTokenBalance = await lpContract.balanceOf(ethereumAddr);

      setLpTokenBal(fromWei(lpTokenBalance));
      setLpTokenBalBn(lpTokenBalance);

      try {
        const stakingContract = getEtherscanContract(contractType);

        const { amount } = await stakingContract.userInfo(0, ethereumAddr);

        const pendingReward = await stakingContract.pendingRewards(0, ethereumAddr);

        setStakedAmount(fromWei(amount));
        setStakedAmountBn(amount);
        setPendingRewardDebt(fromWei(pendingReward));
        setPendingRewardDebtBn(pendingReward);
      } catch (error) {
        console.info(error);
      }
    }

    setIsFetching(false);
  }, [contractType, stakingToken, wallet]);

  const handleRefresh = useCallback(() => {
    if (ethAddr) {
      getPoolUserInfo();
    }
  }, [ethAddr, getPoolUserInfo]);

  const getBlockReward = useCallback(async () => {
    const stakingContract = getEtherscanContract(contractType);
    const blockReward = await stakingContract.blockReward();

    return blockReward;
  }, [contractType]);

  const getAPRRate = useCallback(async () => {
    try {
      const blockReward = await getBlockReward();

      if (contractType === ContractType.STAKING_THOR) {
        const tokenBalance = await getLpTokenBalance(lpContractType);

        const apr = getAPR(fromWei(blockReward), fromWei(tokenBalance));
        setAPRRate(apr);
      } else {
        const {
          data: { pair },
        } = await fetch('https://api.thegraph.com/subgraphs/name/sushiswap/exchange', {
          method: 'POST',
          body: JSON.stringify({
            query: `{
                pair(id: "${getLPContractAddress(lpContractType)}") {
                  reserve0
                  reserve1
                  reserveUSD
                  totalSupply
                }
              }`,
            variables: null,
          }),
        }).then((res) => res.json());

        const reserveUSD = parseFloat(pair.reserveUSD);
        const totalSupply = parseFloat(pair.totalSupply);
        const lpUnitPrice = reserveUSD / totalSupply;
        const thorReserve = parseFloat(pair.reserve0);
        const thorPrice = reserveUSD / 2 / thorReserve;

        const stakedLpSupplyBn = await getLpTokenBalance(lpContractType);
        const stakedLpSupply = fromWei(stakedLpSupplyBn);
        const totalLPAmountUSD = stakedLpSupply * lpUnitPrice;

        const apr = getAPR(fromWei(blockReward) * thorPrice, totalLPAmountUSD);
        setAPRRate(apr);
      }
    } catch (error) {
      console.info(error);
    }
  }, [contractType, lpContractType, getBlockReward]);

  const [methodName, txType] = useMemo(() => {
    switch (modalType) {
      case FarmActionType.DEPOSIT:
        return ['deposit', TransactionType.ETH_STATUS] as const;
      case FarmActionType.EXIT:
        return ['withdraw', TransactionType.ETH_STATUS] as const;
      case FarmActionType.CLAIM:
        return ['harvest', TransactionType.ETH_STATUS] as const;
      default:
        return [] as const;
    }
  }, [modalType]);

  const handleStakingAction = useCallback(
    async (tokenAmount: BigNumber) => {
      closeConfirm();
      if (!methodName || !ethAddr || !txType) return;

      const id = v4();
      const label = `${t(`common.${txType}`)} ${fromWei(tokenAmount)} ${lpAsset.name}`;

      appDispatch(
        addTransaction({ id, from: ethAddr, inChain: Chain.Ethereum, type: txType, label }),
      );

      const params = methodName === 'harvest' ? [0, ethAddr] : [0, tokenAmount, ethAddr];

      try {
        const { hash: txid } = await triggerContractCall(contractType, methodName, params);

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        appDispatch(completeTransaction({ id, status: 'error' }));
        console.info(error);
      }
    },
    [closeConfirm, methodName, ethAddr, txType, lpAsset, appDispatch, contractType],
  );

  useEffect(() => {
    if (ethAddr) {
      getPoolUserInfo();
    } else {
      setStakedAmount(0);
      setStakedAmountBn(BigNumber.from(0));
      setPendingRewardDebt(0);
      setPendingRewardDebtBn(BigNumber.from(0));
      setLpTokenBal(0);
      setLpTokenBalBn(BigNumber.from(0));
    }
  }, [ethAddr, getPoolUserInfo]);

  useEffect(() => {
    getAPRRate();
  }, [getAPRRate]);

  return (
    <Box col className="flex-1 !min-w-[360px] lg:!max-w-[50%]">
      <Box className="relative w-full mt-14">
        <Card className={classNames('flex-col w-full', borderHoverHighlightClass)}>
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px]">
            {assets.length > 1 ? (
              <AssetLpIcon hasShadow inline asset1={assets[0]} asset2={assets[1]} size="big" />
            ) : (
              <AssetIcon
                hasShadow
                asset={assets[0]}
                hasChainIcon={false}
                shadowPosition="center"
                size="big"
              />
            )}
          </div>

          <Box alignCenter row className="mt-8" justify="between">
            <Box flex={1} />
            <Typography className="mr-2" variant="h4">
              {farmName}
            </Typography>
            <Box flex={1} justify="end">
              {ethAddr && (
                <HoverIcon
                  color="cyan"
                  iconName="refresh"
                  onClick={handleRefresh}
                  spin={isFetching}
                />
              )}
            </Box>
          </Box>

          <Box className="flex-row justify-between">
            <Box col className="p-4">
              <Typography
                color="secondary"
                fontWeight="bold"
                transform="uppercase"
                variant="caption-xs"
              >
                {t('common.exchange')}
              </Typography>
              <Typography color="primary" fontWeight="bold" variant="body">
                {exchange}
              </Typography>
            </Box>
            <Box col className="p-4">
              <Typography
                className="text-right"
                color="secondary"
                fontWeight="bold"
                variant="caption-xs"
              >
                {t('common.APR')}
              </Typography>

              <Typography className="text-right" color="green" fontWeight="bold" variant="body">
                {aprRate?.toFixed(2) || '-'}%
              </Typography>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <InfoRow
              label={t('views.staking.stakingToken')}
              size="md"
              value={
                <Box alignCenter row className="space-x-1">
                  <Typography
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    color="primary"
                    fontWeight="bold"
                    variant="caption-xs"
                  >
                    {shortenAddress(stakingToken)}
                  </Typography>
                  <Link external to={getAccountUrl(stakingToken)}>
                    <Icon color="cyan" name="share" size={16} />
                  </Link>
                </Box>
              }
            />
            <InfoRow
              label={t('views.staking.stakingContract')}
              size="md"
              value={
                <Box alignCenter row className="space-x-1">
                  <Typography
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    color="primary"
                    fontWeight="bold"
                    variant="caption-xs"
                  >
                    {shortenAddress(stakeAddr)}
                  </Typography>
                  <Link external to={getAccountUrl(stakeAddr)}>
                    <Icon color="cyan" name="share" size={16} />
                  </Link>
                </Box>
              }
            />
            <InfoRow
              label={t('views.staking.tokenBalance')}
              size="md"
              value={ethAddr ? lpTokenBal.toLocaleString() : 'N/A'}
            />
            <InfoRow
              label={t('views.staking.tokenStaked')}
              size="md"
              value={ethAddr ? stakedAmount.toFixed(4) : 'N/A'}
            />
            <InfoRow
              label={t('views.staking.claimable')}
              size="md"
              value={ethAddr ? pendingRewardDebt.toFixed(2) : 'N/A'}
            />
          </Box>

          <Box alignCenter className="w-full gap-2 mt-4">
            {!ethAddr ? (
              <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
                {t('common.connectWallet')}
              </Button>
            ) : (
              <>
                {withdrawOnly ? (
                  <Button
                    className="flex-1"
                    onClick={() => openConfirm(FarmActionType.EXIT)}
                    variant="fancy"
                  >
                    {withdrawOnly ? t('common.withdraw') : t('common.deposit')}
                  </Button>
                ) : (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => openConfirm(FarmActionType.DEPOSIT)}
                      variant="primary"
                    >
                      {t('common.deposit')}
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => openConfirm(FarmActionType.EXIT)}
                      variant="primary"
                    >
                      {t('common.withdraw')}
                    </Button>
                  </>
                )}
                <Button
                  className="flex-1"
                  onClick={() => openConfirm(FarmActionType.CLAIM)}
                  variant={withdrawOnly ? 'fancy' : 'tertiary'}
                >
                  {t('common.claim')}
                </Button>
              </>
            )}
          </Box>
        </Card>
      </Box>

      <StakeConfirmModal
        claimableAmount={pendingRewardDebtBn}
        contractType={contractType}
        isOpened={isModalOpened}
        lpAsset={lpAsset}
        onCancel={closeConfirm}
        onConfirm={handleStakingAction}
        stakedAmount={stakedAmountBn}
        tokenBalance={lpTokenBalBn}
        type={modalType || FarmActionType.CLAIM}
      />
    </Box>
  );
};
