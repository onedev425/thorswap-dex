import { Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/multichain-core';
import { Box, Button, Range } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { InputAmount } from 'components/InputAmount';
import { getAmountFromString } from 'components/InputAmount/utils';
import { useCallback } from 'react';
import { t } from 'services/i18n';

type Props = {
  onChange: (val: Amount) => void;
  percent: Amount;
};

export const WithdrawPercent = ({ onChange, percent }: Props) => {
  const handlePercentChange = useCallback(
    (value: Amount) => {
      const val = value.gt(100) ? Amount.fromNormalAmount(100) : value;
      onChange(val);
    },
    [onChange],
  );

  const handleRange = (value: Amount) => {
    handlePercentChange(value);
  };

  return (
    <HighlightCard
      className="min-h-[107px] p-4 !mb-1 flex-row items-center justify-start"
      onClick={focus}
    >
      <Box className="w-full row-span-1 flex-row">
        <Box alignCenter className="flex-1 items-center">
          <Text className="inline-flex">{`${t('common.withdrawPercent')}:`}</Text>
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
        className="flex-row pb-8 row-span-1 w-full sm:items-start md:items-center gap-x-6"
      >
        <Box className="w-11/12">
          <Range amountValue={percent} onAmountChange={handleRange} />
        </Box>

        <Box center row className="flex-auto">
          <Button
            className="!h-5 !px-1.5"
            onClick={() => handlePercentChange(getAmountFromString('100', 0) as Amount)}
            textTransform="uppercase"
            variant="outlineSecondary"
          >
            {t('common.max')}
          </Button>
        </Box>
      </Box>
    </HighlightCard>
  );
};
