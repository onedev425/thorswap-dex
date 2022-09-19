import classNames from 'classnames';
import { Box, Typography } from 'components/Atomic';
import { InfoRowProps } from 'components/InfoRow/types';

const labelVariant = {
  sm: 'caption-xs',
  md: 'caption',
  lg: 'body',
} as const;
const valueVariant = { sm: 'caption-xs', md: 'caption', lg: 'body' } as const;
const heightVariant = {
  sm: 'min-h-[30px]',
  md: 'min-h-[43px]',
  lg: 'min-h-[52px]',
} as const;

export const InfoRow = ({
  label,
  value,
  className,
  onClick,
  size = 'md',
  showBorder = true,
  capitalizeLabel = false,
}: InfoRowProps) => {
  const borderClasses =
    'border-0 border-b border-solid border-bottom border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20';

  return (
    <Box
      alignCenter
      className={classNames(
        'gap-4',
        { [borderClasses]: showBorder },
        heightVariant[size],
        className,
      )}
      justify="between"
      onClick={onClick}
    >
      {typeof label === 'string' ? (
        <Typography
          color="secondary"
          fontWeight="medium"
          transform={capitalizeLabel ? 'capitalize' : 'none'}
          variant={labelVariant[size]}
        >
          {label}
        </Typography>
      ) : (
        label
      )}

      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography
          className="text-right"
          color="primary"
          fontWeight="semibold"
          variant={valueVariant[size]}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
};
