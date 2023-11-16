import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { t } from 'services/i18n';
import { multisig } from 'services/multisig';
import { useMultisig } from 'store/multisig/hooks';
import type { MultisigMember } from 'store/multisig/types';
import type { MultisigFormFields, MultisigFormValues } from 'views/Multisig/MultisigCreate/types';

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
      threshold: 2,
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
  const tresholdField = register('threshold', {
    validate: (v) => v <= membersFields.length,
  });

  const [walletAddress, setWalletAddress] = useState('');

  const generateMultisigAddress = useCallback(
    async (members: MultisigMember[], threshold: number) => {
      const address = await multisig.createMultisigWallet(members, threshold);
      setWalletAddress(address || '');

      return address;
    },
    [],
  );

  useEffect(() => {
    const members = getValues('members');
    if (pubKey && !members[0].pubKey) {
      const updatedMembers = [...members];
      updatedMembers[0].pubKey = pubKey;

      setValue('members', updatedMembers);
    }
  }, [getValues, pubKey, setValue]);

  useEffect(() => {
    const subscription = watch(async (values) => {
      const { ThorchainToolbox } = await import('@swapkit/toolbox-cosmos');
      const toolbox = await ThorchainToolbox({});
      const members = await Promise.all(
        values.members?.map(async (member) => {
          if (!member) return member;

          const isThorchainAddress = await toolbox.validateAddress(member.pubKey || '');
          if (isThorchainAddress) {
            const account = await toolbox.getAccount(member.pubKey!);
            return {
              ...member,
              pubKey: account?.pubkey?.value as string,
            };
          } else {
            return member;
          }
        }) || [],
      );
      const address = await generateMultisigAddress(
        members as MultisigMember[],
        values.threshold as number,
      );

      if (address) clearErrors('signatureValidation');
    });

    return () => subscription.unsubscribe();
  }, [watch, generateMultisigAddress, setError, clearErrors]);

  const handleConfirm = useCallback(
    async (values: MultisigFormValues, onSubmit?: () => void) => {
      const address =
        walletAddress || (await generateMultisigAddress(values.members, values.threshold));

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
        threshold: values.threshold,
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
      threshold: tresholdField,
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
