import { useState } from 'react'

import { buttons, columns, data, STATS_DATA } from 'views/Nodes/data'

import { Button, Table, Typography } from 'components/Atomic'
import { Input } from 'components/Input'
import { StatsListScrollable } from 'components/StatsList/StatsListScrollable'

import { t } from 'services/i18n'

const Nodes = () => {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col">
      <StatsListScrollable list={STATS_DATA} />
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
      <div className="flex justify-between my-[32px]">
        <div className="flex justify-between">
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
          <div className="mx-[40px]">
            <Input
              icon="search"
              placeholder="Search by address"
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
          </div>
        </div>
        <Button size="sm" variant="tint" type="outline">
          {t('common.manage')}
        </Button>
      </div>
      <Table data={[...data, ...data]} columns={columns} />
    </div>
  )
}

export default Nodes
