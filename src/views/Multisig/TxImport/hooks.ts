import { useCallback, useMemo } from 'react'

import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useMultisig } from 'store/multisig/hooks'

import { ROUTES } from 'settings/constants'

type FormValues = {
  tx: string
}

export const useTxImportForm = () => {
  const navigate = useNavigate()
  const { importTx } = useMultisig()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      tx: '',
    },
  })

  const handleConfirm = useCallback(
    async (values: FormValues) => {
      const tx = await importTx(values.tx)

      if (tx) {
        navigate(ROUTES.TxMultisig, { state: { tx } })
      }
    },
    [importTx, navigate],
  )

  const txField = register('tx', {
    validate: (value) => {
      try {
        JSON.parse(value)
        return true
      } catch (e) {
        return false
      }
    },
  })

  const formFields = useMemo(
    () => ({
      tx: txField,
    }),
    [txField],
  )
  const submit = handleSubmit(handleConfirm)

  const setTx = (val: string) => setValue('tx', val)

  return {
    submit,
    formFields,
    errors,
    setTx,
  }
}
