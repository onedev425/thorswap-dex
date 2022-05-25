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
  className,
  suffix,
  ...inputProps
}: Props) => {
  const { ref, isFocused, focus, blur, onFocus, onBlur } = useInputFocusState()
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()
  const fontSizeClass = useMemo(() => {
    const { length } = String(value)

    if (length > 50) {
      return '!text-[12px]'
    }

    if (length > 30) {
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
        'py-4 px-4 md:px-6 self-stretch !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl md:!rounded-3xl transition-all duration-300',
        'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
        {
          [borderHighlightClass]: isFocused,
          '!py-2': collapsible && !isActive,
        },
        className,
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
        <Box className="gap-3" alignCenter>
          <Box className="flex-1">
            <Input
              {...inputProps}
              value={value}
              className={classNames('!font-medium flex-1', fontSizeClass)}
              containerClassName={classNames('pt-2 pb-0 flex-1', {
                'flex-1': !!suffix,
              })}
              ref={ref}
              stretch
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Box>

          {suffix &&
            (typeof suffix === 'string' ? (
              <Typography variant="caption-xs" color="secondary">
                {suffix}
              </Typography>
            ) : (
              suffix
            ))}
        </Box>
      </div>
    </Box>
  )
}
