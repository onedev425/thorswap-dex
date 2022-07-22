import classNames from 'classnames'

import { Box, Typography, useCollapse } from 'components/Atomic'
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse'
import { HighlightCard } from 'components/HighlightCard'
import { StepType } from 'components/Stepper/types'

type Props = {
  step: StepType
  isOpened: boolean
  goToNext: () => void
  open: () => void
  isDisabled?: boolean
  hasNext: boolean
}

export const Step = ({ step, isOpened, isDisabled, open }: Props) => {
  const { contentRef, maxHeightStyle } = useCollapse({
    isOpened,
  })

  const activateStep = () => {
    if (!isDisabled) {
      open()
    }
  }

  return (
    <HighlightCard isFocused={isOpened}>
      <Box col>
        <Box
          className={classNames('gap-3', {
            'cursor-pointer': !isDisabled,
            'opacity-30': !isOpened,
          })}
          onClick={activateStep}
          alignCenter
        >
          <Box
            className={classNames('rounded-full bg-btn-primary w-5 h-5 p-0.5')}
            center
          >
            <Typography color="primary" variant="caption-xs">
              {step.id + 1}
            </Typography>
          </Box>
          <Typography>{step.label}</Typography>
        </Box>
        <div
          className={classNames('w-full', maxHeightTransitionClass)}
          style={maxHeightStyle}
        >
          <Box ref={contentRef}>
            <Box className="my-3" col>
              {step.content}
            </Box>
          </Box>
        </div>
      </Box>
    </HighlightCard>
  )
}
