import { Text } from "@chakra-ui/react";
import { FeeOption } from "@swapkit/sdk";
import classNames from "classnames";
import { Box, Button, Icon, Switch, Tooltip } from "components/Atomic";
import { Input } from "components/Input";
import { useMemo } from "react";
import { t } from "services/i18n";
import { IS_LEDGER_LIVE } from "settings/config";
import { useApp } from "store/app/hooks";

import { slippageOptions } from "./settingOptions";

type Props = {
  transactionMode?: boolean;
  noSlippage?: boolean;
};

export const GlobalSettings = ({ transactionMode, noSlippage }: Props) => {
  const {
    slippageTolerance,
    feeOptionType,
    expertMode,
    customRecipientMode,
    setSlippage,
    setExpertMode,
    setCustomRecipientMode,
    setFeeOptionType,
  } = useApp();

  const feeOptions = useMemo(
    () => [
      {
        key: "fee.average",
        type: FeeOption.Average,
        text: t("common.feeAverage"),
      },
      {
        key: "fee.fast",
        type: FeeOption.Fast,
        text: t("common.feeFast"),
      },
      {
        key: "fee.fastest",
        type: FeeOption.Fastest,
        text: t("common.feeFastest"),
      },
    ],
    [],
  );

  return (
    <>
      <Box>
        <Text textStyle="caption">{t("views.swap.transactionSettings")}</Text>
      </Box>
      {!noSlippage && (
        <>
          <Box className="space-x-2">
            <Text textStyle="caption-xs" variant="secondary">
              {t("views.swap.slippageTolerance")}
            </Text>
            <Tooltip content={t("common.slippageTooltip")} place="top">
              <Icon color="secondary" name="questionCircle" size={16} />
            </Tooltip>
          </Box>

          <Box alignCenter className="w-full space-x-2">
            <Input
              stretch
              border="rounded"
              className="text-right"
              containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
              onChange={(e) => setSlippage(Number(e.target.value))}
              placeholder={t("common.percentage")}
              symbol="%"
              type="number"
              value={slippageTolerance}
            />

            {slippageOptions.map((option) => (
              <Button
                key={option.key}
                onClick={() => setSlippage(option.value)}
                size="sm"
                variant={slippageTolerance === option.value ? "primary" : "outlineTint"}
              >
                <Text textStyle="caption-xs">{option.text}</Text>
              </Button>
            ))}
          </Box>
        </>
      )}

      <Box className="space-x-2">
        <Text textStyle="caption-xs" variant="secondary">
          {t("common.transactionFee")}
        </Text>
        <Tooltip content={t("common.txFeeTooltip")} place="top">
          <Icon color="secondary" name="questionCircle" size={16} />
        </Tooltip>
      </Box>

      <Box
        alignCenter
        className={classNames("w-full space-x-2", {
          "pb-6": transactionMode,
        })}
      >
        {feeOptions.map((feeOption) => (
          <Button
            key={feeOption.key}
            onClick={() => setFeeOptionType(feeOption.type)}
            size="sm"
            variant={feeOptionType === feeOption.type ? "primary" : "outlineTint"}
          >
            <Text textStyle="caption-xs">{feeOption.text}</Text>
          </Button>
        ))}
      </Box>

      {transactionMode && (
        <>
          <Box>
            <Text textStyle="caption">{t("views.setting.transactionMode")}</Text>
          </Box>

          <Box alignCenter justify="between">
            <Box alignCenter className="space-x-2">
              <Text textStyle="caption-xs" variant="secondary">
                {t("views.swap.expertMode")}
              </Text>
              <Tooltip content={t("common.expertModeTooltip")} place="top">
                <Icon color="secondary" name="questionCircle" size={16} />
              </Tooltip>
            </Box>

            <Switch
              checked={expertMode}
              onChange={() => setExpertMode(!expertMode)}
              selectedText="ON"
              unselectedText="OFF"
            />
          </Box>
          {!IS_LEDGER_LIVE && (
            <Box alignCenter justify="between">
              <Box alignCenter className="space-x-2">
                <Text textStyle="caption-xs" variant="secondary">
                  {t("views.setting.customRecipientMode")}
                </Text>
                <Tooltip content={t("common.customRecipientTooltip")} place="top">
                  <Icon color="secondary" name="questionCircle" size={16} />
                </Tooltip>
              </Box>

              <Switch
                checked={customRecipientMode}
                onChange={() => setCustomRecipientMode(!customRecipientMode)}
                selectedText="ON"
                unselectedText="OFF"
              />
            </Box>
          )}

          {/* <Box alignCenter justify="between">
          <Box className="space-x-2">
            <Typography variant="caption-xs" color="secondary">
              {t('views.swap.autoRouterApi')}
            </Typography>
            <Icon color="secondary" size={16} name="questionCircle" />
          </Box>
          <Box>
            <Switch
              selectedText="ON"
              unselectedText="OFF"
              checked={autoRouter}
              onChange={() => setAutoRouter(!autoRouter)}
            />
          </Box>
        </Box> */}
        </>
      )}
    </>
  );
};
