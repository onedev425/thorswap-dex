import { useMemo } from 'react'

import { THORNameDetails } from '@thorswap-lib/midgard-sdk'
import { Asset, SupportedChain, THORName } from '@thorswap-lib/multichain-sdk'

import { thornameChainIcons } from 'views/Thorname/ChainDropdown'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'

import { useMidgard } from 'store/midgard/hooks'

import { t } from 'services/i18n'
import { getThornameExpireDate } from 'services/thorname'

import { shortenAddress } from 'helpers/shortenAddress'

type Params = {
  available: boolean
  details: THORNameDetails | null
  thorname: string
  setYears: (years: number) => void
  years: number
}

export const useThornameInfoItems = ({
  thorname,
  details,
  available,
  years,
  setYears,
}: Params) => {
  const { lastBlock } = useMidgard()
  const isAvailable = !details || available

  const data = useMemo(
    () =>
      [
        { label: t('components.sidebar.thorname'), value: thorname },
        {
          label: t('views.thorname.status'),
          value: (
            <Typography color={isAvailable ? 'green' : 'red'}>
              {t(
                `views.thorname.${
                  isAvailable
                    ? details
                      ? 'ownedByYou'
                      : 'available'
                    : 'unavailable'
                }`,
              )}
            </Typography>
          ),
        },

        ...(isAvailable
          ? [
              {
                label: details
                  ? t('views.thorname.extend')
                  : t('views.thorname.duration'),
                value: (
                  <Box alignCenter justify="between" className="gap-x-2">
                    <Button
                      className="px-1.5 group"
                      type="borderless"
                      variant="tint"
                      onClick={() => setYears(years - 1)}
                      startIcon={
                        <Icon
                          className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                          color="secondary"
                          name="minusCircle"
                        />
                      }
                    />

                    <Box center className="w-3">
                      <Typography>{years}</Typography>
                    </Box>

                    <Button
                      className="px-1.5 group"
                      type="borderless"
                      variant="tint"
                      onClick={() => setYears(years + 1)}
                      startIcon={
                        <Icon
                          className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                          color="secondary"
                          name="plusCircle"
                        />
                      }
                    />
                  </Box>
                ),
              },
              {
                label: details
                  ? t('views.thorname.updateFee')
                  : t('views.thorname.registerFee'),
                value: (
                  <Box center className="gap-x-2">
                    <AssetIcon size="tiny" asset={Asset.RUNE()} />
                    <Typography>
                      {details
                        ? years
                        : THORName.getCost(years).toSignificant(6)}{' '}
                      $RUNE
                    </Typography>
                  </Box>
                ),
              },
            ]
          : []),

        ...(details
          ? [
              {
                label: t('views.thorname.expire'),
                value: getThornameExpireDate({
                  expire: details.expire,
                  lastThorchainBlock: lastBlock?.[0]?.thorchain,
                }),
              },
              {
                label: t('views.thorname.owner'),
                value: shortenAddress(details.owner, 15),
              },
              ...details.entries.map(({ address, chain }) => ({
                key: chain,
                label: (
                  <Tooltip content={`${thorname}.${chain}`}>
                    <Icon
                      className="px-2"
                      name={thornameChainIcons[chain as SupportedChain]}
                    />
                  </Tooltip>
                ),
                value: shortenAddress(address, 15),
              })),
            ]
          : []),
      ].filter(Boolean),
    [details, isAvailable, setYears, thorname, years, lastBlock],
  )

  return details || available ? (data as InfoRowConfig[]) : []
}
