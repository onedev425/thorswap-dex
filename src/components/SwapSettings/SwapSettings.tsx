import { Button, Box, Card, Icon, Typography, Switch } from 'components/Atomic'
import { Input } from 'components/Input'

import { useApp } from 'redux/app/hooks'

import { t } from 'services/i18n'

export const SwapSettings = () => {
  const {
    slippageTolerance,
    transactionDeadline,
    autoRouter,
    expertMode,
    setSlippage,
    setAutoRouter,
    setExpertMode,
    setTransactionDeadline,
  } = useApp()

  return (
    <Card className="w-[350px] p-8 shadow-2xl" withBorder>
      <Box className="w-full gap-4" col>
        <Box>
          <Typography variant="caption">
            {t('views.swap.transactionSettings')}
          </Typography>
        </Box>
        <Box className="justify-between">
          <Typography variant="caption-xs" color="secondary">
            {t('views.swap.slippageTolerance')}
          </Typography>
          <Icon
            className="ml-auto"
            color="secondary"
            size={16}
            name="questionCircle"
          />
        </Box>
        <Box className="w-full space-x-2">
          <Input
            className="text-right"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
            symbol="%"
            value={slippageTolerance}
            placeholder="Percentage"
            border="rounded"
            stretch
            onChange={(e) => setSlippage(Number(e.target.value))}
          />
          <Button
            size="sm"
            type={slippageTolerance === 0.5 ? 'default' : 'outline'}
            variant="tint"
            onClick={() => setSlippage(0.5)}
          >
            <Typography variant="caption-xs">0.5%</Typography>
          </Button>
          <Button
            size="sm"
            type={slippageTolerance === 1 ? 'default' : 'outline'}
            variant="tint"
            onClick={() => setSlippage(1)}
          >
            <Typography variant="caption-xs">1%</Typography>
          </Button>
          <Button
            size="sm"
            variant="tint"
            type={slippageTolerance == 3 ? 'default' : 'outline'}
            onClick={() => setSlippage(3)}
          >
            <Typography variant="caption-xs">3%</Typography>
          </Button>
        </Box>
        <Box className="justify-between">
          <Typography variant="caption-xs" color="secondary">
            {t('views.swap.transactionDeadline')}
          </Typography>
          <Icon
            className="ml-auto"
            color="secondary"
            size={16}
            name="questionCircle"
          />
        </Box>
        <Box marginBottom={30} alignCenter>
          <Input
            className="w-16 text-right"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
            border="rounded"
            value={transactionDeadline}
            onChange={(e) => setTransactionDeadline(Number(e.target.value))}
          />
          <Typography className="ml-2" color="secondary" variant="caption-xs">
            {t('common.minutes')}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption">
            {t('views.swap.interfaceSettings')}
          </Typography>
        </Box>
        <Box alignCenter justify="between">
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
      </Box>
    </Card>
  )
}
