import { useCallback, useState } from 'react'

import {
  Amount,
  AssetAmount,
  chainToSigAsset,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'

import { Box, Button, Table } from 'components/Atomic'
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron'

import { t } from 'services/i18n'

import { useColumns } from './useColumns'

type Props = {
  chainInfo: AssetAmount[]
  chain: SupportedChain
  chainAddress: string
}

export const ChainInfoTable = ({ chainInfo, chain, chainAddress }: Props) => {
  const [showAllTokens, setShowAllTokens] = useState(false)
  const sigAsset = chainToSigAsset(chain)

  const altAssets = chainInfo.filter((item) => !item.asset.eq(sigAsset))
  const sigAssetAmount =
    chainInfo.find((item) => item.asset.eq(sigAsset)) ||
    new AssetAmount(sigAsset, Amount.fromNormalAmount(0))

  const handleToggleTokens = useCallback(() => {
    setShowAllTokens((v) => !v)
  }, [])

  const columns = useColumns(chainAddress, chain)
  const tableData = showAllTokens
    ? [sigAssetAmount, ...altAssets]
    : [sigAssetAmount]

  return (
    <Box col className="transition-all">
      <Table
        data={tableData}
        columns={columns}
        sortable={tableData.length > 1}
        hasShadow={false}
      />
      {!!altAssets.length && (
        <Button
          variant="tint"
          onClick={handleToggleTokens}
          startIcon={<CollapseChevron isActive={showAllTokens} />}
        >
          {showAllTokens
            ? t('views.wallet.hideTokens')
            : t('views.wallet.showAllTokens')}
        </Button>
      )}
    </Box>
  )
}
