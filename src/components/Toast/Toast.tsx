import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Icon } from 'components/Atomic';
import React, { ReactNode } from 'react';
import { toast, ToastBar, Toaster, ToastOptions } from 'react-hot-toast';

export enum ToastType {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.Error:
      return <Icon className="min-w-[24px]" color="pink" name="xCircle" />;

    case ToastType.Success:
      return <Icon className="min-w-[24px]" color="green" name="checkmark" />;

    case ToastType.Info:
      return <Icon className="min-w-[24px]" color="cyan" name="infoCircle" />;

    default:
      return null;
  }
};

type ShowToastFunction = (params: {
  message: string;
  description?: string | ReactNode;
  type?: ToastType;
  options?: Partial<Pick<ToastOptions, 'position' | 'duration' | 'style' | 'className'>>;
}) => void;

type ToastFunction = (
  message: string,
  descriptionOrOptions?: string | ReactNode | Partial<ToastOptions>,
  options?: Partial<ToastOptions>,
) => void;

const showToast: ShowToastFunction = ({
  message,
  description,
  type = ToastType.Info,
  options = {},
}) => {
  const icon = getToastIcon(type);
  const duration = options.duration || type === ToastType.Error ? 10000 : 5000;

  toast.custom(
    ({ id }) => (
      <Box
        row
        className="max-w-[375px] z-50 items-center p-2 m-2 border border-solid drop-shadow-md rounded-xl border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-secondary"
      >
        <Box col className="w-fit" onClick={() => toast.remove(id)}>
          <Box col>
            <Box alignCenter justify="between">
              <Box alignCenter>
                <Box>{icon}</Box>

                <Box col className={classNames('pr-2', { 'pl-2': icon })}>
                  <Text fontWeight={description ? 'bold' : 'medium'} textStyle="caption">
                    {message}
                  </Text>
                </Box>
              </Box>

              <Icon color="primary" name="close" size={18} />
            </Box>

            <Box className="pl-8 pr-4">
              {typeof description === 'string' ? (
                <Text fontWeight="light" textStyle="caption-xs">
                  {description}
                </Text>
              ) : (
                description
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    ),
    { ...options, duration },
  );
};

const showToastWrapper: (type?: ToastType) => ToastFunction =
  (type) => (message, descriptionOrOptions, options) => {
    const descriptionProvided =
      React.isValidElement(descriptionOrOptions) || typeof descriptionOrOptions === 'string';

    const providedOptions = descriptionProvided
      ? options
      : (descriptionOrOptions as Partial<ToastOptions>);

    showToast({
      options: providedOptions,
      type: type || ToastType.Info,
      message,
      description: descriptionProvided ? descriptionOrOptions : '',
    });
  };

export const showSuccessToast = showToastWrapper(ToastType.Success);
export const showErrorToast = showToastWrapper(ToastType.Error);
export const showInfoToast = showToastWrapper(ToastType.Info);

export const ToastPortal = () => {
  return (
    <Toaster containerClassName="m-4" gutter={16} position="bottom-right">
      {(t) => (
        <div onClick={() => toast.dismiss(t.id)} style={{ cursor: 'pointer' }}>
          <ToastBar toast={t} />
        </div>
      )}
    </Toaster>
  );
};
