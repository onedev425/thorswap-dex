import { Text } from '@chakra-ui/react';
import { AssetInputType } from 'components/AssetInput/types';
import { Box, Collapse, Icon } from 'components/Atomic';
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

          <Text fontWeight="normal" textStyle="caption" variant="primary">
            {t('views.addLiquidity.pricesAndPoolShare')}
          </Text>
        </div>
      }
    >
      <Box row className="w-full">
        <Box
          col
          className="flex-1 gap-2 border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray"
        >
          <Text fontWeight="semibold" textStyle="caption" variant="secondary">
            {poolAsset.asset.ticker}
            {` ${t('common.per')} `}
            {runeAsset.asset.ticker}
          </Text>
          <Text textStyle="h4">{rate || 'N/A'}</Text>
        </Box>

        <Box
          col
          className="flex-1 gap-2 text-center border-0 border-r border-dotted border-light-typo-gray dark:border-dark-typo-gray"
        >
          <Text fontWeight="semibold" textStyle="caption" variant="secondary">
            {t('views.liquidity.assetUSDPrice')}
          </Text>
          <Text textStyle="h4">{assetUSDPrice || 'N/A'}</Text>
        </Box>

        <Box col className="flex-1 gap-2 text-right">
          <Text fontWeight="semibold" textStyle="caption" variant="secondary">
            {t('views.addLiquidity.shareOfPool')}
          </Text>
          <Text textStyle="h4">{poolShare || 'N/A'}</Text>
        </Box>
      </Box>
    </Collapse>
  );
};
