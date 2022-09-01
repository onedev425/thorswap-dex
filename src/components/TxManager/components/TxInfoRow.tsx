import { Box, Icon, Link, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { TxStatusIcon } from 'components/TxManager/components/TxStatusIcon';
import { TxProgressStatus } from 'components/TxManager/types';

type Props = {
  status: TxProgressStatus;
  label: string;
  url?: string;
};

export const TxInfoRow = ({ status, label, url }: Props) => {
  return (
    <Box alignCenter justify="between">
      <Box alignCenter className="w-full space-x-3">
        <Box center style={{ width: 24, height: 24 }}>
          <TxStatusIcon size={16} status={status} />
        </Box>
        <Typography fontWeight="normal" variant="caption">
          {label}
        </Typography>
      </Box>

      {url ? (
        <Link className="inline-flex" onClick={(e) => e.stopPropagation()} to={url}>
          <Icon className={baseHoverClass} color="secondary" name="external" size={18} />
        </Link>
      ) : (
        <div />
      )}
    </Box>
  );
};
