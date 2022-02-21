import { Toaster, ToastOptions, toast, ToastBar } from 'react-hot-toast'

import classNames from 'classnames'

import { Row, Typography, Icon } from 'components/Atomic'

export enum ToastType {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.Error:
      return <Icon name="xCircle" color="red" />

    case ToastType.Success:
      return <Icon name="checkmark" color="green" />

    default:
      return null
  }
}

type ShowToastFunction = (
  message: string,
  type?: ToastType,
  options?: Pick<ToastOptions, 'position' | 'duration' | 'style' | 'className'>,
) => void

export const showLongToast: ShowToastFunction = (message, type, options) =>
  showToast(message, type, { ...options, duration: 60 * 1000 })

export const showToast: ShowToastFunction = (
  message,
  type = ToastType.Info,
  options = {},
) => {
  const icon = getToastIcon(type)
  const duration = options.duration || type === ToastType.Error ? 10000 : 5000

  toast.custom(
    <Row
      className={classNames(
        'py-2 px-4 m-20 rounded-xl',
        'border border-solid border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-secondary',
      )}
    >
      <Typography className={classNames({ 'pr-2': icon })} variant="caption">
        {message}
      </Typography>
      {icon}
    </Row>,
    { ...options, duration },
  )
}

export const ToastPortal = () => {
  return (
    <Toaster gutter={16} position="top-right" containerClassName="m-4">
      {(t) => (
        <div style={{ cursor: 'pointer' }} onClick={() => toast.dismiss(t.id)}>
          <ToastBar toast={t} />
        </div>
      )}
    </Toaster>
  )
}
