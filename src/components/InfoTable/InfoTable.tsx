import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { InfoRowConfig, InfoRowSize } from 'components/InfoRow/types';
import { memo } from 'react';

type InfoTableProps = {
  items: InfoRowConfig[];
  size?: InfoRowSize;
  horizontalInset?: boolean;
  className?: string;
};

export const InfoTable = memo(
  ({ items, size: rowSize = 'md', horizontalInset, className }: InfoTableProps) => {
    return (
      <Box
        col
        className={classNames('self-stretch flex-1', { 'px-1.5': horizontalInset }, className)}
      >
        {items.map(({ className, label, key, size, value, onClick }, index, array) => {
          const rowKey = key
            ? key
            : typeof label === 'string'
            ? label?.toString()
            : typeof value === 'string'
            ? value
            : `not-a-proper-key-${index}`;

          return (
            <InfoRow
              className={classNames(className, {
                'cursor-pointer': !!onClick,
              })}
              key={rowKey}
              label={label}
              onClick={onClick}
              showBorder={array.length - 1 > index}
              size={size || rowSize}
              value={value}
            />
          );
        })}
      </Box>
    );
  },
);
