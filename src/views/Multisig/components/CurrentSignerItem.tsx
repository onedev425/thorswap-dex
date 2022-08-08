import classNames from 'classnames'
import copy from 'copy-to-clipboard'

import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { HighlightCard } from 'components/HighlightCard'
import { showSuccessToast } from 'components/Toast'

import { t } from 'services/i18n'

type Props = {
  pubKey: string
  signature: string
}

export const CurrentSignerItem = ({ pubKey, signature }: Props) => {
  const handleCopySignature = () => {
    copy(`${pubKey} --> ${signature}`)
    showSuccessToast(t('views.multisig.signatureCopied'))
  }
  return (
    <Tooltip content={t('views.multisig.copyYourSignature')} key={signature}>
      <Box
        className="cursor-pointer"
        flex={1}
        center
        onClick={handleCopySignature}
      >
        <HighlightCard
          className={classNames(
            genericBgClasses.primary,
            '!py-2 !px-4 truncate overflow-hidden',
          )}
        >
          <div className="flex justify-between">
            <Typography variant="caption" color="secondary">
              {t('views.multisig.yourSignature')}
            </Typography>
            <Icon className="px-2" name="copy" size={16} />
          </div>
          <Typography className="break-all whitespace-normal" variant="caption">
            {signature}
          </Typography>
        </HighlightCard>
      </Box>
    </Tooltip>
  )
}
