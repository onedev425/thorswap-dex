import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box } from "components/Atomic";
import { Fragment } from "react";
import { t } from "services/i18n";

type Props = {
  chartTypeIndexes: string[];
  selectChartTypeIndex: (index: string) => void;
  selectedChartTypeIndex: string;
};

export const ChartTypeSelect = ({
  chartTypeIndexes,
  selectedChartTypeIndex,
  selectChartTypeIndex,
}: Props) => {
  return (
    <Box row className="space-x-2">
      {chartTypeIndexes.map((chartIndex, index) => (
        <Fragment key={chartIndex}>
          {index !== 0 && <Text> / </Text>}

          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="cursor-pointer"
            key={chartIndex}
            onClick={() => selectChartTypeIndex(chartIndex)}
          >
            <Text
              className={classNames("hover:underline underline-offset-4", {
                underline: chartIndex === selectedChartTypeIndex,
              })}
              fontWeight="bold"
              textStyle="body"
              variant={chartIndex === selectedChartTypeIndex ? "primary" : "secondary"}
            >
              {t("views.home.chart", { context: chartIndex })}
            </Text>
          </div>
        </Fragment>
      ))}
    </Box>
  );
};
