import classNames from 'classnames';
import { Box, Button, Icon, IconName, Typography } from 'components/Atomic';
import { memo } from 'react';

type Props = {
  label: string;
  onClick?: () => void;
  icon: IconName;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
};

export const AccountCardButton = memo(
  ({ className, label, onClick, icon, disabled, tooltip }: Props) => {
    return (
      <Box center col className="group gap-y-2">
        <Button
          className="!w-12 px-0"
          disabled={disabled}
          onClick={onClick}
          size="md"
          startIcon={
            <Icon
              className={classNames(
                'group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary min-w-[20px]',
                className,
              )}
              color="secondary"
              name={icon}
              size={20}
            />
          }
          tooltip={tooltip}
          variant="tint"
        />
        <Typography
          className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
          color="secondary"
          fontWeight="medium"
          variant="caption"
        >
          {label}
        </Typography>
      </Box>
    );
  },
);
