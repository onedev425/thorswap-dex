import React, { ReactNode } from 'react'

import { Toaster, ToastOptions, toast, ToastBar } from 'react-hot-toast'

import classNames from 'classnames'

import { Typography, Icon, Box } from 'components/Atomic'

export enum ToastType {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.Error:
      return <Icon className="min-w-[24px]" name="xCircle" color="pink" />

    case ToastType.Success:
      return <Icon className="min-w-[24px]" name="checkmark" color="green" />

    case ToastType.Info:
      return <Icon className="min-w-[24px]" name="infoCircle" color="cyan" />

    default:
      return null
  }
}

type ShowToastFunction = (params: {
  message: string
  description?: string | ReactNode
  type?: ToastType
  options?: Partial<
    Pick<ToastOptions, 'position' | 'duration' | 'style' | 'className'>
  >
}) => void

type ToastFunction = (
  message: string,
  descriptionOrOptions?: string | ReactNode | Partial<ToastOptions>,
  options?: Partial<ToastOptions>,
) => void

const showToast: ShowToastFunction = ({
  message,
  description,
  type = ToastType.Info,
  options = {},
}) => {
  const icon = getToastIcon(type)
  const duration = options.duration || type === ToastType.Error ? 10000 : 5000

  toast.custom(
    ({ id }) => (
      <Box
        className="max-w-[375px] z-50 items-center p-2 m-2 border border-solid drop-shadow-md rounded-xl border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-secondary"
        row
      >
        <Box onClick={() => toast.remove(id)} col className="w-fit">
          <Box col>
            <Box alignCenter justify="between">
              <Box alignCenter>
                <Box>{icon}</Box>

                <Box className={classNames('pr-2', { 'pl-2': icon })} col>
                  <Typography
                    variant="caption"
                    fontWeight={description ? 'bold' : 'medium'}
                  >
                    {message}
                  </Typography>
                </Box>
              </Box>

              <Icon name="close" color="primary" size={18} />
            </Box>

            <Box className="pl-8 pr-4">
              {typeof description === 'string' ? (
                <Typography variant="caption-xs" fontWeight="light">
                  {description}
                </Typography>
              ) : (
                description
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    ),
    { ...options, duration },
  )
}

const showToastWrapper: (type?: ToastType) => ToastFunction =
  (type) => (message, descriptionOrOptions, options) => {
    const descriptionProvided =
      React.isValidElement(descriptionOrOptions) ||
      typeof descriptionOrOptions === 'string'

    const providedOptions = descriptionProvided
      ? options
      : (descriptionOrOptions as Partial<ToastOptions>)

    showToast({
      options: providedOptions,
      type: type || ToastType.Info,
      message,
      description: descriptionProvided ? descriptionOrOptions : '',
    })
  }

export const showSuccessToast = showToastWrapper(ToastType.Success)
export const showErrorToast = showToastWrapper(ToastType.Error)
export const showInfoToast = showToastWrapper(ToastType.Info)

export const ToastPortal = () => {
  return (
    <Toaster gutter={16} position="bottom-right" containerClassName="m-4">
      {(t) => (
        <div style={{ cursor: 'pointer' }} onClick={() => toast.dismiss(t.id)}>
          <ToastBar toast={t} />
        </div>
      )}
    </Toaster>
  )
}
