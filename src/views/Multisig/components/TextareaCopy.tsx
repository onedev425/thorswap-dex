import { forwardRef } from 'react'

import classNames from 'classnames'
import copy from 'copy-to-clipboard'

import { Box, Button, Icon } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { PanelTextarea } from 'components/PanelTextarea'
import { TextAreaProps } from 'components/PanelTextarea/PanelTextarea'
import { showSuccessToast } from 'components/Toast'

import { t } from 'services/i18n'

type Props = TextAreaProps & {
  error?: string
  copyMessage?: string
}

export const TextareaCopy = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, error, copyMessage, value, ...props }, ref) => {
    const handleCopy = async () => {
      try {
        const text = value?.toString()

        if (text) {
          copy(text)
          const message = copyMessage || t('common.valueCopied')
          showSuccessToast(message)
        }
      } catch (e) {}
    }

    return (
      <Box className="relative" flex={1} col>
        <PanelTextarea
          {...props}
          value={value}
          className={classNames('flex-1 min-h-[100px]', className)}
          ref={ref}
        />

        <Box className="absolute top-2 right-5">
          <Button
            className="!px-2 h-[30px]"
            type="borderless"
            variant="tint"
            endIcon={<Icon size={14} name="copy" />}
            onClick={handleCopy}
          >
            {t('common.copy')}
          </Button>
        </Box>

        {props.hasError && !!error && <FieldLabel hasError label={error} />}
      </Box>
    )
  },
)
