import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useRef,
  useState,
} from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { borderHighlightClass } from 'components/constants'

export type TextAreaProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  hasError?: boolean
}

export const PanelTextarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, hasError, ...props }: TextAreaProps, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    const onFocus = useCallback(() => {
      setIsFocused(true)
    }, [])

    const onBlur = useCallback(() => {
      setIsFocused(false)
    }, [])

    return (
      <Box
        onClick={focus}
        className={classNames(
          'py-4 px-4 md:px-6 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl md:!rounded-3xl transition-all duration-300',
          'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
          {
            [borderHighlightClass]: isFocused,
            '!border-red': hasError,
          },
          className,
        )}
        col
      >
        <Box className="gap-3" alignCenter>
          <Box className="flex-1">
            <textarea
              className={classNames(
                'font-primary bg-transparent dark:placeholder-dark-typo-gray dark:text-dark-typo-primary placeholder-light-typo-gray text-light-typo-primary transition-colors',
                'border-none font-normal text-[14px] focus:outline-none resize-y',
                className,
              )}
              ref={ref || inputRef}
              onBlur={onBlur}
              onFocus={onFocus}
              {...props}
            />
          </Box>
        </Box>
      </Box>
    )
  },
)
