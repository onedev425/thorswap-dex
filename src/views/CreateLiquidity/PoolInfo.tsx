import { AssetInputType } from 'components/AssetInput/types';
import { Box, Collapse, Icon, Typography } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  poolAsset: AssetInputType;
  runeAsset: AssetInputType;
  poolShare: string | null;
  assetUSDPrice: string | null;
  rate: string | null;
};

export const PoolInfo = ({ poolAsset, runeAsset, poolShare, assetUSDPrice, rate }: Props) => {
  return (
    <Collapse
      className="self-stretch !mt-0 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
      shadow={false}
      title={
        <div className="flex flex-row gap-x-2">
          <Icon color="secondary" name="infoCircle" size={16} />

          <Typography color="primary" fontWeight="normal" variant="caption">
            {t('views.addLiquidity.pricesAndPoolShare')}
          </Typography>
        </div>
      }
    >
      <Box row className="w-full">
        <Box
          col
          className="flex-1 gap-2 border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray"
        >
          <Typography color="secondary" fontWeight="semibold" variant="caption">
            {poolAsset.asset.ticker}
            {` ${t('common.per')} `}
            {runeAsset.asset.ticker}
          </Typography>
          <Typography variant="h4">{rate || 'N/A'}</Typography>
        </Box>

        <Box
          col
          className="flex-1 gap-2 text-center border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray"
        >
          <Typography color="secondary" fontWeight="semibold" variant="caption">
            {t('views.liquidity.assetUSDPrice')}
          </Typography>
          <Typography variant="h4">{assetUSDPrice || 'N/A'}</Typography>
        </Box>

        <Box col className="flex-1 gap-2 text-right">
          <Typography color="secondary" fontWeight="semibold" variant="caption">
            {t('views.addLiquidity.shareOfPool')}
          </Typography>
          <Typography variant="h4">{`${poolShare || 'N/A'}`}</Typography>
        </Box>
      </Box>
    </Collapse>
  );
};
