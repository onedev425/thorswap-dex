import { ReactNode, useEffect, useMemo } from 'react'

import classNames from 'classnames'

import { Box, Icon, Typography, useCollapse } from 'components/Atomic'
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse'
import { borderHighlightClass } from 'components/constants'
import { Input } from 'components/Input'
import { useInputFocusState } from 'components/Input/hooks/useInputFocusState'
import { InputProps } from 'components/Input/types'

type Props = Omit<InputProps, 'title'> & {
  title: string | ReactNode
  collapsible?: boolean
}

export const PanelInput = ({
  title,
  collapsible,
  value,
  ...inputProps
}: Props) => {
  const { ref, isFocused, focus, blur, onFocus, onBlur } = useInputFocusState()
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()
  const fontSizeClass = useMemo(() => {
    const { length } = String(value)

    if (length > 50) {
      return '!text-[12px]'
    }

    if (length > 45) {
      return '!text-[13px]'
    }

    if (length > 40) {
      return '!text-[14px]'
    }

    return '!text-[16px]'
  }, [value])

  useEffect(() => {
    if (!isActive) {
      blur()
    }
  }, [blur, isActive])

  return (
    <Box
      onClick={focus}
      className={classNames(
        'py-4 px-4 md:px-6 self-stretch !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl md:!rounded-3xl transition-all duration-300',
        'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
        {
          [borderHighlightClass]: isFocused,
          '!py-2': collapsible && !isActive,
        },
      )}
      col
    >
      <Box
        className={classNames({ 'cursor-pointer': collapsible })}
        alignCenter
        justify="between"
        onClick={toggle}
      >
        {typeof title === 'string' ? (
          <Typography variant="caption" fontWeight="normal">
            {title}
          </Typography>
        ) : (
          title
        )}

        {collapsible && (
          <Icon
            size={20}
            name="chevronDown"
            color="secondary"
            className={classNames('transform duration-300 ease inline-block', {
              '-rotate-180': isActive,
            })}
          />
        )}
      </Box>

      <div
        className={maxHeightTransitionClass}
        ref={contentRef}
        style={collapsible ? maxHeightStyle : undefined}
      >
        <Input
          {...inputProps}
          value={value}
          className={classNames('!font-medium', fontSizeClass)}
          containerClassName="pt-2 pb-0"
          ref={ref}
          stretch
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </Box>
  )
}
