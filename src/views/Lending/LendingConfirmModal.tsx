import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useMemo } from 'react';
import { t } from 'services/i18n';

type Props = {
  asset: AssetEntity;
  amount: Amount;
  onClose: () => void;
  isOpened: boolean;
  onConfirm: (expectedAmount: string) => void;
  tabLabel: string;
  estimatedTime?: number;
  expectedOutputAmount?: Amount;
  expectedOutputMaxSlippage?: Amount;
  expectedDebtInfo?: string;
  collateralAmount?: Amount;
  collateralAsset?: AssetEntity;
  networkFee?: Amount;
};

export const LendingConfirmModal = ({
  isOpened,
  onClose,
  onConfirm,
  asset,
  amount,
  tabLabel,
  estimatedTime,
  expectedOutputAmount,
  expectedOutputMaxSlippage,
  collateralAmount,
  collateralAsset,
  networkFee,
  expectedDebtInfo,
}: Props) => {
  const timeLabel = useMemo(() => {
    if (!estimatedTime) return undefined;
    const minutes = Math.floor(estimatedTime / 60);
    const hours = Math.floor(minutes / 60);
    const hoursString = hours > 0 ? `${hours}h ` : '';
    const minutesString = minutes > 0 ? `${minutes % 60}m ` : '';
    const secondsString = estimatedTime % 60 > 0 ? ` ${estimatedTime % 60}s` : '';

    return `${hoursString}${minutesString}${secondsString}`;
  }, [estimatedTime]);

  const txInfos = useMemo(
    () => [
      { label: t('common.action'), value: tabLabel },
      { label: t('common.asset'), value: `${asset.name}`, icon: asset },
      { label: t('views.wallet.estimatedTime'), value: timeLabel || 'N/A' },
      {
        label: tabLabel,
        value: expectedOutputAmount ? (
          `${expectedOutputAmount.toSignificant(6)} ${asset.name}`
        ) : networkFee?.gte(amount) ? (
          t('views.savings.notEnoughForOutboundFee')
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
    ],
    [amount, asset, timeLabel, expectedOutputAmount, networkFee, tabLabel],
  );

  const borrowInfo = useMemo(
    () => [
      {
        label: t('common.minReceived'),
        value: expectedOutputMaxSlippage ? (
          `${expectedOutputMaxSlippage?.toSignificant(6)} ${asset.name}`
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
      {
        label: t('views.lending.collateralValue'),
        value:
          collateralAmount && collateralAsset ? (
            `${collateralAmount.toSignificant(6)} ${collateralAsset.name}`
          ) : (
            <Icon spin color="primary" name="loader" size={24} />
          ),
      },
      {
        label: t('views.lending.expectedDebt'),
        value: expectedDebtInfo ? (
          expectedDebtInfo
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
    ],
    [asset.name, collateralAmount, collateralAsset, expectedDebtInfo, expectedOutputMaxSlippage],
  );

  const infoRows = useMemo(() => {
    if (expectedOutputMaxSlippage && expectedDebtInfo) return txInfos.concat(borrowInfo);

    return txInfos;
  }, [borrowInfo, expectedDebtInfo, expectedOutputMaxSlippage, txInfos]);

  return (
    <ConfirmModal
      inputAssets={[asset]}
      isOpened={isOpened}
      onClose={onClose}
      onConfirm={() => onConfirm(expectedOutputAmount?.toSignificant(6) || '0')}
    >
      <Box col className="mb-5">
        {infoRows.map(({ label, value, icon }) => (
          <InfoRow
            key={label}
            label={label}
            value={
              <Box center className="gap-1">
                <Text textStyle="caption">{value}</Text>
                {icon && <AssetIcon asset={icon} size={22} />}
              </Box>
            }
          />
        ))}
      </Box>
    </ConfirmModal>
  );
};
