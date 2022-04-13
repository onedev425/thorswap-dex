import { Box, Button, Icon } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  isLoading: boolean
  isConnected: boolean
  handleRefreshChain: () => void
  toggleConnect: () => void
}

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
            variant="primary"
            type="outline"
            startIcon={
              <Icon
                name="refresh"
                color="primaryBtn"
                size={16}
                spin={isLoading}
              />
            }
            tooltip={t('common.refresh')}
            onClick={handleRefreshChain}
          />
          <Button
            className="px-3"
            variant="warn"
            type="outline"
            startIcon={<Icon name="disconnect" color="orange" size={16} />}
            tooltip={t('common.disconnect')}
            onClick={toggleConnect}
          />
        </>
      ) : (
        <Button
          disabled={isLoading}
          type={isConnected ? 'outline' : 'default'}
          onClick={toggleConnect}
        >
          <Box center className="gap-x-2">
            {t('common.connect')}
          </Box>
        </Button>
      )}
    </Box>
  )
}
