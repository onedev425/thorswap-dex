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
      return <Icon name="xCircle" color="red" />

    case ToastType.Success:
      return <Icon name="checkmark" color="green" />

    default:
      return null
  }
}

type ShowToastFunction = (
  content: {
    message: string
    description?: string | React.ReactNode
  },
  type?: ToastType,
  options?: Pick<ToastOptions, 'position' | 'duration' | 'style' | 'className'>,
) => void

export const showLongToast: ShowToastFunction = (content, type, options) =>
  showToast(content, type, { ...options, duration: 60 * 1000 })

export const showToast: ShowToastFunction = (
  content,
  type = ToastType.Info,
  options = {},
) => {
  const icon = getToastIcon(type)
  const duration = options.duration || type === ToastType.Error ? 10000 : 5000

  toast.custom(
    <Box
      row
      className={classNames(
        'py-2 px-4 m-20 rounded-xl',
        'border border-solid border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary' +
          ' dark:bg-dark-bg-secondary items-center',
      )}
    >
      <Box col className="max-w-[240px]">
        <Typography className={classNames({ 'pr-2': icon })} variant="caption">
          {content.message}
        </Typography>
        {content.description && typeof content.description === 'string' ? (
          <Typography
            className={classNames({ 'pr-2': icon })}
            variant="caption-xs"
            fontWeight="light"
          >
            {content.description}
          </Typography>
        ) : (
          content.description
        )}
      </Box>
      {icon}
    </Box>,
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
