import { useMemo } from 'react'

import { THORNameDetails } from '@thorswap-lib/midgard-sdk'
import { Asset, THORName } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'

import { t } from 'services/i18n'

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
  const isAvailable = !details || available

  const data = useMemo(
    () =>
      [
        { label: t('components.sidebar.thorname'), value: thorname },
        {
          label: t('views.thorname.status'),
          value: (
            <Typography color={isAvailable ? 'green' : 'red'}>
              {t(`views.thorname.${isAvailable ? 'available' : 'unavailable'}`)}
            </Typography>
          ),
        },
        ...(isAvailable
          ? [
              {
                label: t('views.thorname.duration'),
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
                label: t('views.thorname.registerFee'),
                value: (
                  <Box center className="gap-x-2">
                    <AssetIcon size="tiny" asset={Asset.RUNE()} />
                    <Typography>
                      {THORName.getCost(years).toSignificant(3)} $RUNE
                    </Typography>
                  </Box>
                ),
              },
            ]
          : []),
      ].filter(Boolean),
    [isAvailable, setYears, thorname, years],
  )

  return details || available ? (data as InfoRowConfig[]) : []
}
