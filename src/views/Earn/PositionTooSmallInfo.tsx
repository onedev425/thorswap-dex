import { Box, Icon, Tooltip, Typography } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { t } from 'services/i18n';

export const PositionTooSmallInfo = () => {
  return (
    <Box className="gap-1 mr-1">
      <Typography variant="caption">n/a</Typography>
      <Tooltip content={t('views.savings.positionTooSmall')}>
        <Icon className={baseTextHoverClass} color="secondary" name="infoCircle" size={20} />
      </Tooltip>
    </Box>
  );
};
