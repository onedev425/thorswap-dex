import { useState } from 'react'

import { Box, Button, Typography } from 'components/Atomic'
import { DropdownMenu } from 'components/Atomic/Dropdown'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

enum Types {
  Bond = 'BOND',
  Leave = 'LEAVE',
  Unbound = 'UNBOUND',
}

const menuItems = Object.values(Types).map((type) => ({
  label: type,
  value: type,
})) as { label: Types; value: Types }[]

const NodeManager = () => {
  const [amount, setAmount] = useState('0')
  const [type, setType] = useState(Types.Bond)

  return (
    <PanelView
      title={t('common.nodeManager')}
      header={<ViewHeader withBack title={t('common.nodeManager')} />}
    >
      <Box className="px-3 bg-light-gray-light dark:bg-dark-gray-light rounded-xl md:px-6">
        <Box alignCenter className="py-2 md:gap-x-52 ">
          <Input
            className="text-lg font-normal text-left border-none"
            placeholder={t('common.nodeAddress')}
            stretch
            autoFocus
          />
          <div className="pl-3 md:pl-0">
            <DropdownMenu
              menuItems={menuItems}
              value={type}
              onChange={(v) => setType(v as Types)}
              openLabel={type}
            />
          </div>
        </Box>
      </Box>

      {type !== Types.Leave && (
        <Box className="px-3 bg-light-gray-light dark:bg-dark-gray-light rounded-xl">
          <Box className="py-2 md:gap-x-40" alignCenter justify="between">
            {type === Types.Bond ? (
              <Typography fontWeight="medium" variant="body" className="px-3">
                {t('views.nodes.bondAmount')}
              </Typography>
            ) : (
              <Typography fontWeight="medium" variant="body">
                {t('views.nodes.unbondAmount')}
                {t('views.nodes.assetTicker')}
              </Typography>
            )}

            <Box className="pl-11 md:pl-0" justify="end">
              <Input
                type="number"
                className="text-lg font-normal text-right border-none md:px-5 w-28 md:w-full"
                placeholder={t('common.amount')}
                onChange={(event) => setAmount(event.target.value)}
                value={amount}
              />
            </Box>
          </Box>
        </Box>
      )}

      <Box className="py-5 md:py-10" col>
        <Button className="px-20">{t('views.nodes.complete')}</Button>
      </Box>
    </PanelView>
  )
}

export default NodeManager
