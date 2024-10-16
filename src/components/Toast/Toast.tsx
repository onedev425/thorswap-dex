import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box, Button, Icon } from "components/Atomic";
import { t } from "i18next";
import type { ReactNode } from "react";
import React from "react";
import type { ToastOptions } from "react-hot-toast";
import { ToastBar, Toaster, toast } from "react-hot-toast";

export enum ToastType {
  Info = "info",
  Success = "success",
  Error = "error",
  Warning = "warning",
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case ToastType.Error:
      return <Icon className="min-w-[24px]" color="pink" name="xCircle" />;

    case ToastType.Success:
      return <Icon className="min-w-[24px]" color="green" name="checkmark" />;

    case ToastType.Info:
      return <Icon className="min-w-[24px]" color="cyan" name="infoCircle" />;

    case ToastType.Warning:
      return <Icon className="min-w-[24px]" color="yellow" name="warn" />;

    default:
      return null;
  }
};

type ShowToastFunction = (params: {
  message: string;
  description?: string | ReactNode;
  type?: ToastType;
  options?: Partial<Pick<ToastOptions, "position" | "duration" | "style" | "className">>;
  error?: Error;
}) => void;

type ToastFunction = (
  message: string,
  descriptionOrOptions?: string | ReactNode | Partial<ToastOptions>,
  options?: Partial<ToastOptions>,
  error?: Error,
) => void;

const showToast: ShowToastFunction = ({
  message,
  description,
  type = ToastType.Info,
  options = {},
  error,
}) => {
  const icon = getToastIcon(type);
  const duration = options.duration || type === ToastType.Error ? 20000 : 5000;

  toast.custom(
    ({ id }) => (
      <Box
        row
        className="max-w-[375px] z-50 items-center p-2 m-2 border border-solid drop-shadow-md rounded-xl border-light-border-primary dark:border-dark-border-primary bg-light-bg-primary dark:bg-dark-bg-secondary"
      >
        <Box col className="w-fit" onClick={() => toast.remove(id)}>
          <Box col>
            <Box alignCenter justify="between">
              <Box alignCenter>
                <Box>{icon}</Box>

                <Box col className={classNames("pr-2", { "pl-2": icon })}>
                  <Text fontWeight={description ? "bold" : "medium"} textStyle="caption">
                    {message}
                  </Text>
                </Box>
              </Box>

              <Icon color="primary" name="close" size={18} />
            </Box>

            <Box className="pl-8 pr-4">
              {typeof description === "string" ? (
                <Text fontWeight="light" textStyle="caption-xs">
                  {t(`skErrorMessages.${description.replace("Error: ", "")}`) || description}
                </Text>
              ) : (
                description
              )}
            </Box>
            {type === ToastType.Error && error && (
              <Box className="pt-4">
                <Text fontWeight="light" textStyle="caption-xs">
                  {t("skErrorMessages.core_error")}
                  {" ( "}
                  <a
                    className="underline"
                    href="https://discord.gg"
                    rel="noreferrer"
                    target="_blank"
                  >
                    https://discord.gg
                  </a>
                  {" )."}
                  <Box className="pt-4">
                    {t("skErrorMessages.core_error_copy")}
                    <Box style={{ alignItems: "flex-end" }}>
                      <Button
                        className="!rounded-xl"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            JSON.stringify(error, Object.getOwnPropertyNames(error)),
                          )
                        }
                        leftIcon={<Icon color="primary" name="copy" size={18} />}
                      >
                        {t("common.copyErrorCode")}
                      </Button>
                    </Box>
                  </Box>
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    ),
    { ...options, duration },
  );
};

const showToastWrapper: (type?: ToastType) => ToastFunction =
  (type) => (message, descriptionOrOptions, options, error) => {
    const descriptionProvided =
      React.isValidElement(descriptionOrOptions) || typeof descriptionOrOptions === "string";

    const providedOptions = descriptionProvided
      ? options
      : (descriptionOrOptions as Partial<ToastOptions>);

    showToast({
      options: providedOptions,
      type: type || ToastType.Info,
      message,
      description: descriptionProvided ? descriptionOrOptions : "",
      error,
    });
  };

export const showSuccessToast = showToastWrapper(ToastType.Success);
export const showErrorToast = showToastWrapper(ToastType.Error);
export const showInfoToast = showToastWrapper(ToastType.Info);
export const showWarningToast = showToastWrapper(ToastType.Warning);

export const ToastPortal = () => {
  return (
    <Toaster containerClassName="m-4" gutter={16} position="bottom-right">
      {(t) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div onClick={() => toast.dismiss(t.id)} style={{ cursor: "pointer" }}>
          <ToastBar toast={t} />
        </div>
      )}
    </Toaster>
  );
};
