import { useCallback, useEffect, useMemo, useState } from 'react'

import { Amount, Asset } from '@thorswap-lib/multichain-sdk'
import BN from 'bignumber.js'
import classNames from 'classnames'
import { BigNumber } from 'ethers'

import { useVthorUtil } from 'views/StakeVThor/useVthorUtil'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Card, Icon, Tooltip, Typography } from 'components/Atomic'
import { baseTextHoverClass } from 'components/constants'
import { Helmet } from 'components/Helmet'
import { HighlightCard } from 'components/HighlightCard'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTip } from 'components/InfoTip'
import { InputAmount } from 'components/InputAmount'
import { TabsSelect } from 'components/TabsSelect'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { fromWei, toWei, toWeiFromString } from 'services/contract'
import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'
import { toOptionalFixed } from 'helpers/number'
import { getVthorAPR as getVthorAPRUtil } from 'helpers/staking'

import { getV2Asset, getTokenBalance, StakingV2Type } from './utils'

enum StakeActions {
  Unstake = 'unstake',
  Deposit = 'deposit',
}

const tabs = [
  {
    label: t('views.stakingVThor.stakeVThor'),
    value: StakeActions.Deposit,
  },
  {
    label: t('views.stakingVThor.unstake'),
    value: StakeActions.Unstake,
  },
]

const assets: Record<StakeActions, Asset> = {
  [StakeActions.Deposit]: getV2Asset(StakingV2Type.THOR),
  [StakeActions.Unstake]: getV2Asset(StakingV2Type.VTHOR),
}

