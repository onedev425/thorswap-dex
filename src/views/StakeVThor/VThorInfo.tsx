import { memo, useCallback, useEffect, useState } from 'react'

import { useV1ThorStakeInfo } from 'views/Stake/hooks'
import { AddVThorMM } from 'views/StakeVThor/AddVThorMM'
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil'

import { Box, Icon, Link, Tooltip, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTip } from 'components/InfoTip'

import { fromWei } from 'services/contract'
import { t } from 'services/i18n'

import { useFormatPrice } from 'helpers/formatPrice'
import { toOptionalFixed } from 'helpers/number'
import { fetchVthorApr } from 'helpers/staking'

import { ROUTES } from 'settings/constants'

type Props = {
  ethAddress?: string
}

export const VThorInfo = memo(({ ethAddress }: Props) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isStakeInfoOpen, setStakeInfoOpen] = useState(true)
  const [vthorApr, setVthorApr] = useState(0)
  const { thorStaked, vthorBalance, handleRefresh, thorRedeemable } =
    useVthorUtil()
  const formatPrice = useFormatPrice({ prefix: '' })
  const { hasStakedV1Thor } = useV1ThorStakeInfo()

  const handleStatsRefresh = useCallback(() => {
    setIsFetching(true)

    handleRefresh()

    setTimeout(() => setIsFetching(false), 1000)
  }, [handleRefresh])

  const getVthorAPR = useCallback(async () => {
    const stakedAmount = fromWei(thorStaked)

    if (stakedAmount > 0) {
      try {
        const apr = await fetchVthorApr(stakedAmount)
        setVthorApr(apr)
      } catch (err) {
        console.error(err)
        setVthorApr(0)
      }
    }
  }, [thorStaked])

  useEffect(() => {
    getVthorAPR()
  }, [getVthorAPR])

  useEffect(() => {
    setStakeInfoOpen(hasStakedV1Thor)
  }, [hasStakedV1Thor])

  return (
    <Box className="mt-5 gap-2" col>
      {isStakeInfoOpen && (
        <InfoTip
          title={t('views.stakingVThor.stakeInfoTitle')}
          content={
            <>
              {t('views.stakingVThor.stakeInfoDescription')}
              <Link className="text-chain-terra" to={ROUTES.LegacyStake}>
                {t('views.stakingVThor.goToUnstake')}
              </Link>
            </>
          }
          onClose={() => setStakeInfoOpen(false)}
          type="warn"
        />
      )}

      <InfoTip type="info">
        <Box className="self-stretch gap-3 px-3 py-1" col>
          <Box
            className="pb-2 border-0 border-b border-solid border-opacity-20 border-light-border-primary dark:border-dark-border-primary"
            row
            alignCenter
            justify="between"
          >
            <Typography variant="subtitle2" fontWeight="semibold">
              {t('views.stakingVThor.statTitle')}
            </Typography>

            <Box className="gap-2" row alignCenter>
              <AddVThorMM />
              <HoverIcon
                iconName="refresh"
                spin={isFetching}
                onClick={handleStatsRefresh}
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
              {vthorApr > 0 ? `${toOptionalFixed(vthorApr)}%` : '-'}
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
              {ethAddress ? formatPrice(thorRedeemable) : '-'}
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
              {ethAddress ? formatPrice(fromWei(vthorBalance)) : '-'}
            </Typography>
          </Box>
        </Box>
      </InfoTip>
    </Box>
  )
})
