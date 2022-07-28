import { useEffect, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Link, Typography } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'

import { useMultisig } from 'store/multisig/hooks'
import { useAppSelector } from 'store/store'

import { getSendRoute } from 'settings/constants'

export const InactiveAccountWarning = () => {
  const { address } = useAppSelector((state) => state.multisig)
  const { isMultsigActivated } = useMultisig()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const checkIsInitialized = async () => {
      const isInitialized = await isMultsigActivated()
      setIsVisible(!isInitialized)
    }

    if (address) {
      checkIsInitialized()
    }
  }, [address, isMultsigActivated])

  if (!isVisible) {
    return null
  }

  return (
    <InfoTip
      title="Account not activated"
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
