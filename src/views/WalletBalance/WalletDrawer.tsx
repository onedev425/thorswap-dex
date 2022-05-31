import { Fragment, ReactNode } from 'react'

import { Dialog, Transition } from '@headlessui/react'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

type Props = {
  children: ReactNode
}

export const WalletDrawer = ({ children }: Props) => {
  const { setIsDrawerVisible, isOpened } = useWalletDrawer()

  return (
    <Transition show={isOpened}>
      <Dialog onClose={() => setIsDrawerVisible(false)}>
        <div className="fixed top-0 right-0 bottom-0 z-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 backdrop-blur-md -z-10" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="overflow-y-auto bg-light-bg-secondary dark:bg-dark-bg-secondary h-full right-0 w-[350px] shadow-inner rounded-l-xl">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
