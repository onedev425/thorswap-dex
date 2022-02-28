import { useState } from 'react'

import { Box, Button, Card, Typography } from 'components/Atomic'
import { DropdownMenu } from 'components/Dropdown'
import { Input } from 'components/Input'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const menuItems = [
  { label: 'BOND', value: 'BOND' },
  { label: 'UNBOND', value: 'UNBOND' },
  { label: 'LEAVE', value: 'LEAVE' },
]

const NodeManager = () => {
  const [value, setValue] = useState('BOND')
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
                  value={value}
                  onChange={(v) => setValue(v)}
                  openLabel={value}
                />
              </div>
            </Box>
          </Box>
          {value !== 'LEAVE' && (
            <Box className="bg-light-gray-light dark:bg-dark-gray-light rounded-xl px-3">
              <Box className="py-2 md:gap-x-40" alignCenter justify="between">
                {value === 'BOND' ? (
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

                <Box className="pl-11 md:pl-0" alignCenter>
                  <Input
                    type={'number'}
                    className="md:px-5 text-lg text-left font-normal w-28 md:w-full border-none"
                    placeholder="Amount"
                    autoFocus
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
