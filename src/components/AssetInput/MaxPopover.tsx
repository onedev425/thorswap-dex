import { Text } from "@chakra-ui/react";
import { Button, Card } from "components/Atomic";
import { Popover } from "components/Popover";
import type { ForwarderProps } from "components/Popover/Popover";
import { useCallback, useRef } from "react";
import { t } from "services/i18n";

type Props = {
  maxButtonLabel?: string;
  onChange?: (selectedIndex: number) => void;
  disabled?: boolean;
};

const options = [
  { label: "25%", value: 0.25 },
  { label: "50%", value: 0.5 },
  { label: "75%", value: 0.75 },
  { label: "100%", value: 1 },
];

export const MaxPopover = ({ maxButtonLabel, onChange, disabled }: Props) => {
  const popoverRef = useRef<ForwarderProps>(null);

  const closePopover = () => {
    if (popoverRef.current) {
      popoverRef.current.close();
    }
  };

  const onHandleChange = useCallback(
    (value: number) => {
      onChange?.(value);
      closePopover();
    },
    [onChange],
  );

  return (
    <Popover
      openOnHover
      disabled={disabled}
      ref={popoverRef}
      trigger={
        <Button
          className="!h-5 !px-1.5"
          onClick={() => onChange?.(1)}
          textTransform="uppercase"
          variant="outlineSecondary"
        >
          {maxButtonLabel || t("common.max")}
        </Button>
      }
    >
      <div className="mr-[-24px] mt-[-4px]">
        <Card className="flex px-1 m-1 mt-2 gap-1 py-1" size="sm">
          {options.map((option) => (
            <Button
              className="!w-11 !h-6 hover:!border-btn-primary-active"
              key={option.label}
              onClick={() => onHandleChange(option.value)}
              variant="outlineTint"
            >
              <Text textStyle="caption-xs" textTransform="capitalize">
                {option.label}
              </Text>
            </Button>
          ))}
        </Card>
      </div>
    </Popover>
  );
};
