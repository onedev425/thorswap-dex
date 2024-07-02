import { Box, Button, Icon } from "components/Atomic";
import { t } from "services/i18n";

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
            leftIcon={<Icon color="primaryBtn" name="refresh" size={16} spin={isLoading} />}
            onClick={handleRefreshChain}
            tooltip={t("common.refresh")}
            variant="outlinePrimary"
          />
          <Button
            className="px-3"
            leftIcon={<Icon color="orange" name="disconnect" size={16} />}
            onClick={toggleConnect}
            tooltip={t("common.disconnect")}
            variant="outlineWarn"
          />
        </>
      ) : (
        <Button
          disabled={isLoading}
          onClick={toggleConnect}
          variant={isConnected ? "outlinePrimary" : "primary"}
        >
          <Box center className="gap-x-2">
            {t("common.connect")}
          </Box>
        </Button>
      )}
    </Box>
  );
};
