import { Button, Icon } from 'components/Atomic';
import { t } from 'services/i18n';

export type ReloadProps = {
  loading: boolean;
  onLoad?: () => void;
  tooltip?: string;
  size?: number;
};

export const ReloadButton = ({
  loading,
  onLoad,
  tooltip = t('common.reload'),
  size = 20,
}: ReloadProps): JSX.Element => {
  return (
    <Button
      className="px-2.5"
      onClick={onLoad}
      startIcon={<Icon name="refresh" size={size} spin={loading} />}
      tooltip={onLoad ? tooltip : ''}
      type="borderless"
      variant="tint"
    />
  );
};
