import { Box, Collapse, Icon, Typography } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  poolTicker: string;
  runeTicker: string;
  poolShare: string | null;
  fee: string | null;
  slippage: string | null;
  rate: string | null;
};

const borderClasses =
  'gap-2 border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray';

export const PoolInfo = ({ poolTicker, runeTicker, poolShare, slippage, fee, rate }: Props) => {
  const fields = [
    {
      label: `${runeTicker} ${t('common.per')} ${poolTicker}`,
      value: rate || 'N/A',
    },
    { label: t('views.wallet.slip'), value: slippage || 'N/A' },
    { label: t('common.fee'), value: fee || 'N/A' },
    {
      label: t('views.addLiquidity.shareOfPool'),
      value: poolShare || 'N/A',
    },
  ];

  return (
    <Collapse
      className="self-stretch !mt-0 !bg-light-bg-primary dark:!bg-dark-gray-light !rounded-2xl flex-col"
      shadow={false}
      title={
        <Box row className="gap-x-2">
          <Icon color="secondary" name="infoCircle" size={16} />

          <Typography color="primary" fontWeight="normal" variant="caption">
            {t('views.addLiquidity.pricesAndPoolShare')}
          </Typography>
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
              className={last ? 'text-right' : borderClasses}
              flex={1}
              justify="between"
              key={label}
            >
              <Typography color="secondary" fontWeight="semibold" variant="caption">
                {label}
              </Typography>

              <Typography className="text-base md:text-h4" variant="caption">
                {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Collapse>
  );
};
