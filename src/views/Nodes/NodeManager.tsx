import { useState } from 'react'

import { Box, Button, Card, Typography } from 'components/Atomic'
import { DropdownMenu } from 'components/Atomic/Dropdown'
import { Input } from 'components/Input'
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
    <div className="self-center shrink  mx-auto md:mx-0 md:w-fit md:max-w[1200px]">
      <ViewHeader withBack title="Node Manager" />
      <Card className="flex-col items-center p-0 md:w-full mt-4 md:mt-12 shadow-lg">
        <Card
          size="lg"
          className="flex-col md:w-full self-stretch items-center shadow-lg gap-y-4"
        >
          <Box className="bg-light-gray-light dark:bg-dark-gray-light rounded-xl px-3 md:px-6">
            <Box alignCenter className="py-2 md:gap-x-52 ">
              <Input
                className="text-lg text-left font-normal border-none"
                placeholder="Node Address"
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
            <Box className="bg-light-gray-light dark:bg-dark-gray-light rounded-xl px-3">
              <Box className="py-2 md:gap-x-40" alignCenter justify="between">
                {type === Types.Bond ? (
                  <Typography
                    fontWeight="medium"
                    variant="body"
                    className="px-3"
                  >
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
                    className="md:px-5 text-lg text-right font-normal w-28 md:w-full border-none"
                    placeholder="Amount"
                    onChange={(event) => setAmount(event.target.value)}
                    value={amount}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </Card>

        <Box className="py-5 md:py-10" col>
          <Button className="px-20">{t('views.nodes.complete')}</Button>
        </Box>
      </Card>
    </div>
  )
}

export default NodeManager
