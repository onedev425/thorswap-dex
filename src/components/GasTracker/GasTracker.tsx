import { useMemo } from 'react'

import { chainToSigAsset, SupportedChain } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, DropdownMenu, Icon, Typography } from 'components/Atomic'

import { useGasRate } from 'hooks/useGasRate'

import { t } from 'services/i18n'

export const GasTracker = () => {
  const { chainGasRates } = useGasRate()

  const menuItems = useMemo(() => {
    return chainGasRates.map(({ chain, gasRate, gasUnit }) => {
      return {
        Component: (
          <Box row alignCenter>
            <AssetIcon
              className="mr-2"
              asset={chainToSigAsset(chain as SupportedChain)}
              size="tiny"
            />
            <Typography variant="caption">{`${gasRate} ${gasUnit}`}</Typography>
          </Box>
        ),
        value: chain,
      }
    })
  }, [chainGasRates])

  return (
    <DropdownMenu
      menuItems={menuItems}
      value="Network Status"
      openComponent={
        <Box className="gap-2" alignCenter row>
          <Icon name="gas" size={16} />
          <Typography variant="caption">{t('common.gasTracker')}</Typography>
        </Box>
      }
      onChange={() => {}}
    />
  )
}
