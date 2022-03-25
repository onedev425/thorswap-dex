import { ReactNode, useEffect } from 'react'

import classNames from 'classnames'

import { Box, Icon, useCollapse } from 'components/Atomic'
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse'
import { borderHighlightClass } from 'components/constants'
import { Input } from 'components/Input'
import { useInputFocusState } from 'components/Input/hooks/useInputFocusState'
import { InputProps } from 'components/Input/types'
import { PanelInputTitle } from 'components/PanelInput/PanelInputTitle'

type Props = {
  title?: string
  titleComponent?: ReactNode
  collapsible?: boolean
} & InputProps

export const PanelInput = ({
  title,
  titleComponent,
  collapsible,
  ...inputProps
}: Props) => {
  const { ref, isFocused, focus, blur, onFocus, onBlur } = useInputFocusState()
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()

  useEffect(() => {
    if (!isActive) {
      blur()
    }
  }, [blur, isActive])

  return (
    <Box
      onClick={focus}
      className={classNames(
        'py-4 px-4 md:px-6 self-stretch !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl transition-all duration-300',
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
        {title && !titleComponent && <PanelInputTitle>{title}</PanelInputTitle>}
        {titleComponent || null}
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
          containerClassName="pyt-2 pb-0"
          ref={ref}
          stretch
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </div>
    </Box>
  )
}
