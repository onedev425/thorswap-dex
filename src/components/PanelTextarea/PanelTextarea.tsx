import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { borderHighlightClass } from 'components/constants';
import { CustomResizer } from 'components/PanelTextarea/CustomResizer';
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from 'react';

export type TextAreaProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  hasError?: boolean;
};

export const PanelTextarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, hasError, ...props }: TextAreaProps, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const onFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const onBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    return (
      <Box
        col
        className={classNames(
          'px-2 py-2 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl md:!rounded-3xl transition-all duration-300',
          'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
          {
            [borderHighlightClass]: isFocused,
            '!border-red': hasError,
          },
          className,
        )}
        onClick={focus}
      >
        <Box alignCenter className="gap-3">
          <Box className="flex-1 relative">
            <CustomResizer />
            <textarea
              className={classNames(
                'py-2 px-2 md:px-4 font-primary bg-transparent dark:placeholder-dark-typo-gray dark:text-dark-typo-primary placeholder-light-typo-gray text-light-typo-primary transition-colors',
                'border-none font-normal text-[14px] focus:outline-none resize-y',
                className,
              )}
              onBlur={onBlur}
              onFocus={onFocus}
              ref={ref || inputRef}
              {...props}
            />
          </Box>
        </Box>
      </Box>
    );
  },
);
