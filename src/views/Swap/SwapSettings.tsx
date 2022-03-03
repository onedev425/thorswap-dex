import { useState } from 'react'

import { Button, Box, Card, Icon, Typography, Switch } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from '../../services/i18n'

interface SwapSettingsProps {
  autoRouter: boolean
  deadline: string
  expertMode: boolean
  onAutoRouterChange: (autoRouter: boolean) => void
  onExpertModeChange: (expertMode: boolean) => void
  slippage: number
}

export const SwapSettings = ({
  autoRouter,
  expertMode,
  onAutoRouterChange,
  onExpertModeChange,
}: SwapSettingsProps) => {
  const [slippage, setSlippage] = useState(3)

  return (
    <Card className="w-[350px] p-8 shadow-2xl">
      <Box className="gap-4 w-full" col>
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
            color="secondary"
            size={16}
            name="questionCircle"
            className="ml-auto"
          />
        </Box>
        <Box className="justify-around">
          <Input
            symbol="%"
            value={slippage}
            onChange={(e) => setSlippage(Number(e.target.value))}
            placeholder="Percentage"
            border="rounded"
            stretch
            className="text-right"
          />
          <Button
            onClick={() => setSlippage(0.5)}
            size="sm"
            type={slippage === 0.5 ? 'default' : 'outline'}
            variant="accent"
            className="ml-2"
          >
            {'0.5%'}
          </Button>
          <Button
            onClick={() => setSlippage(1)}
            size="sm"
            type={slippage === 1 ? 'default' : 'outline'}
            variant="accent"
            className="ml-2"
          >
            {'1%'}
          </Button>
          <Button
            onClick={() => setSlippage(3)}
            size="sm"
            type={slippage === 3 ? 'default' : 'outline'}
            variant="accent"
            className="ml-2"
          >
            {'3%'}
          </Button>
        </Box>
        <Box className="justify-between">
          <Typography variant="caption-xs" color="secondary">
            {t('views.swap.transactionDeadline')}
          </Typography>
          <Icon
            color="secondary"
            size={16}
            name="questionCircle"
            className="ml-auto"
          />
        </Box>
        <Box marginBottom={30}>
          <Input
            border="bottom"
            suffix={t('common.minutes')}
            defaultValue="30"
          />
        </Box>
        <Box>
          <Typography variant="caption">
            {t('views.swap.interfaceSettings')}
          </Typography>
        </Box>
        <Box className="justify-between items-center">
          <Box>
            <Typography variant="caption-xs" color="secondary">
              {t('views.swap.autoRouterApi')}
            </Typography>
            <Icon
              color="secondary"
              size={16}
              name="questionCircle"
              className="ml-2"
            />
          </Box>
          <Box>
            <Switch
              selectedText="ON"
              unselectedText="OFF"
              checked={autoRouter}
              onChange={() => onAutoRouterChange(!autoRouter)}
            />
          </Box>
        </Box>
        <Box className="justify-between items-center">
          <Box>
            <Typography variant="caption-xs" color="secondary">
              {t('views.swap.expertMode')}
            </Typography>
            <Icon
              color="secondary"
              size={16}
              name="questionCircle"
              className="ml-2"
            />
          </Box>
          <Box>
            <Switch
              selectedText="ON"
              unselectedText="OFF"
              checked={expertMode}
              onChange={() => onExpertModeChange(!expertMode)}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}
