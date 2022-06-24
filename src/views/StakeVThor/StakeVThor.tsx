import { useCallback, useEffect, useMemo, useState } from 'react'

import { Amount, WalletOption } from '@thorswap-lib/multichain-sdk'
import BN from 'bignumber.js'
import classNames from 'classnames'
import { BigNumber } from 'ethers'

import { ConfirmVThorButton } from 'views/StakeVThor/ConfirmVThorButton'
import { ConfirmVThorModal } from 'views/StakeVThor/ConfirmVThorModal'
import { StakeActions, vThorAssets } from 'views/StakeVThor/types'
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil'
import { VThorInfo } from 'views/StakeVThor/VThorInfo'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Card, Icon, Tooltip, Typography } from 'components/Atomic'
import { baseTextHoverClass } from 'components/constants'
import { Helmet } from 'components/Helmet'
import { HighlightCard } from 'components/HighlightCard'
import { InputAmount } from 'components/InputAmount'
import { TabsSelect } from 'components/TabsSelect'
import { ViewHeader } from 'components/ViewHeader'

import { useWallet } from 'store/wallet/hooks'

import { fromWei, toWei, toWeiFromString } from 'services/contract'
import { t } from 'services/i18n'

import { VestingType } from 'helpers/assets'
import { useFormatPrice } from 'helpers/formatPrice'
import { toOptionalFixed } from 'helpers/number'

import { getTokenBalance } from './utils'

const StakeVThor = () => {
  const tabs = [
    { label: t('views.stakingVThor.stakeVThor'), value: StakeActions.Deposit },
    { label: t('views.stakingVThor.unstake'), value: StakeActions.Unstake },
  ]

  const [action, setAction] = useState(StakeActions.Deposit)
  const [thorBalBn, setThorBalBn] = useState(BigNumber.from(0))
  const [vthorBalBn, setVthorBalBn] = useState(BigNumber.from(0))
  const [inputAmount, setInputAmount] = useState(Amount.fromAssetAmount(0, 3))
  const [outputAmount, setOutputAmount] = useState(0)
  const [isReverted, setReverted] = useState(true)
  const [isModalOpened, setModalOpened] = useState(false)

  const formatter = useFormatPrice({ prefix: '' })
  const { getRate, previewDeposit, previewRedeem, stakeThor, unstakeThor } =
    useVthorUtil()
  const { wallet, setIsConnectModalOpen } = useWallet()

  const ethAddress = useMemo(() => wallet?.ETH?.address, [wallet])
  const ethWalletType = useMemo(() => wallet?.ETH?.walletType, [wallet])

  const getTokenInfo = useCallback(
    async (
      contractType: VestingType,
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
    if (ethAddress) {
      getTokenInfo(VestingType.THOR, ethAddress, setThorBalBn)
      getTokenInfo(VestingType.VTHOR, ethAddress, setVthorBalBn)
    } else {
      setThorBalBn(BigNumber.from(0))
      setVthorBalBn(BigNumber.from(0))
    }
  }, [ethAddress, getTokenInfo])

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
      const amountBN = BigNumber.from(toWei(amount.assetAmount.toNumber()))
      const expectedOutput =
        stakeAction === StakeActions.Deposit
          ? previewDeposit(amountBN)
          : previewRedeem(amountBN)

      setOutputAmount(expectedOutput)
    },
    [action, previewDeposit, previewRedeem],
  )

  const handleAction = useCallback(() => {
    if (!ethAddress) return

    const amount = toWei(inputAmount.assetAmount.toString())
    const thorAction = action === StakeActions.Deposit ? stakeThor : unstakeThor
    thorAction(amount, ethAddress)
  }, [action, ethAddress, inputAmount.assetAmount, stakeThor, unstakeThor])

  const handleVthorAction = useCallback(() => {
    if (ethWalletType === WalletOption.KEYSTORE) {
      setModalOpened(true)
    } else {
      handleAction()
    }
  }, [ethWalletType, handleAction])

  const handleStakeTypeChange = useCallback(() => {
    setAction((v) =>
      v === StakeActions.Deposit ? StakeActions.Unstake : StakeActions.Deposit,
    )
  }, [])

  const closeModal = useCallback(() => {
    setModalOpened(false)
  }, [])

  return (
    <Box className="self-center w-full max-w-[480px] mt-2" col>
      <Helmet
        title={t('views.stakingVThor.stakeVThorTitle')}
        content={t('views.stakingVThor.stakeVThorTitle')}
      />
      <ViewHeader title={t('views.stakingVThor.stakeVThorTitle')} />

      <Box className="px-3" alignCenter justify="between">
        <Typography color="secondary" fontWeight="medium" variant="caption">
          {t('views.stakingVThor.stakeVThorSubtitle')}
        </Typography>
        <Tooltip place="bottom" content={t('views.stakingVThor.stakeInfo')}>
          <Icon name="infoCircle" size={24} color="primaryBtn" />
        </Tooltip>
      </Box>

      <VThorInfo ethAddress={ethAddress} />

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
              setReverted(val !== StakeActions.Deposit)
              onAmountChange(inputAmount, val as StakeActions)
            }}
          />
        </Box>

        <Box className="relative self-stretch">
          <Box
            className={classNames(
              'z-10 absolute -mt-0.5 -bottom-6 left-1/2 -translate-x-1/2',
              'p-1 md:p-2 rounded-xl md:rounded-[18px] cursor-pointer',
              'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent hover:brightness-125 transition',
            )}
            center
            onClick={handleStakeTypeChange}
          >
            <Icon
              className={classNames('p-1 transition-all', {
                '-scale-x-100': action === StakeActions.Deposit,
              })}
              size={20}
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
                  <AssetIcon asset={vThorAssets[action]} size={34} />
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

        <ConfirmVThorButton
          action={action}
          ethAddress={ethAddress}
          setIsConnectModalOpen={setIsConnectModalOpen}
          handleVthorAction={handleVthorAction}
          emptyInput={inputAmount.assetAmount.toNumber() === 0}
        />
      </Card>

      <ConfirmVThorModal
        handleAction={handleAction}
        inputAmount={inputAmount}
        outputAmount={outputAmount}
        action={action}
        isOpened={isModalOpened}
        closeModal={closeModal}
      />
    </Box>
  )
}

export default StakeVThor
