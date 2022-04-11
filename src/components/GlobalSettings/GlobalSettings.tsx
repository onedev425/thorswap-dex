import { Button, Box, Card, Icon, Typography, Switch } from 'components/Atomic'
import { Input } from 'components/Input'

import { useApp } from 'store/app/hooks'

import { t } from 'services/i18n'

import { feeOptions, slippageOptions } from './settingOptions'

export const GlobalSettings = () => {
  const {
    slippageTolerance,
    feeOptionType,
    // autoRouter,
    expertMode,
    customRecipientMode,
    setSlippage,
    // setAutoRouter,
    setExpertMode,
    setCustomRecipientMode,
    setFeeOptionType,
  } = useApp()

  return (
    <Card className="w-[350px] p-8 shadow-2xl" withBorder>
      <Box className="w-full gap-4" col>
        <Box>
          <Typography variant="caption">
            {t('views.swap.transactionSettings')}
          </Typography>
        </Box>
        <Box className="space-x-2">
          <Typography variant="caption-xs" color="secondary">
            {t('views.swap.slippageTolerance')}
          </Typography>
          <Icon color="secondary" size={16} name="questionCircle" />
        </Box>
        <Box className="w-full space-x-2" alignCenter>
          <Input
            type="number"
            className="text-right"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
            symbol="%"
            value={slippageTolerance}
            placeholder="Percentage"
            border="rounded"
            stretch
            onChange={(e) => setSlippage(Number(e.target.value))}
          />
          {slippageOptions.map((option) => (
            <Button
              key={option.key}
              size="sm"
              type={slippageTolerance === option.value ? 'default' : 'outline'}
              variant="tint"
              onClick={() => setSlippage(option.value)}
            >
              <Typography variant="caption-xs">{option.text}</Typography>
            </Button>
          ))}
        </Box>
        <Box className="space-x-2">
          <Typography variant="caption-xs" color="secondary">
            {t('views.swap.transactionDeadline')}
          </Typography>
          <Icon color="secondary" size={16} name="questionCircle" />
        </Box>
        <Box className="w-full space-x-2" marginBottom={30} alignCenter>
          {feeOptions.map((feeOption) => (
            <Button
              key={feeOption.key}
              size="sm"
              type={feeOptionType === feeOption.type ? 'default' : 'outline'}
              variant="tint"
              onClick={() => setFeeOptionType(feeOption.type)}
            >
              <Typography variant="caption-xs">{feeOption.text}</Typography>
            </Button>
          ))}
        </Box>
        <Box>
          <Typography variant="caption">
            {t('views.setting.transactionMode')}
          </Typography>
        </Box>
        <Box alignCenter justify="between">
          <Box className="space-x-2">
            <Typography variant="caption-xs" color="secondary">
              {t('views.swap.expertMode')}
            </Typography>
            <Icon color="secondary" size={16} name="questionCircle" />
          </Box>
          <Box>
            <Switch
              selectedText="ON"
              unselectedText="OFF"
              checked={expertMode}
              onChange={() => setExpertMode(!expertMode)}
            />
          </Box>
        </Box>

        <Box alignCenter justify="between">
          <Box className="space-x-2">
            <Typography variant="caption-xs" color="secondary">
              {t('views.setting.customRecipientMode')}
            </Typography>
            <Icon color="secondary" size={16} name="questionCircle" />
          </Box>
          <Box>
            <Switch
              selectedText="ON"
              unselectedText="OFF"
              checked={customRecipientMode}
              onChange={() => setCustomRecipientMode(!customRecipientMode)}
            />
          </Box>
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
      </Box>
    </Card>
  )
}
