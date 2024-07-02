import { AppMenu } from "components/AppPopoverMenu/AppMenu";
import { Button, Icon } from "components/Atomic";
import { Popover } from "components/Popover";
import useWindowSize from "hooks/useWindowSize";
import { t } from "services/i18n";

export const AppPopoverMenu = () => {
  const { isMdActive } = useWindowSize();

  return (
    <Popover
      trigger={
        <Button
          className="!px-2"
          leftIcon={<Icon name="cog" size={isMdActive ? 24 : 20} />}
          tooltip={t("common.globalSettings")}
          variant="borderlessTint"
        />
      }
    >
      <AppMenu />
    </Popover>
  );
};
