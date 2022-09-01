import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { t } from 'services/i18n';
import { multisig } from 'services/multisig';
import { useMultisig } from 'store/multisig/hooks';
import { MultisigMember } from 'store/multisig/types';
import { MultisigFormFields, MultisigFormValues } from 'views/Multisig/MultisigCreate/types';

export const MIN_MEMBERS = 2;

type Props = {
  pubKey?: string;
};

export const useMultisigForm = ({ pubKey }: Props = {}) => {
  const { addMultisigWallet } = useMultisig();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<MultisigFormValues>({
    defaultValues: {
      name: '',
      members: [
        { name: '', pubKey: '' },
        { name: '', pubKey: '' },
      ],
      treshold: 2,
    },
  });

  const {
    fields: membersFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'members',
  });

  const nameField = register('name');
  const tresholdField = register('treshold', {
    validate: (v) => v <= membersFields.length,
  });

  const [walletAddress, setWalletAddress] = useState('');

  const generateMultisigAddress = useCallback((members: MultisigMember[], treshold: number) => {
    const address = multisig.createMultisigWallet(members, treshold);
    setWalletAddress(address || '');

    return address;
  }, []);

  useEffect(() => {
    const members = getValues('members');
    if (pubKey && !members[0].pubKey) {
      const updatedMembers = [...members];
      updatedMembers[0].pubKey = pubKey;

      setValue('members', updatedMembers);
    }
  }, [getValues, pubKey, setValue]);

  useEffect(() => {
    const subscription = watch((values) => {
      const address = generateMultisigAddress(
        values.members as MultisigMember[],
        values.treshold as number,
      );

      if (address) {
        clearErrors('signatureValidation');
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, generateMultisigAddress, setError, clearErrors]);

  const handleConfirm = useCallback(
    async (values: MultisigFormValues, onSubmit?: () => void) => {
      const address = walletAddress || generateMultisigAddress(values.members, values.treshold);

      if (!address) {
        setError('signatureValidation', {
          type: 'custom',
          message: t('views.multisig.incorrectSignatures'),
        });

        return;
      }

      addMultisigWallet({
        name: values.name,
        members: values.members,
        treshold: values.treshold,
        address,
      });

      onSubmit?.();
    },
    [addMultisigWallet, generateMultisigAddress, setError, walletAddress],
  );

  const submit = (onSubmit?: () => void) => handleSubmit((data) => handleConfirm(data, onSubmit))();

  const addMember = useCallback(() => append({ name: '', pubKey: '' }), [append]);

  const formFields: MultisigFormFields = useMemo(
    () => ({
      name: nameField,
      members: membersFields,
      treshold: tresholdField,
    }),
    [membersFields, nameField, tresholdField],
  );

  const isRequiredMember = (index: number) => index < MIN_MEMBERS;

  return {
    walletAddress,
    errors,
    submit,
    formFields,
    handleSubmit,
    register,
    addMember,
    removeMember: remove,
    isRequiredMember,
  };
};
