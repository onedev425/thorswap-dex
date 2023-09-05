import type { StepType } from 'components/Stepper/types';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type Props = {
  children: ReactNode;
  initialStep?: number;
  steps: StepType[];
  onStepChange?: (step: number) => void;
};

export type StepperContextType = {
  steps: StepType[];
  activeStep: number;
  nextStep: () => void;
  prevStep: () => void;
  hasNextStep: boolean;
  hasPrevStep: boolean;
  getStep: (id: number) => StepType;
  setStep: (id: number) => void;
  isStepActive: (id: number) => boolean;
};

const StepperContext = createContext<StepperContextType>({} as StepperContextType);

export const useStepper = () => {
  const context = useContext(StepperContext);

  if (!context?.steps || !context.steps.length) {
    throw Error('Incorrect stepper config or missing stepper context provider');
  }

  return context;
};

export const StepperProvider = ({ children, steps, initialStep, onStepChange }: Props) => {
  const [activeStep, setActiveStep] = useState(initialStep || 0);

  const hasNextStep = activeStep < steps.length - 1;
  const hasPrevStep = activeStep > 0;

  const nextStep = useCallback(() => {
    if (hasNextStep) {
      setActiveStep((v) => v + 1);
    }
  }, [hasNextStep]);

  const prevStep = useCallback(() => {
    if (hasPrevStep) {
      setActiveStep((v) => v - 1);
    }
  }, [hasPrevStep]);

  const getStep = useCallback(
    (stepId: number) => {
      return steps[stepId] || null;
    },
    [steps],
  );

  const isStepActive = useCallback(
    (stepId: number) => {
      return activeStep === stepId;
    },
    [activeStep],
  );

  useEffect(() => {
    onStepChange?.(activeStep);
  }, [activeStep, onStepChange]);

  const value = useMemo(
    () => ({
      steps,
      activeStep,
      prevStep,
      nextStep,
      hasNextStep,
      hasPrevStep,
      getStep,
      setStep: setActiveStep,
      isStepActive,
    }),
    [activeStep, getStep, hasNextStep, hasPrevStep, isStepActive, nextStep, prevStep, steps],
  );

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
};
