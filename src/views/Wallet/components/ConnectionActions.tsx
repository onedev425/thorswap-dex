import { Box, Button, Icon } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  isLoading: boolean;
  isConnected: boolean;
  handleRefreshChain: () => void;
  toggleConnect: () => void;
};

export const ConnectionActions = ({
  isLoading,
  isConnected,
  handleRefreshChain,
  toggleConnect,
}: Props) => {
  return (
    <Box className="gap-2">
      {isConnected ? (
        <>
          <Button
            className="px-3"
            onClick={handleRefreshChain}
            startIcon={<Icon color="primaryBtn" name="refresh" size={16} spin={isLoading} />}
            tooltip={t('common.refresh')}
            type="outline"
            variant="primary"
          />
          <Button
            className="px-3"
            onClick={toggleConnect}
            startIcon={<Icon color="orange" name="disconnect" size={16} />}
            tooltip={t('common.disconnect')}
            type="outline"
            variant="warn"
          />
        </>
      ) : (
        <Button
          disabled={isLoading}
          onClick={toggleConnect}
          type={isConnected ? 'outline' : 'default'}
        >
          <Box center className="gap-x-2">
            {t('common.connect')}
          </Box>
        </Button>
      )}
    </Box>
  );
};
