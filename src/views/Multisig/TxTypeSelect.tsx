import { useMemo } from 'react'

import classNames from 'classnames'

import { MultisigTxType } from 'views/Multisig/TxCreate/types'

import { DropdownMenu } from 'components/Atomic'
import { useButtonClasses } from 'components/Atomic/Button/useButtonClasses'

import { t } from 'services/i18n'

type Props = {
  onChange: (v: MultisigTxType) => void
  selected: MultisigTxType
}

export const TxTypeSelect = ({ onChange, selected }: Props) => {
  const options: { label: string; value: MultisigTxType }[] = useMemo(
    () => [
      { label: t('views.multisig.send'), value: MultisigTxType.send },
      { label: t('views.multisig.nodeActions'), value: MultisigTxType.bond },
      { label: t('views.multisig.deposit'), value: MultisigTxType.deposit },
      { label: t('views.multisig.withdraw'), value: MultisigTxType.withdraw },
    ],
    [],
  )
  const { backgroundClass } = useButtonClasses({
    size: 'sm',
    variant: 'tint',
    isFancy: false,
    error: false,
  })

  return (
    <DropdownMenu
      menuItems={options}
      value={selected || options[0]}
      onChange={(v) => onChange(v as MultisigTxType)}
      buttonClassName={classNames(backgroundClass, 'shadow-none')}
      stretch
    />
  )
}
