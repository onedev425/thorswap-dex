import { AssetInputType } from 'components/AssetInput/types';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { shortenAddress } from 'helpers/shortenAddress';
import { t } from 'services/i18n';

type Params = {
  inputAsset: AssetInputType;
  outputAsset: AssetInputType;
  recipient: string;
  estimatedTime: string;
  slippage: string;
  isValidSlip?: boolean;
  minReceive: string;
  totalFee?: string;
};

export const useConfirmInfoItems = ({
  inputAsset,
  outputAsset,
  recipient,
  estimatedTime,
  slippage,
  minReceive,
  totalFee,
}: Params) => {
  const confirmInfoItems: InfoRowConfig[] = [
    {
      label: t('common.send'),
      value: `${inputAsset.value?.toSignificantWithMaxDecimals(
        6,
      )} ${inputAsset.asset.name.toUpperCase()}`,
    },
    {
      label: t('common.receive'),

      value: `${outputAsset.value?.toSignificantWithMaxDecimals(
        6,
      )} ${outputAsset.asset.name.toUpperCase()}`,
    },
    {
      label: t('common.recipientAddress'),
      value: shortenAddress(recipient, 6),
      size: 'lg',
    },
    {
      label: t('views.wallet.slip'),
      value: <InfoWithTooltip tooltip={t('views.wallet.slippageTooltip')} value={`${slippage}`} />,
    },
    {
      label: t('views.wallet.minReceived'),
      value: <InfoWithTooltip tooltip={t('views.wallet.minReceivedTooltip')} value={minReceive} />,
    },
    {
      label: t('views.wallet.totalFee'),
      value: <InfoWithTooltip tooltip={t('views.wallet.totalFeeTooltip')} value={`${totalFee}`} />,
    },
    {
      label: t('views.wallet.estimatedTime'),
      value: (
        <InfoWithTooltip tooltip={t('views.wallet.estimatedTimeTooltip')} value={estimatedTime} />
      ),
    },
  ];

  return confirmInfoItems;
};
