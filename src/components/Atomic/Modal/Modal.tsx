import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Box, Card, Icon, Typography } from 'components/Atomic';
import { Fragment, ReactNode } from 'react';

type Props = {
  HeaderComponent?: ReactNode;
  isOpened: boolean;
  title: string;
  children: ReactNode;
  withBody?: boolean;
  onBack?: () => void;
  onClose: () => void;
  className?: string;
};

export const Modal = ({
  HeaderComponent,
  title,
  isOpened,
  withBody = true,
  onBack,
  onClose,
  children,
  className,
}: Props) => {
  return (
    <Transition appear as={Fragment} show={isOpened}>
      <Dialog as={Fragment} onClose={onClose}>
        <div className="fixed inset-0 z-20">
          <div className="relative flex items-center justify-center min-h-screen p-2 text-center lg:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 backdrop-blur-xl backdrop-brightness-90 dark:backdrop-brightness-50" />
            </Transition.Child>

            {/*
              https://headlessui.dev/react/dialog#dialog-overlay
              This element is to trick the browser into centering the modal contents.
            */}
            <span aria-hidden="true" className="inline-block h-screen align-middle">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className={classNames(
                  'max-w-md inline-block mx-2 drop-shadow-2xl text-left transition-all transform',
                  className,
                )}
              >
                <Box>{HeaderComponent}</Box>
                <Box alignCenter row className="y-2 lg:m-5 mx-5" justify="between">
                  <Box alignCenter row>
                    {onBack && (
                      <Icon
                        className="mr-2 text-light-typo-primary dark:text-dark-typo-primary"
                        name="arrowBack"
                        onClick={onBack}
                      />
                    )}
                    <Typography variant="h3">{title}</Typography>
                  </Box>

                  <Box
                    center
                    className={classNames(
                      'h-10 w-10 rounded-2xl self-center border border-solid cursor-pointer hover:brightness-90 dark:hover:brightness-110',
                      'border-light-typo-primary dark:border-dark-typo-primary',
                    )}
                    onClick={onClose}
                  >
                    <Icon className="self-center" color="primary" name="close" size={24} />
                  </Box>
                </Box>

                <Box className="max-h-[85vh] mt-3">
                  {withBody ? (
                    <Card stretch className="flex items-center justify-center" size="lg">
                      {children}
                    </Card>
                  ) : (
                    children
                  )}
                </Box>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
