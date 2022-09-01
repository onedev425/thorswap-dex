import { FeeOption } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Button, Card, Icon, Switch, Tooltip, Typography } from 'components/Atomic';
import { Input } from 'components/Input';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';

import { slippageOptions } from './settingOptions';

type Props = {
  transactionMode?: boolean;
};

export const GlobalSettings = ({ transactionMode }: Props) => {
  const {
    slippageTolerance,
    feeOptionType,
    expertMode,
    customRecipientMode,
    setSlippage,
    setExpertMode,
    setCustomRecipientMode,
    setFeeOptionType,
  } = useApp();

  const feeOptions = useMemo(
    () => [
      {
        key: 'fee.average',
        type: FeeOption.Average,
        text: t('common.feeAverage'),
      },
      {
        key: 'fee.fast',
        type: FeeOption.Fast,
        text: t('common.feeFast'),
      },
      {
        key: 'fee.fastest',
        type: FeeOption.Fastest,
        text: t('common.feeFastest'),
      },
    ],
    [],
  );

  return (
    <Card withBorder className="w-[350px] px-8 py-6 shadow-2xl">
      <Box col className="w-full gap-4">
        <Box>
          <Typography variant="caption">{t('views.swap.transactionSettings')}</Typography>
        </Box>
        <Box className="space-x-2">
          <Typography color="secondary" variant="caption-xs">
            {t('views.swap.slippageTolerance')}
          </Typography>
          <Tooltip content={t('common.slippageTooltip')} place="top">
            <Icon color="secondary" name="questionCircle" size={16} />
          </Tooltip>
        </Box>

        <Box alignCenter className="w-full space-x-2">
          <Input
            stretch
            border="rounded"
            className="text-right"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
            onChange={(e) => setSlippage(Number(e.target.value))}
            placeholder={t('common.percentage')}
            symbol="%"
            type="number"
            value={slippageTolerance}
          />

          {slippageOptions.map((option) => (
            <Button
              key={option.key}
              onClick={() => setSlippage(option.value)}
              size="sm"
              type={slippageTolerance === option.value ? 'default' : 'outline'}
              variant={slippageTolerance === option.value ? 'primary' : 'tint'}
            >
              <Typography variant="caption-xs">{option.text}</Typography>
            </Button>
          ))}
        </Box>

        <Box className="space-x-2">
          <Typography color="secondary" variant="caption-xs">
            {t('common.transactionFee')}
          </Typography>
          <Tooltip content={t('common.txFeeTooltip')} place="top">
            <Icon color="secondary" name="questionCircle" size={16} />
          </Tooltip>
        </Box>

        <Box
          alignCenter
          className={classNames('w-full space-x-2', {
            'pb-6': transactionMode,
          })}
        >
          {feeOptions.map((feeOption) => (
            <Button
              key={feeOption.key}
              onClick={() => setFeeOptionType(feeOption.type)}
              size="sm"
              type={feeOptionType === feeOption.type ? 'default' : 'outline'}
              variant={feeOptionType === feeOption.type ? 'primary' : 'tint'}
            >
              <Typography variant="caption-xs">{feeOption.text}</Typography>
            </Button>
          ))}
        </Box>

        {transactionMode && (
          <>
            <Box>
              <Typography variant="caption">{t('views.setting.transactionMode')}</Typography>
            </Box>

            <Box alignCenter justify="between">
              <Box alignCenter className="space-x-2">
                <Typography color="secondary" variant="caption-xs">
                  {t('views.swap.expertMode')}
                </Typography>
                <Tooltip content={t('common.expertModeTooltip')} place="top">
                  <Icon color="secondary" name="questionCircle" size={16} />
                </Tooltip>
              </Box>

              <Switch
                checked={expertMode}
                onChange={() => setExpertMode(!expertMode)}
                selectedText="ON"
                unselectedText="OFF"
              />
            </Box>

            <Box alignCenter justify="between">
              <Box alignCenter className="space-x-2">
                <Typography color="secondary" variant="caption-xs">
                  {t('views.setting.customRecipientMode')}
                </Typography>
                <Tooltip content={t('common.customRecipientTooltip')} place="top">
                  <Icon color="secondary" name="questionCircle" size={16} />
                </Tooltip>
              </Box>

              <Switch
                checked={customRecipientMode}
                onChange={() => setCustomRecipientMode(!customRecipientMode)}
                selectedText="ON"
                unselectedText="OFF"
              />
            </Box>

            {/* <Box alignCenter justify="between">
          <Box className="space-x-2">
            <Typography variant="caption-xs" color="secondary">
              {t('views.swap.autoRouterApi')}
            </Typography>
            <Icon color="secondary" size={16} name="questionCircle" />
          </Box>
          <Box>
            <Switch
              selectedText="ON"
              unselectedText="OFF"
              checked={autoRouter}
              onChange={() => setAutoRouter(!autoRouter)}
            />
          </Box>
        </Box> */}
          </>
        )}
      </Box>
    </Card>
  );
};
