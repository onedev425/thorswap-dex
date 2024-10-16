import { Button, Icon } from "components/Atomic";
import type React from "react";
import { t } from "services/i18n";

export type ReloadProps = {
  loading: boolean;
  onLoad?: () => void;
  tooltip?: string;
  size?: number;
};

export const ReloadButton = ({
  loading,
  onLoad,
  tooltip = t("common.reload"),
  size = 20,
}: ReloadProps): React.JSX.Element => {
  return (
    <Button
      className="px-2.5"
      leftIcon={<Icon name="refresh" size={size} spin={loading} />}
      onClick={onLoad}
      tooltip={onLoad ? tooltip : ""}
      variant="borderlessTint"
    />
  );
};
