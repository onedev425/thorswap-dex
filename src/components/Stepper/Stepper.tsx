import { Box } from 'components/Atomic'
import { Step } from 'components/Stepper/Step'
import { useStepper } from 'components/Stepper/StepperContext'

export const Stepper = () => {
  const { steps, setStep, activeStep } = useStepper()

  return (
    <Box className="gap-1" col flex={1}>
      {steps.map((step) => (
        <Step
          key={step.id}
          step={step}
          isOpened={step.id === activeStep}
          isDisabled={step.id > activeStep}
          open={() => setStep(step.id)}
        />
      ))}
    </Box>
  )
}
