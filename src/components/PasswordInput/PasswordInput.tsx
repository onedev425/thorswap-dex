import { ChangeEventHandler, KeyboardEventHandler, memo } from 'react'

import { Input } from 'components/Input'

import { t } from 'services/i18n'

type Props = {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  error?: boolean
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined
}

export const PasswordInput = memo(
  ({ error, onChange, value, onKeyDown, ...restProps }: Props) => {
    return (
      <Input
        onChange={onChange}
        value={value}
        type="password"
        error={error ? t('validation.invalidPassword') : undefined}
        stretch
        icon="lock"
        placeholder={t('common.password')}
        border="rounded"
        onKeyDown={onKeyDown}
        {...restProps}
      />
    )
  },
)