const StakeVThor = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [action, setAction] = useState(StakeActions.Deposit)
  const [thorBalBn, setThorBalBn] = useState(BigNumber.from(0))
  const [vthorBalBn, setVthorBalBn] = useState(BigNumber.from(0))
  const [inputAmount, setInputAmount] = useState(Amount.fromAssetAmount(0, 3))
  const [outputAmount, setOutputAmount] = useState(0)
  const [isReverted, setReverted] = useState(true)
  const [vthorApr, setVthorApr] = useState(0)

  const formatter = useFormatPrice({ prefix: '' })
  const {
    isTHORApproved,
    thorStaked,
    thorRedeemable,
    vthorBalance,
    approveTHOR,
    getRate,
    handleRefresh: refreshStats,
    previewDeposit,
    previewRedeem,
    stakeThor,
    unstakeThor,
  } = useVthorUtil()
  const { wallet, setIsConnectModalOpen } = useWallet()

  const ethAddr = useMemo(() => wallet?.ETH?.address, [wallet])

  const getTokenInfo = useCallback(
    async (
      contractType: StakingV2Type,
      address: string,
      setBalance: (num: BigNumber) => void,
    ) => {
      const tokenBalance = await getTokenBalance(contractType, address).catch(
        () => BigNumber.from(0),
      )
      setBalance(tokenBalance)
    },
    [],
  )

  useEffect(() => {
    if (ethAddr) {
      getTokenInfo(StakingV2Type.THOR, ethAddr, setThorBalBn)
      getTokenInfo(StakingV2Type.VTHOR, ethAddr, setVthorBalBn)
    } else {
      setThorBalBn(BigNumber.from(0))
      setVthorBalBn(BigNumber.from(0))
    }
  }, [ethAddr, getTokenInfo])

  const getVthorAPR = useCallback(async () => {
    const apr = await getVthorAPRUtil(fromWei(thorStaked)).catch(() =>
      setVthorApr(0),
    )

    if (apr) setVthorApr(apr)
  }, [thorStaked])

  useEffect(() => {
    getVthorAPR()
  }, [getVthorAPR])

  const handleMaxClick = useCallback(() => {
    const maxAmountBN = Amount.fromBaseAmount(
      action === StakeActions.Deposit
        ? new BN(thorBalBn.toString())
        : new BN(vthorBalBn.toString()),
      18,
    ).assetAmount

    setInputAmount(Amount.fromAssetAmount(new BN(maxAmountBN.toString()), 18))

    if (action === StakeActions.Deposit) {
      const expectedOutput = previewDeposit(
        BigNumber.from(toWeiFromString(maxAmountBN.toString())),
      )
      setOutputAmount(expectedOutput)
    } else {
      const expectedOutput = previewRedeem(
        BigNumber.from(toWeiFromString(maxAmountBN.toString())),
      )
      setOutputAmount(expectedOutput)
    }
  }, [action, thorBalBn, vthorBalBn, previewDeposit, previewRedeem])

  const onAmountChange = useCallback(
    (amount: Amount, targetAction?: StakeActions) => {
      const stakeAction = targetAction || action
      // TODO: validation (cannot exceed max amount)
      setInputAmount(amount)

      if (stakeAction === StakeActions.Deposit) {
        const expectedOutput = previewDeposit(
          BigNumber.from(toWei(amount.assetAmount.toNumber())),
        )
        setOutputAmount(expectedOutput)
      } else {
        const expectedOutput = previewRedeem(
          BigNumber.from(toWei(amount.assetAmount.toNumber())),
        )
        setOutputAmount(expectedOutput)
      }
    },
    [action, previewDeposit, previewRedeem],
  )

  const handleRefresh = useCallback(() => {
    setIsFetching(true)

    refreshStats()

    setTimeout(() => setIsFetching(false), 1000)
  }, [refreshStats])

  const handleAction = useCallback(() => {
    if (ethAddr) {
      if (action === StakeActions.Deposit) {
        stakeThor(toWei(inputAmount.assetAmount.toNumber()), ethAddr)
      } else if (action === StakeActions.Unstake) {
        unstakeThor(toWei(inputAmount.assetAmount.toNumber()), ethAddr)
      }
    }
  }, [action, ethAddr, inputAmount, stakeThor, unstakeThor])

  return (
    <Box className="self-center w-full max-w-[480px]" col mt={2}>
      <Helmet
        title={t('views.stakingVThor.stakeVThorTitle')}
        content={t('views.stakingVThor.stakeVThorTitle')}
      />

      <Box className="w-full" col>
        <ViewHeader title={t('views.stakingVThor.stakeVThorTitle')} />
      </Box>

      <Box className="!mx-3" alignCenter justify="between">
        <Typography color="secondary" fontWeight="medium" variant="caption">
          {t('views.stakingVThor.stakeVThorSubtitle')}
        </Typography>
        <Tooltip content={t('views.stakingVThor.stakeInfo')}>
          <Icon name="infoCircle" size={24} color="primaryBtn" />
        </Tooltip>
      </Box>

      <InfoTip type="info" className="!mt-5">
        <Box className="self-stretch gap-3 px-3 py-2" col>
          <Box
            className="pb-2 border-0 border-b border-solid border-opacity-20 border-light-border-primary dark:border-dark-border-primary"
            row
            alignCenter
            justify="between"
          >
            <Typography variant="subtitle2" fontWeight="semibold">
              {t('views.stakingVThor.statTitle')}
            </Typography>
            <Box row alignCenter>
              <HoverIcon
                iconName="refresh"
                spin={isFetching}
                onClick={handleRefresh}
              />
            </Box>
          </Box>
          <Box className="gap-2" row alignCenter justify="between">
            <Box className="gap-x-1" row alignCenter>
              <Typography
                color="secondary"
                variant="caption"
                fontWeight="medium"
              >
                {t('views.stakingVThor.stakingApy')}
              </Typography>

              <Tooltip
                className="cursor-pointer"
                content={t('views.stakingVThor.apyTip')}
              >
                <Icon name="infoCircle" size={16} color="primaryBtn" />
              </Tooltip>
            </Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {toOptionalFixed(vthorApr)}%
            </Typography>
          </Box>
          <Box className="gap-2" row alignCenter justify="between">
            <Box className="gap-x-1" row alignCenter>
              <Typography
                color="secondary"
                variant="caption"
                fontWeight="medium"
              >
                {t('views.stakingVThor.totalThor')}
              </Typography>

              <Tooltip
                className="cursor-pointer"
                content={t('views.stakingVThor.totalThorTip')}
              >
                <Icon name="infoCircle" size={16} color="primaryBtn" />
              </Tooltip>
            </Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {ethAddr ? formatter(thorRedeemable) : '-'}
            </Typography>
          </Box>
          <Box className="gap-2" row alignCenter justify="between">
            <Box className="gap-x-1" row alignCenter>
              <Typography
                color="secondary"
                variant="caption"
                fontWeight="medium"
              >
                {t('views.stakingVThor.vthorBal')}
              </Typography>
            </Box>
            <Typography variant="subtitle2" fontWeight="medium">
              {ethAddr ? formatter(fromWei(vthorBalance)) : '-'}
            </Typography>
          </Box>
        </Box>
      </InfoTip>

      <Card
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
        size="lg"
        stretch
      >
        <Box className="self-stretch">
          <TabsSelect
            tabs={tabs}
            value={action}
            onChange={(val: string) => {
              setAction(val as StakeActions)
              onAmountChange(inputAmount, val as StakeActions)
            }}
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
          >
            <Icon
              size={20}
              className="p-1 transition-all"
              name="arrowDown"
              color="white"
            />
          </Box>
          <HighlightCard
            className={classNames(
              '!gap-1 !justify-start flex-1 !px-4 md:!px-6 !py-4',
            )}
          >
            <Box className="self-stretch flex-1 md:pl-0" alignCenter col>
              <Box className="gap-3 self-stretch !mb-3">
                <Box alignCenter justify="between" flex={1}>
                  <Typography
                    className="-ml-1"
                    color="secondary"
                    fontWeight="normal"
                  >
                    {t('views.stakingVThor.send')}
                  </Typography>
                  <Box className="gap-1 pr-2 md:pr-0" center row>
                    <Typography color="secondary" fontWeight="medium">
                      {t('common.balance')}:{' '}
                      {action === StakeActions.Deposit
                        ? toOptionalFixed(fromWei(thorBalBn))
                        : toOptionalFixed(fromWei(vthorBalBn))}
                    </Typography>

                    <Button
                      className="!h-5 !px-1.5"
                      type="outline"
                      variant="secondary"
                      transform="uppercase"
                      onClick={handleMaxClick}
                    >
                      {t('common.max')}
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box className="self-stretch flex-1">
                <Box flex={1}>
                  <InputAmount
                    className={classNames(
                      '-ml-1 !text-2xl font-normal text-left flex-1',
                    )}
                    containerClassName="!py-0"
                    amountValue={inputAmount}
                    onAmountChange={onAmountChange}
                    stretch
                  />
                </Box>

                <Box className="gap-3" center>
                  <Typography variant="subtitle2">
                    {action === StakeActions.Deposit ? 'THOR' : 'vTHOR'}
                  </Typography>
                  <AssetIcon asset={assets[action]} size={34} />
                </Box>
              </Box>
            </Box>
          </HighlightCard>
        </Box>

        <Card className="!bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl self-stretch !py-3 gap-2 justify-between md:px-6">
          <Box className="self-stretch flex-1 md:pl-0" col>
            <Box className="gap-3 self-stretch !mb-3">
              <Typography
                className="-ml-1"
                fontWeight="normal"
                color="secondary"
              >
                {t('views.stakingVThor.receive')}:
              </Typography>
            </Box>
            <Box className="self-stretch flex-1">
              <Box flex={1}>
                <Typography
                  className="-ml-1 !text-2xl text-left flex-1"
                  fontWeight="normal"
                >
                  {formatter(toOptionalFixed(outputAmount))}
                </Typography>
              </Box>

              <Box className="gap-3" center>
                <Typography variant="subtitle2">
                  {action === StakeActions.Deposit ? 'vTHOR' : 'THOR'}
                </Typography>
                <AssetIcon
                  asset={
                    action === StakeActions.Deposit
                      ? assets[StakeActions.Unstake]
                      : assets[StakeActions.Deposit]
                  }
                  size={34}
                />
              </Box>
            </Box>
          </Box>
        </Card>

        <Card className="self-stretch align-center !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl !py-2.5">
          <Box className="flex-1 gap-2" alignCenter justify="between">
            <Box className="gap-2" center>
              <Button
                className="!p-1 !h-auto"
                type="outline"
                startIcon={<Icon name="switch" size={16} />}
                onClick={() => setReverted((prev) => !prev)}
              />

              <Typography variant="caption" color="primary" fontWeight="normal">
                {getRate(isReverted)}
              </Typography>
            </Box>

            <Tooltip content={t('views.wallet.priceRate')}>
              <Icon
                className={baseTextHoverClass}
                name="infoCircle"
                size={20}
                color="secondary"
              />
            </Tooltip>
          </Box>
        </Card>

        <Box className="self-stretch pt-5">
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
            <Box className="w-full">
              {action === StakeActions.Deposit ? (
                <>
                  {!isTHORApproved ? (
                    <Button
                      isFancy
                      stretch
                      size="lg"
                      loading={false}
                      onClick={approveTHOR}
                    >
                      {t('txManager.approve')}
                    </Button>
                  ) : (
                    <Button
                      isFancy
                      stretch
                      size="lg"
                      loading={false}
                      disabled={inputAmount.assetAmount.toNumber() === 0}
                      onClick={handleAction}
                    >
                      {t('txManager.stake')}
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  isFancy
                  stretch
                  size="lg"
                  loading={false}
                  disabled={
                    inputAmount.assetAmount.toNumber() === 0 ||
                    fromWei(vthorBalance) === 0
                  }
                  onClick={handleAction}
                >
                  {t('views.stakingVThor.unstake')}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default StakeVThor
