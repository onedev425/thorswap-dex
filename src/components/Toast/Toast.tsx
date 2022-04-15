import { ReactNode } from 'react'

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

type ShowToastFunction = (
  content: {
    message: string
    description?: string | ReactNode
  },
  type?: ToastType,
  options?: Pick<ToastOptions, 'position' | 'duration' | 'style' | 'className'>,
) => void

export const showLongToast: ShowToastFunction = (content, type, options) =>
  showToast(content, type, { ...options, duration: 60 * 1000 })

export const showToast: ShowToastFunction = (
  { description, message },
  type = ToastType.Info,
  options = {},
) => {
  const icon = getToastIcon(type)
  const duration = options.duration || type === ToastType.Error ? 10000 : 5000

  toast.custom(
    ({ id }) => (
      <Box
        className="z-50 items-center px-4 py-2 m-20 border border-solid drop-shadow-md rounded-xl border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-secondary"
        row
      >
        <Box col className="max-w-[320px] w-[280px]">
          <Box col>
            <Box alignCenter justify="between">
              <Box alignCenter>
                {icon}
                <Box className={classNames({ 'pl-2': icon })} col>
                  <Typography
                    variant="caption"
                    fontWeight={description ? 'bold' : 'medium'}
                  >
                    {message}
                  </Typography>
                </Box>
              </Box>
              <Icon
                name="close"
                color="primary"
                size={18}
                onClick={() => toast.remove(id)}
              />
            </Box>
            <Box className="pl-8">
              {description && typeof description === 'string' ? (
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
