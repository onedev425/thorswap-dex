import { useCallback, useState } from 'react'

import { AssetAmount } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Table } from 'components/Atomic'

import { t } from 'services/i18n'

import { useColumns } from './useColumns'

type Props = {
  chainInfo: AssetAmount[]
}

export const ChainInfoTable = ({ chainInfo }: Props) => {
  const [showAllTokens, setShowAllTokens] = useState(false)

  const handleToggleTokens = useCallback(() => {
    setShowAllTokens((v) => !v)
  }, [])

  const columns = useColumns()

  return (
    <Box col className="transition-all">
      <Table
        data={chainInfo.slice(0, showAllTokens ? undefined : 1)}
        columns={columns}
        sortable
      />
      <Button type="outline" onClick={handleToggleTokens}>
        {showAllTokens
          ? t('views.wallet.hideTokens')
          : t('views.wallet.showAllTokens')}
      </Button>
    </Box>
  )
}
