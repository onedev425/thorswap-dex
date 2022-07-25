import { useEffect, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Link, Typography } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'

import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'
import { multisig } from 'services/multisig'

import { getSendRoute } from 'settings/constants'

export const InactiveAccountWarning = () => {
  const { address } = useAppSelector((state) => state.multisig)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkIsInitialized = async () => {
      const isInitialized = await multisig.isMultisigInitialized()
      setIsVisible(!isInitialized)
    }

    if (address) {
      checkIsInitialized()
    }
  }, [address])

  if (!isVisible) {
    return null
  }

  return (
    <InfoTip
      title={t('Account not activated')}
      content={
        <Box className="gap-2" col>
          <Typography>
            Your THORSafe account is not active yet. To use it you need to send
            any amount of RUNE to it.
          </Typography>
          <Link to={getSendRoute(Asset.RUNE(), address)}>
            <Button stretch variant="secondary">
              Send RUNE
            </Button>
          </Link>
        </Box>
      }
      type="warn"
    />
  )
}
