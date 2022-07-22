import { useCallback } from 'react'

import { Box } from 'components/Atomic'
import { useAccordion } from 'components/Atomic/Collapse/useAccordion'
import { Step } from 'components/Stepper/Step'
import { StepType } from 'components/Stepper/types'

type Props = {
  steps: StepType[]
  activeStep: number
  onStepChange: (stepId: number) => void
}

export const Stepper = ({ steps, activeStep, onStepChange }: Props) => {
  const onChange = useCallback(
    (step: number | null) => {
      onStepChange?.(step || 0)
    },
    [onStepChange],
  )

  const { open, isOpened } = useAccordion({
    onActiveChange: onChange,
    initIndex: activeStep,
  })

  const hasNext = useCallback(
    (id: number) => id < steps.length - 1,
    [steps.length],
  )
  const isDisabled = useCallback((id: number) => activeStep < id, [activeStep])
  const nextStep = useCallback(() => {
    if (hasNext(activeStep)) {
      open(activeStep + 1)
    }
  }, [activeStep, hasNext, open])

  return (
    <Box className="gap-1" col flex={1}>
      {steps.map((step) => (
        <Step
          key={step.id}
          step={step}
          isOpened={isOpened(step.id)}
          isDisabled={isDisabled(step.id)}
          open={() => open(step.id)}
          hasNext={hasNext(step.id)}
          goToNext={nextStep}
        />
      ))}
    </Box>
  )
}
