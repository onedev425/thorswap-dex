import { Box, Button } from 'components/Atomic';
import { useStepper } from 'components/Stepper/StepperContext';
import { t } from 'services/i18n';

type Props = {
  backLabel?: string;
  backAction?: () => void;
  nextLabel?: string;
  nextAction?: () => void;
  nextDisabled?: boolean;
  backHidden?: boolean;
};

export const StepActions = ({
  backLabel,
  backAction,
  nextAction,
  nextLabel,
  nextDisabled,
  backHidden,
}: Props) => {
  const { prevStep, nextStep } = useStepper();

  return (
    <Box
      className="gap-2 border-0 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20 mt-5 pt-5"
      flex={1}
    >
      {!backHidden && (
        <Button stretch onClick={backAction || prevStep} variant="borderlessTint">
          {backLabel || t('common.back')}
        </Button>
      )}
      <Button
        stretch
        disabled={nextDisabled}
        onClick={nextAction || nextStep}
        variant="outlinePrimary"
      >
        {nextLabel || t('common.next')}
      </Button>
    </Box>
  );
};
