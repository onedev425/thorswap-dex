import { Text } from '@chakra-ui/react';
import { AssetEntity, QuoteRoute } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Modal } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { chainToSigAsset } from 'helpers/assets';
import { useFormatPrice } from 'helpers/formatPrice';
import { memo, useEffect, useMemo } from 'react';
import { t } from 'services/i18n';

type Fees = ReturnType<QuoteRoute['fees']['get']>;
type Props = {
  isOpened: boolean;
  onClose: () => void;
  fees?: QuoteRoute['fees'];
  totalFee: string;
};

export const FeeModal = memo(({ totalFee, fees, isOpened, onClose }: Props) => {
  const formatPrice = useFormatPrice();
  const rows: InfoRowConfig[] = useMemo(() => {
    if (!fees) return [];

    const { affiliateFee, ...chainsFees } = Object.entries(fees).reduce(
      (acc, fee) => {
        const [chain, value] = fee as [Chain, Fees];

        if (value) {
          value?.forEach((a) => (acc.affiliateFee += a.affiliateFeeUSD));

          acc[chain] = value;
        }

        return acc;
      },
      { affiliateFee: 0 } as { affiliateFee: number } & {
        [key in Chain]: Fees;
      },
    );

    const rows = Object.entries(chainsFees).reduce((acc, [chain, fee]) => {
      if (!fee) return acc;

      const chainFees = fee.map(({ type, networkFee, networkFeeUSD, asset }) => {
        const chainAsset = chainToSigAsset(chain as Chain);
        const feeAsset = AssetEntity.fromAssetString(asset);

        return {
          label: (
            <Box center className="gap-x-1">
              <Text textStyle="caption">
                {`${t('common.network')} `}
                {type ? t(`common.${type}`) : ''}
              </Text>
              <AssetIcon asset={chainAsset} size={20} />
            </Box>
          ),
          value: (
            <Box center className="gap-x-1">
              {feeAsset && (
                <>
                  <Text textStyle="caption-xs" variant="secondary">
                    (
                  </Text>
                  <AssetIcon asset={feeAsset} size={14} />
                  <Text textStyle="caption-xs" variant="secondary">
                    {formatPrice(networkFee, { prefix: '' })})
                  </Text>
                </>
              )}
              <Text>{formatPrice(networkFeeUSD)}</Text>
            </Box>
          ),
        };
      });

      return [...chainFees, ...acc];
    }, [] as InfoRowConfig[]);

    return [
      ...rows,
      {
        label: (
          <Box center className="gap-x-1">
            <Text textStyle="caption">{t('views.swap.exchangeFee')}</Text>
            <AssetIcon asset={AssetEntity.THOR()} hasChainIcon={false} size={20} />
          </Box>
        ),
        value: affiliateFee > 0 ? formatPrice(affiliateFee) : <Text variant="green">FREE</Text>,
      },
      {
        label: (
          <Box center>
            <Text textStyle="caption">{t('views.wallet.totalFee')}</Text>
          </Box>
        ),
        value: <Text>{totalFee}</Text>,
      },
    ];
  }, [fees, formatPrice, totalFee]);

  useEffect(() => {
    if (!fees && isOpened) {
      onClose();
    }
  }, [fees, isOpened, onClose]);

  if (!fees) return null;

  return (
    <Modal isOpened={isOpened} onClose={onClose} title={t('views.swap.feeExplanation')}>
      <Box className="w-80" flex={1}>
        <InfoTable items={rows} />
      </Box>
    </Modal>
  );
});
