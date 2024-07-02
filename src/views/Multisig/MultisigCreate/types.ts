import type { FieldArrayWithId, UseFormRegisterReturn } from "react-hook-form";
import type { MultisigMember } from "store/multisig/types";

export type MultisigFormValues = {
  name: string;
  threshold: number;
  members: MultisigMember[];
  signatureValidation: string;
};

export type MultisigFormFields = {
  name: UseFormRegisterReturn<"name">;
  members: FieldArrayWithId<MultisigFormValues, "members", "id">[];
  threshold: UseFormRegisterReturn<"threshold">;
};

export type SubmitMultisigForm = (onSubmit?: () => void) => void;
