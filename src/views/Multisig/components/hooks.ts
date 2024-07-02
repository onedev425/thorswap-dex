import type { Signer } from "@swapkit/toolbox-cosmos";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "store/store";

type FormValues = {
  signature: string;
  memberPubKey: string;
};

export const useImportSignatureForm = (onSubmit: (val: Signer) => void) => {
  const members = useAppSelector(({ multisig }) => multisig.members);

  const membersOptions = useMemo(
    () =>
      members.map((m) => {
        const label = m.name ? `${m.name}: ${m.pubKey}` : m.pubKey;
        return { value: m.pubKey, label };
      }),
    [members],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      signature: "",
      memberPubKey: membersOptions[0].value,
    },
  });

  const handleConfirm = useCallback(
    (values: FormValues) => {
      // TODO (@0xGeneral): Import signature - check if signature is correct?

      onSubmit({ pubKey: values.memberPubKey, signature: values.signature });
      reset();
    },
    [onSubmit, reset],
  );

  const signatureField = register("signature", { required: true });

  const formFields = useMemo(
    () => ({
      signature: signatureField,
    }),
    [signatureField],
  );
  const submit = handleSubmit(handleConfirm);

  const setMemberPubKey = (val: string) => setValue("memberPubKey", val);
  const setSignature = (val: string) => setValue("signature", val);

  if (watch("signature").includes("-->")) {
    const splited = watch("signature").split(" --> ");
    setValue("signature", splited[1]);
    setValue("memberPubKey", splited[0]);
  }

  return {
    submit,
    formFields,
    errors,
    setMemberPubKey,
    setSignature,
    membersOptions,
    control,
    reset,
  };
};
