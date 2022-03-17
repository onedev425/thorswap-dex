import { Button } from 'components/Atomic'

import { ToastPortal, showLongToast, showToast, ToastType } from './Toast'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Toast',
}

export const All = () => {
  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary p-10">
      <div className="p-5">
        <Button variant="secondary" onClick={() => showToast('Test Toast')}>
          Show info toast
        </Button>
      </div>

      <div className="p-5">
        <Button onClick={() => showToast('Success Toast', ToastType.Success)}>
          Show success toast
        </Button>
      </div>

      <div className="p-5">
        <Button
          variant="tint"
          onClick={() => showToast('Error Toast', ToastType.Error)}
        >
          Show error toast
        </Button>
      </div>

      <div className="p-5">
        <Button
          variant="tertiary"
          onClick={() => showLongToast('Error Toast', ToastType.Error)}
        >
          Show error toast
        </Button>
      </div>

      <div className="p-5">
        <Button
          variant="tint"
          onClick={() =>
            showToast('Error Toast', ToastType.Error, {
              duration: 1000,
              position: 'bottom-center',
            })
          }
        >
          Show custom long error toast
        </Button>
      </div>

      <ToastPortal />
    </div>
  )
}
