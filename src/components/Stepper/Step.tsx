import classNames from 'classnames';
import { Box, Typography, useCollapse } from 'components/Atomic';
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse';
import { genericBgClasses } from 'components/constants';
import { HighlightCard } from 'components/HighlightCard';
import { HoverIcon } from 'components/HoverIcon';
import { StepType } from 'components/Stepper/types';

type Props = {
  step: StepType;
  isOpened: boolean;
  isDisabled: boolean;
  open: () => void;
};

export const Step = ({ step, isOpened, isDisabled, open }: Props) => {
  const { contentRef, maxHeightStyle } = useCollapse({
    isOpened,
  });

  const activateStep = () => {
    if (!isDisabled) {
      open();
    }
  };

  return (
    <HighlightCard className="!p-3" isFocused={isOpened}>
      <Box col>
        <Box
          alignCenter
          className={classNames('sm:p-2 gap-3', {
            'cursor-pointer': !isDisabled,
            'opacity-30': !isOpened,
          })}
          onClick={activateStep}
        >
          <Box
            center
            className={classNames(
              'rounded-full w-5 h-5 p-0.5',
              isDisabled ? genericBgClasses.primary : 'bg-btn-primary',
            )}
          >
            <Typography color="primary" variant="caption-xs">
              {step.id + 1}
            </Typography>
          </Box>
          <Box className="justify-between align-middle w-full">
            <Typography className="flex items-center">{step.label}</Typography>
            {step.tooltip && (
              <HoverIcon color="secondary" iconName="infoCircle" tooltip={step.tooltip} />
            )}
          </Box>
        </Box>
        <div className={classNames('w-full', maxHeightTransitionClass)} style={maxHeightStyle}>
          <Box ref={contentRef}>
            <Box col className="my-3" flex={1}>
              {step.content}
            </Box>
          </Box>
        </div>
      </Box>
    </HighlightCard>
  );
};
