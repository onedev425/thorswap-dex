import { useCallback, useEffect, useMemo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'
import classNames from 'classnames'
import { BigNumber } from 'ethers'

import { AssetIcon, AssetLpIcon } from 'components/AssetIcon'
import { Typography, Card, Icon, Button, Box, Link } from 'components/Atomic'
import { InfoRow } from 'components/InfoRow'

import { useWallet } from 'store/wallet/hooks'

import {
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
  className,
  assets,
  exchange,
  farmName,
  stakingToken,
  stakeAddr,
  contractType,
  lpContractType,
}: Props) => {
  const [isFetching, setIsFetching] = useState(false)
  const [aprRate, setAPRRate] = useState<number>()
  const [lpTokenBal, setLpTokenBal] = useState(0)
  const [lpTokenBalBn, setLpTokenBalBn] = useState(BigNumber.from(0))
  const [stakedAmount, setStakedAmount] = useState(0)
  const [stakedAmountBn, setStakedAmountBn] = useState(BigNumber.from(0))
  const [pendingRewardDebt, setPendingRewardDebt] = useState(0)
  const { wallet, setIsConnectModalOpen } = useWallet()

  console.log(isFetching, lpTokenBalBn, stakedAmountBn)

  const ethAddr = useMemo(
    () => wallet && wallet.ETH && wallet.ETH.address,
    [wallet],
  )

  const getAccountUrl = useCallback(
    (accountAddr: string) =>
      multichain.getExplorerAddressUrl(Chain.Ethereum, accountAddr),
    [],
  )

  const getPoolUserInfo = useCallback(async () => {
    setIsFetching(true)

    if (wallet && wallet.ETH && wallet.ETH.address) {
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
      } catch (error) {
        console.log(error)
      }
    }

    setIsFetching(false)
  }, [contractType, stakingToken, wallet])

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
      console.log(error)
    }
  }, [contractType, lpContractType, getBlockReward])

  useEffect(() => {
    if (ethAddr) {
      getPoolUserInfo()
    } else {
      setStakedAmount(0)
      setStakedAmountBn(BigNumber.from(0))
      setPendingRewardDebt(0)
      setLpTokenBal(0)
      setLpTokenBalBn(BigNumber.from(0))
    }
  }, [ethAddr, getPoolUserInfo])

  useEffect(() => {
    getAPRRate()
  }, [getAPRRate])

  return (
    <Box col className={classNames('w-full md:w-1/2 lg:w-1/3', className)}>
      <Box mb={56}>
        <Typography variant="h2" color="primary" fontWeight="extrabold">
          {farmName}
        </Typography>
      </Box>
      <Box className="w-full">
        <Card className="flex-col w-full shadow-2xl drop-shadow-4xl">
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
              <AssetIcon asset={assets[0]} size="big" hasShadow />
            )}
          </div>
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
              <Typography variant="h4" color="primary" fontWeight="extrabold">
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
                variant="h4"
                fontWeight="semibold"
                color="green"
                className="text-right"
              >
                {aprRate?.toFixed(2) || '-'}%
              </Typography>
            </Box>
          </Box>
          <Box className="flex-col px-4 space-y-3">
            <InfoRow
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
              label={t('views.staking.tokenBalance')}
              value={ethAddr ? lpTokenBal.toLocaleString() : 'N/A'}
            />
            <InfoRow
              label={t('views.staking.tokenStaked')}
              value={ethAddr ? stakedAmount.toFixed(4) : 'N/A'}
            />
            <InfoRow
              label={t('views.staking.claimable')}
              value={ethAddr ? pendingRewardDebt.toFixed(2) : 'N/A'}
            />
          </Box>
          <Box className="w-full gap-2" alignCenter mt={4}>
            {!ethAddr ? (
              <Button stretch onClick={() => setIsConnectModalOpen(true)}>
                {t('common.connectWallet')}
              </Button>
            ) : (
              <>
                <Button className="flex-1" type="outline" variant="primary">
                  {t('common.deposit')}
                </Button>
                <Button className="flex-1" type="outline" variant="secondary">
                  {t('common.withdraw')}
                </Button>
                <Button className="flex-1" type="outline" variant="tertiary">
                  {t('common.claim')}
                </Button>
              </>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  )
}
