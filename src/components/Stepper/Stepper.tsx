import { Box } from "components/Atomic";
import { Step } from "components/Stepper/Step";
import { useStepper } from "components/Stepper/StepperContext";

export const Stepper = () => {
  const { steps, setStep, activeStep } = useStepper();

  return (
    <Box col className="gap-1" flex={1}>
      {steps.map((step) => (
        <Step
          isDisabled={step.id > activeStep}
          isOpened={step.id === activeStep}
          key={step.id}
          open={() => setStep(step.id)}
          step={step}
        />
      ))}
    </Box>
  );
};
