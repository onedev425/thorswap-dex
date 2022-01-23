import { DetailedHTMLProps, InputHTMLAttributes, useRef } from 'react'

import classNames from 'classnames'

import { Icon, IconName } from 'components/Icon'

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  icon?: IconName
}

const DEFAULT_ICON_SIZE = 16

export const Input = (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { className, placeholder, icon, onChange, value, ...restProps } = props

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex w-fit flex-row border-b border-l-0 border-r-0 border-solid border-t-0 py-2 border-light-border-primary focus-within:border-dark-typo-gray dark:border-dark-border-primary hover:border-dark-typo-gray dark:hover:border-dark-typo-gray focus-within::hover:border-dark-typo-gray transition-colors"
    >
      {icon && (
        <Icon
          className="pr-4"
          color="tertiary"
          size={DEFAULT_ICON_SIZE}
          name={icon}
        />
      )}

      <input
        ref={inputRef}
        className={classNames(
          'w-52 bg-transparent border-none dark:placeholder-dark-typo-gray dark:text-dark-typo-primary font-bold font-primary placeholder-light-typo-gray text-light-typo-primary text-sm focus:outline-none',
          { 'w-44': icon },
          className,
        )}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...restProps}
      />
    </div>
  )
}
