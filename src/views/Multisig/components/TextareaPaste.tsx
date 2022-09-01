import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { PanelTextarea } from 'components/PanelTextarea';
import { TextAreaProps } from 'components/PanelTextarea/PanelTextarea';
import { forwardRef } from 'react';
import { t } from 'services/i18n';

type Props = TextAreaProps & {
  onPasteClick?: (val: string) => void;
  error?: string;
};

export const TextareaPaste = forwardRef<HTMLTextAreaElement, Props>(
  ({ onPasteClick, error, ...props }, ref) => {
    const paste = async () => {
      const text = await navigator.clipboard.readText();
      onPasteClick?.(text);
    };

    return (
      <Box col className="relative" flex={1}>
        <PanelTextarea
          {...props}
          className={classNames('flex-1 min-h-[100px] pt-6', props.className)}
          ref={ref}
        />
        {!!onPasteClick && (
          <Box className="absolute top-2 right-5">
            <Button
              className="!px-2 h-[30px]"
              endIcon={<Icon name="paste" size={14} />}
              onClick={paste}
              type="borderless"
              variant="tint"
            >
              {t('common.paste')}
            </Button>
          </Box>
        )}
        {props.hasError && !!error && <FieldLabel hasError label={error} />}
      </Box>
    );
  },
);
