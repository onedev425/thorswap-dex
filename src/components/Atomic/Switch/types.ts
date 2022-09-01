import { ChangeEventHandler } from 'react';

export type SwitchProps = {
  className?: string;
  selectedText?: string;
  unselectedText?: string;
  disabled?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
};
