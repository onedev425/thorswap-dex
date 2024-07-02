import { Text } from "@chakra-ui/react";
import { Box, Collapse, Icon } from "components/Atomic";
import { t } from "services/i18n";

type Props = {
  poolTicker: string;
  runeTicker: string;
  poolShare: string | null;
  fee: string | null;
  slippage: string | null;
  rate: string | null;
};

const borderClasses =
  "gap-2 border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray";

export const PoolInfo = ({ poolTicker, runeTicker, poolShare, slippage, fee, rate }: Props) => {
  const fields = [
    {
      label: `${poolTicker} ${t("common.per")} ${runeTicker}`,
      value: rate || "N/A",
    },
    { label: t("views.wallet.slip"), value: slippage || "N/A" },
    { label: t("common.fee"), value: fee || "N/A" },
    {
      label: t("views.addLiquidity.shareOfPool"),
      value: poolShare || "N/A",
    },
  ];

  return (
    <Collapse
      className="self-stretch !mt-0 !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col"
      shadow={false}
      title={
        <Box row className="gap-x-2">
          <Icon color="secondary" name="infoCircle" size={16} />

          <Text fontWeight="normal" textStyle="caption" variant="primary">
            {t("views.addLiquidity.pricesAndPoolShare")}
          </Text>
        </Box>
      }
    >
      <Box className="w-full">
        {fields.map(({ label, value }, index) => {
          const first = index === 0;
          const last = index === fields.length - 1;

          return (
            <Box
              col
              alignCenter={!(first || last)}
              className={last ? "text-right" : borderClasses}
              flex={1}
              justify="between"
              key={label}
            >
              <Text fontWeight="semibold" textStyle="caption" variant="secondary">
                {label}
              </Text>

              <Text className="text-base md:text-h4" textStyle="caption">
                {value}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Collapse>
  );
};
