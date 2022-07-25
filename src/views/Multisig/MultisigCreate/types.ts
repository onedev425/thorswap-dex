import { FieldArrayWithId, UseFormRegisterReturn } from 'react-hook-form'

import { MultisigMember } from 'store/multisig/types'

export type MultisigFormValues = {
  name: string
  treshold: number
  members: MultisigMember[]
  signatureValidation: string
}

export type MultisigFormFields = {
  name: UseFormRegisterReturn<'name'>
  members: FieldArrayWithId<MultisigFormValues, 'members', 'id'>[]
  treshold: UseFormRegisterReturn<'treshold'>
}

export type SubmitMultisigForm = (onSubmit?: () => void) => void
