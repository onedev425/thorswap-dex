import classNames from 'classnames';
import { Box, Button, Icon } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { PanelTextarea } from 'components/PanelTextarea';
import type { TextAreaProps } from 'components/PanelTextarea/PanelTextarea';
import { showSuccessToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { forwardRef } from 'react';
import { t } from 'services/i18n';

type Props = TextAreaProps & {
  error?: string;
  copyMessage?: string;
};

export const TextareaCopy = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, error, copyMessage, value, ...props }, ref) => {
    const handleCopy = async () => {
      const text = value?.toString();

      if (text) {
        copy(text);
        const message = copyMessage || t('common.valueCopied');
        showSuccessToast(message);
      }
    };

    return (
      <Box col className="relative" flex={1}>
        <PanelTextarea
          {...props}
          className={classNames('flex-1 min-h-[100px]', className)}
          ref={ref}
          value={value}
        />

        <Box className="absolute top-2 right-5">
          <Button
            className="!px-2 h-[30px]"
            onClick={handleCopy}
            rightIcon={<Icon name="copy" size={14} />}
            variant="borderlessTint"
          >
            {t('common.copy')}
          </Button>
        </Box>

        {props.hasError && !!error && <FieldLabel hasError label={error} />}
      </Box>
    );
  },
);
