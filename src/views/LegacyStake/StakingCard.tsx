import { Text } from '@chakra-ui/react';
import { type AssetValue, BaseDecimal, Chain, SwapKitNumber } from '@swapkit/core';
import classNames from 'classnames';
import { AssetIcon, AssetLpIcon } from 'components/AssetIcon';
import { Box, Button, Card, Icon, Link } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
import { HoverIcon } from 'components/HoverIcon';
import { InfoRow } from 'components/InfoRow';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { shortenAddress } from 'helpers/shortenAddress';
import { BLOCKS_PER_YEAR } from 'helpers/staking';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LPContractType } from 'services/contract';
import {
  ContractType,
  getCustomContract,
  getEtherscanContract,
  triggerContractCall,
} from 'services/contract';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

import { StakeConfirmModal } from './components/StakeConfirmModal';
import { getLPContractAddress, getLpTokenBalance, useStakingModal } from './hooks';
import { FarmActionType } from './types';

type Props = {
  exchange: string;
  farmName: string;
  stakingToken: string;
  stakeAddr: string; // Staking Contract address
  withdrawOnly?: boolean;
  assets: AssetValue[];
  lpAsset: AssetValue;
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
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWalletAddress } = useWallet();
  const ethAddr = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);
  const [isFetching, setIsFetching] = useState(false);
  const [aprRate, setAPRRate] = useState<number>();
  const [lpTokenBal, setLpTokenBal] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const [stakedAmount, setStakedAmount] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const [pendingRewardDebt, setPendingRewardDebt] = useState(
    new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }),
  );
  const [{ stakingTokenUrl, stakeAddrUrl }, setUrls] = useState({
    stakingTokenUrl: '',
    stakeAddrUrl: '',
  });

  const {
    isOpened: isModalOpened,
    open: openConfirm,
    close: closeConfirm,
    type: modalType,
  } = useStakingModal();

  const getPoolUserInfo = useCallback(async () => {
    setIsFetching(true);

    if (ethAddr) {
      const lpContract = await getCustomContract(stakingToken);

      const lpTokenBalance = await lpContract.balanceOf(ethAddr);

      setLpTokenBal(SwapKitNumber.fromBigInt(lpTokenBalance, BaseDecimal.ETH));

      try {
        const stakingContract = await getEtherscanContract(contractType);

        const { amount } = await stakingContract.userInfo(0, ethAddr);

        const pendingReward = await stakingContract.pendingRewards(0, ethAddr);

        setStakedAmount(SwapKitNumber.fromBigInt(BigInt(amount || 0), BaseDecimal.ETH));
        setPendingRewardDebt(SwapKitNumber.fromBigInt(BigInt(pendingReward || 0), BaseDecimal.ETH));
      } catch (error: NotWorth) {
        logException(error.toString());
      }
    }

    setIsFetching(false);
  }, [contractType, ethAddr, stakingToken]);

  const handleRefresh = useCallback(() => {
    if (ethAddr) {
      getPoolUserInfo();
    }
  }, [ethAddr, getPoolUserInfo]);

  const getAPR = useCallback((blockReward: number, totalAmount: number) => {
    if (totalAmount === 0) return Number.MAX_SAFE_INTEGER;

    return ((blockReward * BLOCKS_PER_YEAR) / totalAmount) * 100;
  }, []);

  const getBlockReward = useCallback(async () => {
    const stakingContract = await getEtherscanContract(contractType);
    const blockReward = await stakingContract.blockReward();

    return SwapKitNumber.fromBigInt(blockReward, BaseDecimal.ETH);
  }, [contractType]);

  const getAPRRate = useCallback(async () => {
    try {
      const blockReward = await getBlockReward();

      if (contractType === ContractType.STAKING_THOR) {
        const tokenBalance = await getLpTokenBalance(lpContractType);

        const apr = getAPR(blockReward.getValue('number'), tokenBalance.getValue('number'));
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

        const reserveUSD = Number.parseFloat(pair.reserveUSD);
        const totalSupply = Number.parseFloat(pair.totalSupply);
        const lpUnitPrice = reserveUSD / totalSupply;
        const thorReserve = Number.parseFloat(pair.reserve0);
        const thorPrice = reserveUSD / 2 / thorReserve;

        const stakedLpSupply = await getLpTokenBalance(lpContractType);

        const apr = getAPR(
          blockReward.getValue('number') * thorPrice,
          stakedLpSupply.getValue('number') * lpUnitPrice,
        );
        setAPRRate(apr);
      }
    } catch (error: NotWorth) {
      logException(error.toString());
    }
  }, [getBlockReward, contractType, lpContractType, getAPR]);

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
    async (tokenAmount: SwapKitNumber) => {
      closeConfirm();
      if (!methodName || !ethAddr || !txType) return;

      const id = v4();
      const label = `${t(`common.${txType}`)} ${tokenAmount.toSignificant(6)} ${lpAsset.ticker}`;

      appDispatch(
        addTransaction({
          id,
          from: ethAddr,
          inChain: Chain.Ethereum,
          type: txType,
          label,
        }),
      );

      const params =
        methodName === 'harvest' ? [0, ethAddr] : [0, tokenAmount.getBaseValue('string'), ethAddr];

      try {
        const hash = (await triggerContractCall(contractType, methodName, params)) as string;

        if (hash) {
          appDispatch(updateTransaction({ id, txid: hash }));
        }
      } catch (error: NotWorth) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [closeConfirm, methodName, ethAddr, txType, lpAsset, appDispatch, contractType],
  );

  useEffect(() => {
    if (ethAddr) {
      getPoolUserInfo();
    } else {
      setStakedAmount(new SwapKitNumber({ decimal: BaseDecimal.ETH, value: 0 }));
      setPendingRewardDebt(new SwapKitNumber({ decimal: BaseDecimal.ETH, value: 0 }));
      setLpTokenBal(new SwapKitNumber({ decimal: BaseDecimal.ETH, value: 0 }));
    }
  }, [ethAddr, getPoolUserInfo]);

  useEffect(() => {
    getAPRRate();

    import('services/swapKit')
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getExplorerAddressUrl }) => {
        setUrls({
          stakeAddrUrl: getExplorerAddressUrl({ chain: Chain.Ethereum, address: stakeAddr }) || '',
          stakingTokenUrl:
            getExplorerAddressUrl({ chain: Chain.Ethereum, address: stakingToken }) || '',
        });
      });
  }, [getAPRRate, stakeAddr, stakingToken]);

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
            <Text className="mr-2" textStyle="h4">
              {farmName}
            </Text>
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
              <Text
                fontWeight="bold"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant="secondary"
              >
                {t('common.exchange')}
              </Text>
              <Text fontWeight="bold" textStyle="body" variant="primary">
                {exchange}
              </Text>
            </Box>
            <Box col className="p-4">
              <Text
                className="text-right"
                fontWeight="bold"
                textStyle="caption-xs"
                variant="secondary"
              >
                {t('common.APR')}
              </Text>

              <Text className="text-right" fontWeight="bold" textStyle="body" variant="green">
                {aprRate?.toFixed(2) || '-'}%
              </Text>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <InfoRow
              label={t('views.staking.stakingToken')}
              size="md"
              value={
                <Box alignCenter row className="space-x-1">
                  <Text
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    fontWeight="bold"
                    textStyle="caption-xs"
                    variant="primary"
                  >
                    {shortenAddress(stakingToken)}
                  </Text>
                  <Link external to={stakingTokenUrl}>
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
                  <Text
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    fontWeight="bold"
                    textStyle="caption-xs"
                    variant="primary"
                  >
                    {shortenAddress(stakeAddr)}
                  </Text>
                  <Link external to={stakeAddrUrl}>
                    <Icon color="cyan" name="share" size={16} />
                  </Link>
                </Box>
              }
            />
            <InfoRow
              label={t('views.staking.tokenBalance')}
              size="md"
              value={ethAddr && lpTokenBal.gt(0) ? lpTokenBal.toSignificant(4) : 'N/A'}
            />
            <InfoRow
              label={t('views.staking.tokenStaked')}
              size="md"
              value={ethAddr && stakedAmount.gt(0) ? stakedAmount.toSignificant(4) : 'N/A'}
            />
            <InfoRow
              label={t('views.staking.claimable')}
              size="md"
              value={
                ethAddr && pendingRewardDebt.gt(0) ? pendingRewardDebt.toSignificant(4) : 'N/A'
              }
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
        claimableAmount={pendingRewardDebt}
        contractType={contractType}
        isOpened={isModalOpened}
        lpAsset={lpAsset}
        onCancel={closeConfirm}
        onConfirm={handleStakingAction}
        stakedAmount={stakedAmount}
        tokenBalance={lpTokenBal}
        type={modalType || FarmActionType.CLAIM}
      />
    </Box>
  );
};
