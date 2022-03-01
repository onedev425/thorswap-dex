import { useState } from 'react'

import { buttons, columns, data, STATS_DATA } from 'views/Nodes/data'

import { Box, Button, Link, Table, Typography } from 'components/Atomic'
import { Input } from 'components/Input'
import { StatsList } from 'components/StatsList/StatsList'

import { t } from 'services/i18n'

const Nodes = () => {
  const [value, setValue] = useState('')

  return (
    <Box col>
      <StatsList scrollable list={STATS_DATA} />
      <Typography className="my-[40px]" variant="h2" fontWeight="semibold">
        {t('views.nodes.watchList')}
        <Typography
          className="inline-block ml-[10px]"
          color="secondary"
          variant="h2"
          fontWeight="semibold"
        >
          {'(5)'}
        </Typography>
      </Typography>
      <Table data={data} columns={columns} />
      <Box
        className="md:my-8 gap-4 !my-4 flex-grow lg:flex-row lg:justify-between"
        justify="between"
        align="start"
        col
      >
        <Box alignCenter justify="between">
          <div className="mx-2.5">
            <Input
              border="rounded"
              icon="search"
              placeholder="Search by address"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </div>
          <Link className="no-underline" to="/node-manager">
            <Button size="sm" variant="tint" type="outline">
              {t('common.manage')}
            </Button>
          </Link>
        </Box>

        <div className="flex mx-[10px]">
          {buttons.map((item) => {
            return (
              <Button
                key={item.name}
                className="mx-1"
                size="sm"
                variant="tint"
                type="outline"
              >
                {item.name}
              </Button>
            )
          })}
        </div>
      </Box>
      <Table data={[...data, ...data]} columns={columns} />
    </Box>
  )
}

export default Nodes
