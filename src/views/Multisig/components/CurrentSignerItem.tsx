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
    <Tooltip content={t('common.copy')} key={signature}>
      <Box
        className="gap-2 cursor-pointer"
        flex={1}
        center
        onClick={handleCopySignature}
      >
        <HighlightCard
          className={classNames(
            genericBgClasses.primary,
            'truncate overflow-hidden',
          )}
        >
          <div className="flex justify-between">
            <Typography variant="caption" color="secondary">
              {pubKey}
            </Typography>
            <Icon className="pl-2" name="copy" size={16} />
          </div>
          <Typography className="break-all whitespace-normal">
            {signature}
          </Typography>
        </HighlightCard>
      </Box>
    </Tooltip>
  )
}
