import { DropdownMenu } from 'components/Atomic';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { MultisigTxType } from 'views/Multisig/TxCreate/types';

type Props = {
  onChange: (v: MultisigTxType) => void;
  selected: MultisigTxType;
};

export const TxTypeSelect = ({ onChange, selected }: Props) => {
  const options: { label: string; value: MultisigTxType }[] = useMemo(
    () => [
      { label: t('views.multisig.send'), value: MultisigTxType.send },
      { label: t('views.multisig.nodeActions'), value: MultisigTxType.bond },
      { label: t('views.multisig.deposit'), value: MultisigTxType.deposit },
      { label: t('views.multisig.withdraw'), value: MultisigTxType.withdraw },
      {
        label: t('views.multisig.customDeposit'),
        value: MultisigTxType.msgDeposit,
      },
    ],
    [],
  );

  return (
    <DropdownMenu
      stretch
      buttonClassName="shadow-none"
      menuItems={options}
      onChange={(v) => onChange(v as MultisigTxType)}
      value={selected || options[0]}
    />
  );
};
