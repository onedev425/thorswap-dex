import { ChangeEvent, useCallback, useMemo, useState } from 'react'

import { useParams } from 'react-router-dom'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import { Amount, Asset, hasWalletConnected } from '@thorswap-lib/multichain-sdk'
import { THORChain } from '@thorswap-lib/xchain-util'

import { useAccountData, useNodeDetailInfo } from 'views/Nodes/hooks'
import { NodeAction } from 'views/Nodes/types'

import {
  Box,
  Button,
  Collapse,
  Icon,
  Link,
  Select,
  Typography,
} from 'components/Atomic'
import { InfoTable } from 'components/InfoTable'
import { Input } from 'components/Input'
import { PanelView } from 'components/PanelView'
import { showToast, ToastType } from 'components/Toast'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { useWallet } from '../../../store/wallet/hooks'

const options = [NodeAction.BOND, NodeAction.UNBOND, NodeAction.LEAVE]

export const NodeDetails = () => {
  const { nodeAddress } = useParams<{ nodeAddress: string }>()
  const { nodeInfo, nodeLoading, isFavorite, handleAddToWatchList } =
    useNodeDetailInfo(nodeAddress)
  const [amount, setAmount] = useState<Amount>(Amount.fromNormalAmount(0))
  const [actionIndex, setActionIndex] = useState(0)
  const { wallet } = useWallet()
  const [bondMode, setBondMode] = useState<NodeAction>(NodeAction.BOND)

  const thorWalletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [Asset.RUNE()] }),
    [wallet],
  )

  const nodeTableData = useAccountData(nodeInfo as THORNode)

  const isBonder = useMemo(() => {
    if (!nodeInfo || !wallet?.THOR || nodeLoading) return false

    return wallet?.THOR?.address === (nodeInfo as THORNode).bond_address
  }, [nodeInfo, nodeLoading, wallet])

  const handleActionChange = useCallback((index: number) => {
    setActionIndex(index)
    setBondMode(options[index])
  }, [])

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAmount(Amount.fromNormalAmount(e.target.value))
  }, [])

  const handleComplete = useCallback(async () => {
    /**
     * 1. check thor wallet connection
     * 2. check if bond address matches to wallet address
     */

    if (!nodeInfo) return

    if (!thorWalletConnected) {
      showToast(
        {
          message: t('views.nodes.detail.WalletNotConnected'),
          description: t('views.nodes.detail.ConnectThorChainAgainPlease'),
        },
        ToastType.Info,
      )
      return
    }

    if (!isBonder) {
      showToast(
        {
          message: t('views.nodes.detail.InvalidNodeAction'),
          description: t('views.nodes.detail.AddressDonNotMatch'),
        },
        ToastType.Info,
      )
      return
    }

    try {
      if (bondMode === NodeAction.BOND) {
        const txHash = await multichain.bond(nodeInfo.node_address, amount)
        const txURL = multichain.getExplorerTxUrl(THORChain, txHash)
        showToast(
          {
            message: t('views.nodes.detail.ViewBondTx'),
            description: (
              <>
                <Typography variant="caption-xs" fontWeight="light">
                  {t('views.nodes.detail.transactionSentSuccessfully')}
                </Typography>
                <Link to={txURL} className="no-underline pt-3">
                  <Button size="sm" variant="tint" type="outline">
                    {t('views.nodes.detail.ViewTransaction')}
                  </Button>
                </Link>
              </>
            ),
          },
          ToastType.Success,
        )
      } else if (bondMode === NodeAction.UNBOND) {
        const txURL = await multichain.unbond(
          nodeInfo.node_address,
          amount.assetAmount.toNumber(),
        )
        showToast(
          {
            message: t('views.nodes.detail.ViewUnBondTx'),
            description: (
              <>
                <Typography variant="caption-xs" fontWeight="light">
                  {t('views.nodes.detail.transactionSentSuccessfully')}
                </Typography>
                <Link to={txURL} className="no-underline pt-3">
                  <Button size="sm" variant="tint" type="outline">
                    {t('views.nodes.detail.ViewTransaction')}
                  </Button>
                </Link>
              </>
            ),
          },
          ToastType.Success,
        )
      } else {
        const txURL = await multichain.leave(nodeInfo.node_address)
        showToast(
          {
            message: t('views.nodes.detail.ViewLeaveTx'),
            description: (
              <>
                <Typography variant="caption-xs" fontWeight="light">
                  {t('views.nodes.detail.transactionSentSuccessfully')}
                </Typography>
                <Link to={txURL} className="no-underline pt-3">
                  <Button size="sm" variant="tint" type="outline">
                    {t('views.nodes.detail.ViewTransaction')}
                  </Button>
                </Link>
              </>
            ),
          },
          ToastType.Success,
        )
      }
    } catch (error) {
      showToast(
        {
          message: t('views.nodes.detail.TransactionFailed'),
          description: `${error}`,
        },
        ToastType.Error,
      )
    }
  }, [nodeInfo, bondMode, amount, thorWalletConnected, isBonder])

  if (!nodeInfo) return null

  return (
    <PanelView
      title="Node Detail"
      header={
        <ViewHeader
          withBack
          title={t('views.nodes.detail.nodeInformation')}
          actionsComponent={
            <Box row>
              <Icon
                size={26}
                name={isFavorite ? 'heartFilled' : 'heart'}
                color={isFavorite ? 'pink' : 'secondary'}
                onClick={() =>
                  handleAddToWatchList(nodeAddress ? nodeAddress : '')
                }
              />
            </Box>
          }
        />
      }
    >
      <Box className="w-full space-y-3 px-4 pt-3" col marginBottom={3}>
        <InfoTable items={nodeTableData} />
      </Box>

      <Collapse
        className="!py-2 self-stretch mt-5 !bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl flex-col"
        shadow={false}
        title={
          <div className="flex flex-row gap-x-2">
            <Typography fontWeight="medium">
              {t('common.showActions')}
            </Typography>
          </div>
        }
      >
        <Box col>
          <Select
            options={options}
            activeIndex={actionIndex}
            onChange={handleActionChange}
          />
          {actionIndex !== 2 && (
            <Box justify="between" className="!mt-2" justifyCenter alignCenter>
              <Typography>
                {options[actionIndex]} {t('views.nodes.detail.amount')}
                {actionIndex === 1 ? '(ᚱ)' : ''}:
              </Typography>
              <Input
                placeholder={t('views.nodes.detail.enterAmount')}
                value={amount.toFixed(0)}
                border="rounded"
                onChange={handleInputChange}
                type="number"
              />
            </Box>
          )}
          <Box col marginTop={4}>
            <Button onClick={handleComplete}>
              {t('views.nodes.detail.complete')}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </PanelView>
  )
}
