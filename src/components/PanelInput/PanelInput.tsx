import { ReactNode, useRef, useState } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { Input } from 'components/Input'
import { InputProps } from 'components/Input/types'
import { PanelInputTitle } from 'components/PanelInput/PanelInputTitle'

type Props = {
  title?: string
  titleComponent?: ReactNode
} & InputProps

export const PanelInput = ({ title, titleComponent, ...inputProps }: Props) => {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Box
      onClick={() => inputRef.current?.focus()}
      className={classNames(
        'pt-4 pb-2 px-4 md:px-6 self-stretch !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl transition duration-300',
        'border border-transparent border-solid hover:border-light-gray-primary dark:hover:border-dark-gray-primary',
        {
          'border-light-gray-primary hover:border-dark-gray-primary': isFocused,
        },
      )}
      col
    >
      <Box alignCenter justify="between">
        {title && !titleComponent && <PanelInputTitle>{title}</PanelInputTitle>}
        {titleComponent || null}
      </Box>

      <Input
        {...inputProps}
        ref={inputRef}
        stretch
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </Box>
  )
}
