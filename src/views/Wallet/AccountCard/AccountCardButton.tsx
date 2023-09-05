import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import type { IconName } from 'components/Atomic';
import { Box, Button, Icon } from 'components/Atomic';
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
          leftIcon={
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
          onClick={onClick}
          size="md"
          tooltip={tooltip}
          variant="tint"
        />
        <Text
          className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
          fontWeight="medium"
          textStyle="caption"
          variant="secondary"
        >
          {label}
        </Text>
      </Box>
    );
  },
);
