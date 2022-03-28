import { Button, Link, Typography } from 'components/Atomic'

import { ToastPortal, showLongToast, showToast, ToastType } from './Toast'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Toast',
}

const ToastDescriptionStory = () => {
  return (
    <>
      <Typography variant="caption-xs" fontWeight="light">
        When clicking here you will be redirected to thorswap
      </Typography>
      <Link to="https://thorswap.finance/" className="no-underline pt-3">
        <Button size="sm" variant="tint" type="outline">
          Visit ThorSwap
        </Button>
      </Link>
    </>
  )
}

export const All = () => {
  return (
    <div className="bg-light-bg-primary dark:bg-dark-bg-primary p-10">
      <div className="p-5">
        <Button
          variant="secondary"
          onClick={() => showToast({ message: 'Test Toast' })}
        >
          Show info toast
        </Button>
      </div>
      <div className="p-5">
        <Button
          onClick={() =>
            showToast({ message: 'Success Toast' }, ToastType.Success)
          }
        >
          Show success toast
        </Button>
      </div>
      <div className="p-5">
        <Button
          variant="tint"
          onClick={() => showToast({ message: 'Error Toast' }, ToastType.Error)}
        >
          Show error toast
        </Button>
      </div>
      <div className="p-5">
        <Button
          variant="tertiary"
          onClick={() =>
            showLongToast({ message: 'Error Toast' }, ToastType.Error)
          }
        >
          Show error toast
        </Button>
      </div>
      <div className="p-5">
        <Button
          variant="tint"
          onClick={() =>
            showToast({ message: 'Error Toast' }, ToastType.Error, {
              duration: 1000,
              position: 'bottom-center',
            })
          }
        >
          Show custom long error toast
        </Button>
      </div>
      <div className="p-5">
        <Button
          variant="tint"
          onClick={() =>
            showToast({
              message: 'Toast Title',
              description:
                'Toast description Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
            })
          }
        >
          Show custom description toast
        </Button>
      </div>
      <div className="p-5">
        <Button
          variant="tint"
          onClick={() =>
            showToast({
              message: 'Toast Title',
              description: ToastDescriptionStory(),
            })
          }
        >
          Show custom description as component
        </Button>
      </div>
      <ToastPortal />
    </div>
  )
}
