import { Text } from "@chakra-ui/react";
import { Box } from "components/Atomic";
import { HoverIcon } from "components/HoverIcon";
import { InfoTip } from "components/InfoTip";
import { memo } from "react";
import { t } from "services/i18n";
import type { SaverProvider } from "store/midgard/types";

type Props = {
  address: string;
  depositValue: string | null;
  providerData: SaverProvider | null;
};

export const EarnInfo = memo(({ depositValue, providerData, address }: Props) => {
  return (
    <Box col className="mt-5 gap-2">
      <InfoTip type="info">
        <Box col className="self-stretch gap-3 px-3 py-1">
          <Box
            alignCenter
            row
            className="pb-2 border-0 border-b border-solid border-opacity-20 border-light-border-primary dark:border-dark-border-primary"
            justify="between"
          >
            <Text fontWeight="semibold" textStyle="subtitle2">
              {t("views.savings.yourPosition")}
            </Text>

            <HoverIcon
              iconName="refresh"
              onClick={() => undefined}
              spin={!!address && !providerData}
            />
          </Box>

          <Box alignCenter row className="gap-2" justify="between">
            <Text fontWeight="medium" textStyle="caption" variant="secondary">
              {t("views.savings.yourDeposit")}
            </Text>

            <Text fontWeight="medium" textStyle="subtitle2">
              {depositValue || "-"}
            </Text>
          </Box>
        </Box>
      </InfoTip>
    </Box>
  );
});
