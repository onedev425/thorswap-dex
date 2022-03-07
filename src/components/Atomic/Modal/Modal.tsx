import { Fragment, useLayoutEffect } from 'react'

import ReactTooltip from 'react-tooltip'

import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'

import { Box, Card, Icon, Typography } from 'components/Atomic'

type Props = {
  isOpened: boolean
  title: string
  children: React.ReactNode
  withBody?: boolean
  onBack?: () => void
  onClose: () => void
}

export const Modal = ({
  title,
  isOpened,
  withBody = true,
  onBack,
  onClose,
  children,
}: Props) => {
  useLayoutEffect(() => {
    if (isOpened) {
      /**
       * TODO: Refactor Tooltip to some other library as it's not working with Dialog without
       * running rebuild in next event loop
       * https://github.com/wwayne/react-tooltip/issues/40#issuecomment-147552438
       */
      setTimeout(ReactTooltip.rebuild, 0)
    }
  }, [isOpened])

  return (
    <Transition appear show={isOpened} as={Fragment}>
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
              <Dialog.Overlay className="fixed inset-0 backdrop-blur-md" />
            </Transition.Child>

            {/*
              https://headlessui.dev/react/dialog#dialog-overlay
              This element is to trick the browser into centering the modal contents.
            */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
              // eslint-disable-next-line react/jsx-no-literals
            >
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
              <div className="max-w-md inline-block overflow-y-auto mx-auto drop-shadow-2xl text-left transition-all transform max-h-[90vh]">
                <div className="flex flex-row items-center justify-between my-2 lg:m-5">
                  <Box alignCenter row>
                    {onBack && (
                      <Icon
                        className="mr-2"
                        name="arrowBack"
                        color="secondary"
                        onClick={onBack}
                      />
                    )}
                    <Typography variant="h3">{title}</Typography>
                  </Box>

                  <Box
                    center
                    className={classNames(
                      'h-10 w-10 rounded-2xl self-center border border-solid',
                      'border-light-gray-light dark:border-dark-typo-gray',
                    )}
                  >
                    <Icon
                      className="self-center"
                      name="close"
                      color="secondary"
                      size={24}
                      onClick={onClose}
                    />
                  </Box>
                </div>
                {withBody ? (
                  <Card
                    className="flex items-center justify-center"
                    stretch
                    size="lg"
                  >
                    {children}
                  </Card>
                ) : (
                  children
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
