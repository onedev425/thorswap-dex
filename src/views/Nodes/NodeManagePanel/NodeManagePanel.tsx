import { useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { useNodeManager } from 'views/Nodes/hooks/hooks'
import { BondActionType, NodeManagePanelProps } from 'views/Nodes/types'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Typography } from 'components/Atomic'
import { PanelInput } from 'components/PanelInput'
import { TabsSelect } from 'components/TabsSelect'

import { t } from 'services/i18n'

export const NodeManagePanel = ({
  address,
  handleBondAction,
  skipWalletCheck,
}: NodeManagePanelProps) => {
  const [nodeAddress, setNodeAddress] = useState(address || '')
  const {
    tabs,
    handleComplete,
    activeTab,
    rawAmount,
    onAmountChange,
    onTabChange,
    isWalletConnected,
    setIsConnectModalOpen,
  } = useNodeManager({
    address: nodeAddress,
    handleBondAction,
    skipWalletCheck,
  })

  return (
    <Box className="self-stretch gap-1" col>
      <TabsSelect tabs={tabs} value={activeTab.value} onChange={onTabChange} />

      {!address && (
        <PanelInput
          title={t('common.nodeAddress')}
          onChange={(e) => setNodeAddress(e.target.value)}
          value={nodeAddress}
          placeholder="thor..."
          stretch
          autoFocus
        />
      )}

      <Box
        className={classNames(
          'transition-all overflow-hidden',
          activeTab.value === BondActionType.Leave
            ? 'max-h-[0px]'
            : 'max-h-[86px]',
        )}
      >
        <PanelInput
          className="flex-1 overflow-hidden"
          title={
            activeTab.value === BondActionType.Bond
              ? t('views.nodes.bondAmount')
              : t('views.nodes.unbondAmount')
          }
          placeholder={t('common.amount')}
          onChange={onAmountChange}
          value={rawAmount}
          suffix={
            <Box className="w-[84px] gap-x-2 pt-2">
              <Typography variant="subtitle2">{Asset.RUNE().ticker}</Typography>
              <AssetIcon asset={Asset.RUNE()} size={26} />
            </Box>
          }
        />
      </Box>

      <Box center className="w-full pt-5">
        <Button
          isFancy
          stretch
          size="lg"
          onClick={
            isWalletConnected
              ? handleComplete
              : () => setIsConnectModalOpen(true)
          }
        >
          {isWalletConnected ? activeTab.label : t('common.connectWallet')}
        </Button>
      </Box>
    </Box>
  )
}
