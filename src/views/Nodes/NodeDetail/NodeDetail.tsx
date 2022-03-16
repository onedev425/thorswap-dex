import { useReducer, useCallback } from 'react'

import {
  Button,
  Card,
  Box,
  Icon,
  Collapse,
  Select,
  Typography,
} from 'components/Atomic'
import { Helmet } from 'components/Helmet'
import { Information } from 'components/Information'
import { Input } from 'components/Input'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { nodeDetailReducer } from './nodeDetailReducer'

// to be replaced with actual data
const data = [
  { label: 'Address', value: 'thoraskdjo1kjlkalks12k3l1k23jas' },
  { label: 'Bond address', value: 'thoraskdjo1kjlkalks12k3l1k23jas' },
  { label: 'IP Address', value: '127.0.0.1' },
  { label: 'Version', value: '1' },
  { label: 'Status', value: 'Active' },
  { label: 'Bond', value: '1,123,123' },
  { label: 'Current Rewards', value: '564' },
  { label: 'Slash points', value: '5433' },
]

const options = ['Bond', 'Unbond', 'Leave']

export const NodeDetail = () => {
  const [{ amount, favorite, actionIndex }, dispatch] = useReducer(
    nodeDetailReducer,
    {
      amount: '0',
      favorite: false,
      actionIndex: 0,
    },
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: 'setAmount', payload: e.target.value })
    },
    [],
  )

  const handleFavoriteChange = useCallback(() => {
    dispatch({ type: 'setFavorite', payload: !favorite })
  }, [favorite])

  const handleActionChange = useCallback((index: number) => {
    dispatch({ type: 'setActionIndex', payload: index })
  }, [])

  return (
    <Box className="w-full max-w-[600px] self-center" col>
      <Helmet title="Node Detail" content="Node Detail" />
      <Box className="w-full mx-2" col>
        <ViewHeader
          withBack
          title={t('views.nodes.detail.nodeInformation')}
          actionsComponent={
            <Box row>
              <Icon
                size={26}
                name={favorite ? 'heartFilled' : 'heart'}
                color={favorite ? 'red' : 'secondary'}
                onClick={handleFavoriteChange}
              />
            </Box>
          }
        />
      </Box>

      <Card
        size="lg"
        stretch
        className="flex-col items-center mt-4 md:mt-8 !p-0 md:h-auto md:pb-10 shadow-lg"
      >
        <Card size="lg" className="flex-col self-stretch shadow-lg">
          {data.map((item) => (
            <Information
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </Card>
        <Collapse title="Actions" className="mt-4 px-5 md:px-10 pb-10 w-full">
          <Select
            options={options}
            activeIndex={actionIndex}
            onChange={handleActionChange}
          />
          {actionIndex !== 2 && (
            <Box justify="between" className="!mt-2" justifyCenter alignCenter>
              <Typography>
                {options[actionIndex]} {t('views.nodes.detail.amount')}{' '}
                {actionIndex === 1 ? '(ᚱ)' : ''}:
              </Typography>
              <Input
                placeholder={t('views.nodes.detail.enterAmount')}
                value={amount}
                border="rounded"
                onChange={handleInputChange}
                type="number"
              />
            </Box>
          )}

          <Box className="pt-5 md:pt-10" col>
            <Button>{t('views.nodes.detail.complete')}</Button>
          </Box>
        </Collapse>
      </Card>
    </Box>
  )
}

export default NodeDetail
