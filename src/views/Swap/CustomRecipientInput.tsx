import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Chain } from '@thorswap-lib/types'
import copy from 'copy-to-clipboard'

import { Box, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { PanelInput } from 'components/PanelInput'
import { showInfoToast } from 'components/Toast'

import { useApp } from 'store/app/hooks'

import { useAddressForTNS } from 'hooks/useAddressForTNS'

import { t } from 'services/i18n'

type Props = {
  recipient: string
  setRecipient: (recipient: string) => void
  outputAssetL1Chain: Chain
  isOutputWalletConnected: boolean
}

export const CustomRecipientInput = memo(
  ({
    isOutputWalletConnected,
    recipient,
    setRecipient,
    outputAssetL1Chain,
  }: Props) => {
    const { customRecipientMode } = useApp()
    const [thorname, setThorname] = useState('')
    const [disabled, setDisabled] = useState(false)

    const { loading, TNS, setTNS } = useAddressForTNS(recipient)

    const TNSAddress = useMemo(
      () =>
        TNS
          ? TNS.entries.find(({ chain }) => chain === outputAssetL1Chain)
              ?.address
          : '',
      [TNS, outputAssetL1Chain],
    )

    const toggleDisabled = useCallback(() => setDisabled((d) => !d), [])

    const handleCopyAddress = useCallback(() => {
      copy(recipient)
      showInfoToast(t('notification.addressCopied'))
    }, [recipient])

    const handleChangeRecipient = useCallback(
      ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setRecipient(value)
        setThorname('')
        setTNS(null)
      },
      [setRecipient, setTNS],
    )

    useEffect(() => {
      if (TNS && TNSAddress) {
        setThorname(TNS.thorname)
        setRecipient(TNSAddress)
      }
    }, [TNS, TNSAddress, setRecipient])

    const recipientTitle = useMemo(
      () =>
        TNSAddress && thorname
          ? `${t(
              'common.recipientAddress',
            )} - ${thorname}.${outputAssetL1Chain}`
          : t('common.recipientAddress'),
      [TNSAddress, outputAssetL1Chain, thorname],
    )

    if (!customRecipientMode && isOutputWalletConnected) return null

    return (
      <PanelInput
        placeholder={t('common.thornameOrRecipient')}
        stretch
        disabled={disabled}
        onChange={handleChangeRecipient}
        value={recipient}
        loading={loading}
        className="transition-all"
        title={
          <Box flex={1} alignCenter justify="between">
            <Typography variant="caption" fontWeight="normal">
              {recipientTitle}
            </Typography>

            <Box>
              <HoverIcon
                iconName={disabled ? 'edit' : 'lock'}
                size={16}
                onClick={toggleDisabled}
              />
              <HoverIcon
                iconName="copy"
                size={16}
                onClick={handleCopyAddress}
              />
            </Box>
          </Box>
        }
      />
    )
  },
)
