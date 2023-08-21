import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon, Link } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { InfoTip } from 'components/InfoTip';
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

const LENDING_DOCS = 'https://twitter.com/THORChain/status/1693423215580958884';

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
    () =>
      [
        { label: t('common.action'), value: tabLabel },
        { label: t('common.asset'), value: `${asset.name}`, icon: asset },
      ] as { label: string; value: string | JSX.Element; icon?: AssetEntity }[],
    [asset, tabLabel],
  );

  const repayInfo = useMemo(
    () => [
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
    [amount, asset, expectedOutputAmount, networkFee, tabLabel, timeLabel],
  );

  const borrowInfo = useMemo(
    () => [
      {
        label: t('views.lending.collateral'),
        value: `${collateralAsset?.name}`,
        icon: collateralAsset,
      },
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
    [
      amount,
      asset,
      collateralAmount,
      collateralAsset,
      expectedDebtInfo,
      expectedOutputAmount,
      expectedOutputMaxSlippage,
      networkFee,
      tabLabel,
      timeLabel,
    ],
  );

  const infoRows = useMemo(
    () => (expectedDebtInfo ? txInfos.concat(borrowInfo) : txInfos.concat(repayInfo)),
    [borrowInfo, expectedDebtInfo, repayInfo, txInfos],
  );

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

        <InfoTip
          className="mt-4"
          title={
            <>
              <Text mx={2}>
                {t('views.lending.experimentalDisclaimer')}{' '}
                <Link className="text-twitter-blue cursor-pointer" to={LENDING_DOCS}>
                  <Text fontWeight="medium" noOfLines={1} variant="blue">
                    {t('views.lending.riskDisclaimer')} →
                  </Text>
                </Link>
              </Text>
            </>
          }
          type="warn"
        />
      </Box>
    </ConfirmModal>
  );
};
