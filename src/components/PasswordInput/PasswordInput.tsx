import { Input } from 'components/Input';
import { ChangeEventHandler, KeyboardEventHandler, memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement> | undefined;
};

export const PasswordInput = memo(({ error, onChange, value, onKeyDown, ...restProps }: Props) => {
  return (
    <Input
      stretch
      border="rounded"
      error={error ? t('validation.invalidPassword') : undefined}
      icon="lock"
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={t('common.password')}
      type="password"
      value={value}
      {...restProps}
    />
  );
});
