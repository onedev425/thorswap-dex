import { useCallback, useEffect, useMemo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
import classNames from 'classnames'
import { BigNumber } from 'ethers'

import { StakeConfirmModal } from 'views/Stake/components/StakeConfirmModal'
import { FarmActionType } from 'views/Stake/types'

import { AssetIcon, AssetLpIcon } from 'components/AssetIcon'
import { Typography, Card, Icon, Button, Box, Link } from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'
import { HoverIcon } from 'components/HoverIcon'
import { InfoRow } from 'components/InfoRow'
import { useStakingModal } from 'components/StakingCard/hooks'

import { TxTrackerType } from 'store/midgard/types'
import { useWallet } from 'store/wallet/hooks'

import { useTxTracker } from 'hooks/useTxTracker'

import {
  triggerContractCall,
  ContractType,
  fromWei,
  getCustomContract,
  getEtherscanContract,
  getLPContractAddress,
  getLpTokenBalance,
  LPContractType,
} from 'services/contract'
import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { shortenAddress } from 'helpers/shortenAddress'
import { getAPR } from 'helpers/staking'

type Props = {
  className?: string
  exchange: string
  farmName: string
  stakingToken: string
  stakeAddr: string // Staking Contract address
  assets: Asset[]
  lpAsset: Asset
  contractType: ContractType
  lpContractType: LPContractType
}

export const StakingCard = ({
  assets,
  exchange,
  farmName,
  lpAsset,
  stakingToken,
  stakeAddr,
  contractType,
  lpContractType,
}: Props) => {
  // TODO: Refactor to useReducer
  const [isFetching, setIsFetching] = useState(false)
  const [aprRate, setAPRRate] = useState<number>()
  const [lpTokenBal, setLpTokenBal] = useState(0)
  const [lpTokenBalBn, setLpTokenBalBn] = useState(BigNumber.from(0))
  const [stakedAmount, setStakedAmount] = useState(0)
  const [stakedAmountBn, setStakedAmountBn] = useState(BigNumber.from(0))
  const [pendingRewardDebt, setPendingRewardDebt] = useState(0)
  const [pendingRewardDebtBn, setPendingRewardDebtBn] = useState(
    BigNumber.from(0),
  )
  const { setTxFailed, submitTransaction, subscribeEthTx } = useTxTracker()
  const { wallet, setIsConnectModalOpen } = useWallet()
  const {
    isOpened: isModalOpened,
    open: openConfirm,
    close: closeConfirm,
    type: modalType,
  } = useStakingModal()

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet])

  const getAccountUrl = useCallback(
    (accountAddr: string) =>
      multichain.getExplorerAddressUrl(Chain.Ethereum, accountAddr),
    [],
  )

  const getPoolUserInfo = useCallback(async () => {
    setIsFetching(true)

    if (wallet?.ETH?.address) {
      const ethereumAddr = wallet.ETH.address
      const lpContract = getCustomContract(stakingToken)

      const lpTokenBalance = await lpContract.balanceOf(ethereumAddr)

      setLpTokenBal(fromWei(lpTokenBalance))
      setLpTokenBalBn(lpTokenBalance)

      try {
        const stakingContract = getEtherscanContract(contractType)

        const { amount } = await stakingContract.userInfo(0, ethereumAddr)

        const pendingReward = await stakingContract.pendingRewards(
          0,
          ethereumAddr,
        )

        setStakedAmount(fromWei(amount))
        setStakedAmountBn(amount)
        setPendingRewardDebt(fromWei(pendingReward))
        setPendingRewardDebtBn(pendingReward)
      } catch (error) {
        console.error(error)
      }
    }

    setIsFetching(false)
  }, [contractType, stakingToken, wallet])

  const handleRefresh = useCallback(() => {
    if (ethAddr) {
      getPoolUserInfo()
    }
  }, [ethAddr, getPoolUserInfo])

  const getBlockReward = useCallback(async () => {
    const stakingContract = getEtherscanContract(contractType)
    const blockReward = await stakingContract.blockReward()

    return blockReward
  }, [contractType])

  const getAPRRate = useCallback(async () => {
    try {
      if (contractType === ContractType.STAKING_THOR) {
        const blockReward = await getBlockReward()
        const tokenBalance = await getLpTokenBalance(lpContractType)

        const apr = getAPR(fromWei(blockReward), fromWei(tokenBalance))
        setAPRRate(apr)
      } else {
        const blockReward = await getBlockReward()
        const {
          data: { pair },
        } = await fetch(
          'https://api.thegraph.com/subgraphs/name/sushiswap/exchange',
          {
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
          },
        ).then((res) => res.json())

        const reserveUSD = parseFloat(pair.reserveUSD)
        const totalSupply = parseFloat(pair.totalSupply)
        const lpUnitPrice = reserveUSD / totalSupply
        const thorReserve = parseFloat(pair.reserve0)
        const thorPrice = reserveUSD / 2 / thorReserve

        const stakedLpSupplyBn = await getLpTokenBalance(lpContractType)
        const stakedLpSupply = fromWei(stakedLpSupplyBn)
        const totalLPAmountUSD = stakedLpSupply * lpUnitPrice

        const apr = getAPR(fromWei(blockReward) * thorPrice, totalLPAmountUSD)
        setAPRRate(apr)
      }
    } catch (error) {
      console.error(error)
    }
  }, [contractType, lpContractType, getBlockReward])

  const handleStakingAction = useCallback(
    async (tokenAmount: BigNumber) => {
      closeConfirm()
      let trackId = ''
      try {
        if (modalType === FarmActionType.DEPOSIT) {
          trackId = submitTransaction({
            type: TxTrackerType.Stake,
            submitTx: {
              inAssets: [
                {
                  asset: lpAsset.toString(),
                  amount: fromWei(tokenAmount).toString(),
                },
              ],
            },
          })

          const res = await triggerContractCall(
            multichain,
            contractType,
            'deposit',
            [0, tokenAmount, ethAddr],
          )

          const txHash = res?.hash
          if (txHash) {
            subscribeEthTx({
              uuid: trackId,
              submitTx: {
                inAssets: [
                  {
                    asset: lpAsset.toString(),
                    amount: fromWei(tokenAmount).toString(),
                  },
                ],
                txID: txHash,
              },
              txHash,
            })
          }
        } else if (modalType === FarmActionType.CLAIM) {
          trackId = submitTransaction({
            type: TxTrackerType.Claim,
            submitTx: {
              inAssets: [
                {
                  asset: lpAsset.toString(),
                  amount: fromWei(tokenAmount).toString(),
                },
              ],
            },
          })

          const res = await triggerContractCall(
            multichain,
            contractType,
            'harvest',
            [0, ethAddr],
          )

          const txHash = res?.hash
          if (txHash) {
            subscribeEthTx({
              uuid: trackId,
              submitTx: {
                inAssets: [
                  {
                    asset: lpAsset.toString(),
                    amount: fromWei(tokenAmount).toString(),
                  },
                ],
                txID: txHash,
              },
              txHash,
            })
          }
        } else if (modalType === FarmActionType.WITHDRAW) {
          trackId = submitTransaction({
            type: TxTrackerType.StakeExit,
            submitTx: {
              inAssets: [
                {
                  asset: lpAsset.toString(),
                  amount: fromWei(tokenAmount).toString(),
                },
              ],
            },
          })

          const res = await triggerContractCall(
            multichain,
            contractType,
            'withdrawAndHarvest',
            [0, tokenAmount, ethAddr],
          )

          const txHash = res?.hash
          if (txHash) {
            subscribeEthTx({
              uuid: trackId,
              submitTx: {
                inAssets: [
                  {
                    asset: lpAsset.toString(),
                    amount: fromWei(tokenAmount).toString(),
                  },
                ],
                txID: txHash,
              },
              txHash,
            })
          }
        }
      } catch (error) {
        setTxFailed(trackId)
        console.error(error)
      }
    },
    [
      contractType,
      ethAddr,
      modalType,
      lpAsset,
      closeConfirm,
      setTxFailed,
      submitTransaction,
      subscribeEthTx,
    ],
  )

  useEffect(() => {
    if (ethAddr) {
      getPoolUserInfo()
    } else {
      setStakedAmount(0)
      setStakedAmountBn(BigNumber.from(0))
      setPendingRewardDebt(0)
      setPendingRewardDebtBn(BigNumber.from(0))
      setLpTokenBal(0)
      setLpTokenBalBn(BigNumber.from(0))
    }
  }, [ethAddr, getPoolUserInfo])

  useEffect(() => {
    getAPRRate()
  }, [getAPRRate])

  return (
    <Box className="flex-1 !min-w-[360px] lg:!max-w-[50%]" col>
      <Box className="relative w-full" mt={56}>
        <Card
          className={classNames('flex-col w-full', borderHoverHighlightClass)}
        >
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px]">
            {assets.length > 1 ? (
              <AssetLpIcon
                inline
                asset1={assets[0]}
                asset2={assets[1]}
                size="big"
                hasShadow
              />
            ) : (
              <AssetIcon
                hasChainIcon={false}
                shadowPosition="center"
                asset={assets[0]}
                size="big"
                hasShadow
              />
            )}
          </div>

          <Box mt={32} alignCenter row justify="between">
            <Box flex={1} />
            <Typography className="mr-2" variant="h4">
              {farmName}
            </Typography>
            <Box flex={1} justify="end">
              <HoverIcon
                iconName="refresh"
                color="cyan"
                spin={isFetching}
                onClick={handleRefresh}
              />
            </Box>
          </Box>

          <Box className="flex-row justify-between">
            <Box col className="p-4">
              <Typography
                variant="caption-xs"
                color="secondary"
                fontWeight="bold"
                transform="uppercase"
              >
                {t('common.exchange')}
              </Typography>
              <Typography variant="body" color="primary" fontWeight="bold">
                {exchange}
              </Typography>
            </Box>
            <Box col className="p-4">
              <Typography
                variant="caption-xs"
                color="secondary"
                fontWeight="bold"
                className="text-right"
              >
                {t('common.APR')}
              </Typography>

              <Typography
                variant="body"
                fontWeight="bold"
                color="green"
                className="text-right"
              >
                {aprRate?.toFixed(2) || '-'}%
              </Typography>
            </Box>
          </Box>
          <Box className="flex-col px-4">
            <InfoRow
              size="md"
              label={t('views.staking.stakingToken')}
              value={
                <Box className="space-x-1" alignCenter row>
                  <Typography
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    color="primary"
                    fontWeight="bold"
                    variant="caption-xs"
                  >
                    {shortenAddress(stakingToken)}
                  </Typography>
                  <Link to={getAccountUrl(stakingToken)} external>
                    <Icon name="share" color="cyan" size={16} />
                  </Link>
                </Box>
              }
            />
            <InfoRow
              size="md"
              label={t('views.staking.stakingContract')}
              value={
                <Box className="space-x-1" alignCenter row>
                  <Typography
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    color="primary"
                    fontWeight="bold"
                    variant="caption-xs"
                  >
                    {shortenAddress(stakeAddr)}
                  </Typography>
                  <Link to={getAccountUrl(stakeAddr)} external>
                    <Icon name="share" color="cyan" size={16} />
                  </Link>
                </Box>
              }
            />
            <InfoRow
              size="md"
              label={t('views.staking.tokenBalance')}
              value={ethAddr ? lpTokenBal.toLocaleString() : 'N/A'}
            />
            <InfoRow
              size="md"
              label={t('views.staking.tokenStaked')}
              value={ethAddr ? stakedAmount.toFixed(4) : 'N/A'}
            />
            <InfoRow
              size="md"
              label={t('views.staking.claimable')}
              value={ethAddr ? pendingRewardDebt.toFixed(2) : 'N/A'}
            />
          </Box>
          <Box className="w-full gap-2" alignCenter mt={4}>
            {!ethAddr ? (
              <Button
                isFancy
                size="lg"
                stretch
                onClick={() => setIsConnectModalOpen(true)}
              >
                {t('common.connectWallet')}
              </Button>
            ) : (
              <>
                <Button
                  className="flex-1"
                  variant="primary"
                  onClick={() => openConfirm(FarmActionType.DEPOSIT)}
                >
                  {t('common.deposit')}
                </Button>
                <Button
                  className="flex-1"
                  variant="tertiary"
                  onClick={() => openConfirm(FarmActionType.CLAIM)}
                >
                  {t('common.claim')}
                </Button>
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => openConfirm(FarmActionType.WITHDRAW)}
                >
                  {t('common.withdraw')}
                </Button>
              </>
            )}
          </Box>
        </Card>
      </Box>

      <StakeConfirmModal
        isOpened={isModalOpened}
        type={modalType || FarmActionType.CLAIM}
        farmName={farmName}
        contractType={contractType}
        lpAsset={lpAsset}
        claimableAmount={pendingRewardDebtBn}
        tokenBalance={lpTokenBalBn}
        stakedAmount={stakedAmountBn}
        onCancel={closeConfirm}
        onConfirm={handleStakingAction}
      />
    </Box>
  )
}
