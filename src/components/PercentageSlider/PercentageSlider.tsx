import { Text } from '@chakra-ui/react';
import { SwapKitNumber } from '@swapkit/core';
import classNames from 'classnames';
import { MaxPopover } from 'components/AssetInput/MaxPopover';
import { Box, Range } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { InputAmount } from 'components/InputAmount';
import { useCallback } from 'react';

type Props = {
  title: string;
  onChange: (val: SwapKitNumber) => void;
  percent: SwapKitNumber;
  highlightDisabled?: boolean;
  className?: string;
  slideClassName?: string;
};

export const PercentageSlider = ({
  onChange,
  percent,
  title,
  highlightDisabled,
  className,
  slideClassName,
}: Props) => {
  const handlePercentChange = useCallback(
    (value: SwapKitNumber) => {
      const val = value.gt(100) ? new SwapKitNumber(100) : value;
      onChange(val);
    },
    [onChange],
  );

  const handleRange = (value: SwapKitNumber) => {
    handlePercentChange(value);
  };

  return (
    <HighlightCard
      className={classNames(
        'min-h-[50px] p-4 !mb-1 flex-row items-center justify-start',
        className,
      )}
      disabled={highlightDisabled}
      onClick={focus}
    >
      <Box className="w-full row-span-1 flex-row">
        <Box alignCenter className="flex-1 items-center">
          <Text className="inline-flex" textStyle="caption">{`${title}:`}</Text>
        </Box>

        <Box alignCenter className="flex-1">
          <Box className="flex-1">
            <InputAmount
              stretch
              amountValue={percent}
              className="!text-2xl text-right mr-3"
              containerClassName="py-1"
              onAmountChange={handlePercentChange}
              suffix={<Text textStyle="subtitle1">%</Text>}
            />
          </Box>
        </Box>
      </Box>

      <Box
        alignCenter
        row
        className={classNames(
          'flex-row pb-8 row-span-1 w-full sm:items-start md:items-center gap-x-6',
          slideClassName,
        )}
      >
        <Box className="w-11/12">
          <Range amountValue={percent} onAmountChange={handleRange} />
        </Box>

        <MaxPopover onChange={(v) => handlePercentChange(new SwapKitNumber(v * 100))} />
      </Box>
    </HighlightCard>
  );
};
