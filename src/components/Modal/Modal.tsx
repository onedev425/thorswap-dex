import { Fragment, useLayoutEffect } from 'react'

import ReactTooltip from 'react-tooltip'

import { Dialog, Transition } from '@headlessui/react'

import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

type Props = {
  isOpened: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  withBody?: boolean
}

export const Modal = ({
  title,
  isOpened,
  withBody = true,
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
        <div className="fixed inset-0 z-10 overflow-y-auto min-h-screen px-4 text-center">
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
            <div className="max-w-md inline-block overflow-hidden drop-shadow-2xl text-left transition-all transform">
              <div className="m-5 flex flex-row align-items justify-between">
                <Dialog.Title>
                  <Typography variant="h3">{title}</Typography>
                </Dialog.Title>

                <div className="h-10 w-10 flex self-center align-items justify-center border border-solid border-light-border-primary dark:border-dark-border-primary rounded-2xl">
                  <Icon
                    onClick={onClose}
                    name="close"
                    className="self-center"
                    color="secondary"
                    size={24}
                  />
                </div>
              </div>
              {withBody ? (
                <Card className="justify-center items-center" stretch size="lg">
                  {children}
                </Card>
              ) : (
                children
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
