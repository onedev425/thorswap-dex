import { forwardRef } from 'react'

import { Box, Button, Icon } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { PanelTextarea } from 'components/PanelTextarea'
import { TextAreaProps } from 'components/PanelTextarea/PanelTextarea'

import { t } from 'services/i18n'

type Props = TextAreaProps & {
  onPasteClick?: (val: string) => void
  error?: string
}

export const TextareaPaste = forwardRef<HTMLTextAreaElement, Props>(
  ({ onPasteClick, error, ...props }, ref) => {
    const paste = async () => {
      try {
        const text = await navigator.clipboard.readText()
        onPasteClick?.(text)
      } catch (e) {}
    }

    return (
      <Box className="relative" flex={1} col>
        <PanelTextarea
          {...props}
          className={['flex-1 min-h-[300px] pt-6', props.className].join(' ')}
          ref={ref}
        />
        {!!onPasteClick && (
          <Box className="absolute top-2 right-5">
            <Button
              className="!px-2 h-[30px]"
              type="borderless"
              variant="tint"
              endIcon={<Icon size={14} name="paste" />}
              onClick={paste}
            >
              {t('common.paste')}
            </Button>
          </Box>
        )}
        {props.hasError && !!error && <FieldLabel hasError label={error} />}
      </Box>
    )
  },
)
