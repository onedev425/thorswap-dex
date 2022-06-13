import { useParams } from 'react-router-dom'

import { THORNode } from '@thorswap-lib/midgard-sdk'
import classNames from 'classnames'

import { useNodeStats, useNodeDetailInfo } from 'views/Nodes/hooks/hooks'
import { NodeDetailsActionPanel } from 'views/Nodes/NodeDetails/NodeDetailsActionPanel'

import { Box, Button, useCollapse } from 'components/Atomic'
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse'
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron'
import { HoverIcon } from 'components/HoverIcon'
import { InfoTable } from 'components/InfoTable'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const NodeDetails = () => {
  const {
    isActive: isTableActive,
    contentRef: contentTableRef,
    toggle: toggleTable,
    maxHeightStyle: maxTableHeightStyle,
  } = useCollapse()

  const { nodeAddress } = useParams<{ nodeAddress: string }>()
  const { nodeInfo, nodeLoading, isFavorite, handleAddToWatchList } =
    useNodeDetailInfo(nodeAddress)

  const nodeTableData = useNodeStats(nodeInfo as THORNode)

  if (!nodeInfo) return null

  return (
    <Box className="gap-1" col>
      <PanelView
        title="Node Detail"
        header={
          <ViewHeader
            withBack
            title={t('views.nodes.detail.nodeInformation')}
            actionsComponent={
              <Box row>
                <HoverIcon
                  size={26}
                  iconName={isFavorite ? 'heartFilled' : 'heart'}
                  color={isFavorite ? 'pink' : 'secondary'}
                  onClick={() =>
                    handleAddToWatchList(nodeAddress ? nodeAddress : '')
                  }
                  iconHoverHighlight={false}
                />
              </Box>
            }
          />
        }
      >
        <Box className="self-stretch !mt-3" col>
          <InfoTable
            items={nodeTableData.slice(0, 6)}
            size="md"
            horizontalInset
          />
          <div
            className={classNames('w-full', maxHeightTransitionClass)}
            ref={contentTableRef}
            style={maxTableHeightStyle}
          >
            <InfoTable
              items={nodeTableData.slice(6, nodeTableData.length)}
              size="md"
              horizontalInset
            />
          </div>
          <Box className="!mt-2" flex={1} justify="end">
            <Button
              variant="primary"
              type="borderless"
              onClick={toggleTable}
              endIcon={<CollapseChevron isActive={isTableActive} />}
            >
              {isTableActive
                ? t('views.nodes.detail.hideDetails')
                : t('views.nodes.detail.showDetails')}
            </Button>
          </Box>
        </Box>
      </PanelView>

      <NodeDetailsActionPanel
        nodeLoading={nodeLoading}
        nodeAddress={nodeInfo.node_address}
      />
    </Box>
  )
}

export default NodeDetails
