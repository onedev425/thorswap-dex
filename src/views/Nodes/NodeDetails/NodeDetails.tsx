import type { THORNode } from '@thorswap-lib/midgard-sdk';
import classNames from 'classnames';
import { Box, Button, useCollapse } from 'components/Atomic';
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse';
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron';
import { HoverIcon } from 'components/HoverIcon';
import { InfoTable } from 'components/InfoTable';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useGetNodesQuery } from 'store/midgard/api';
import { useNodeStats } from 'views/Nodes/hooks/hooks';
import { NodeDetailsActionPanel } from 'views/Nodes/NodeDetails/NodeDetailsActionPanel';

const NodeDetails = () => {
  const { nodeWatchList, setWatchList } = useApp();
  const {
    isActive: isTableActive,
    contentRef: contentTableRef,
    toggle: toggleTable,
    maxHeightStyle: maxTableHeightStyle,
  } = useCollapse();

  const { nodeAddress } = useParams<{ nodeAddress: string }>();
  const { data } = useGetNodesQuery();
  const nodeInfo = useMemo(
    () => data?.find((node) => node.node_address === nodeAddress),
    [data, nodeAddress],
  );

  const isFavorite = useMemo(() => {
    return nodeWatchList.includes(nodeAddress || '#');
  }, [nodeAddress, nodeWatchList]);

  const handleAddToWatchList = useCallback(
    (address: string) => {
      const isSelected = nodeWatchList.includes(address);
      if (!isSelected) {
        setWatchList([address, ...nodeWatchList]);
      } else {
        const newList = nodeWatchList.filter((addr) => addr !== address);
        setWatchList(newList);
      }
    },
    [setWatchList, nodeWatchList],
  );

  const nodeTableData = useNodeStats(nodeInfo as THORNode);

  if (!nodeInfo) return null;

  return (
    <Box col className="gap-1">
      <PanelView
        header={
          <ViewHeader
            withBack
            actionsComponent={
              <Box row>
                <HoverIcon
                  color={isFavorite ? 'pink' : 'secondary'}
                  iconHoverHighlight={false}
                  iconName={isFavorite ? 'heartFilled' : 'heart'}
                  onClick={() => handleAddToWatchList(nodeAddress ? nodeAddress : '')}
                  size={26}
                />
              </Box>
            }
            title={t('views.nodes.detail.nodeInformation')}
          />
        }
        title="Node Detail"
      >
        <Box col className="self-stretch !mt-3">
          <InfoTable horizontalInset items={nodeTableData.slice(0, 6)} size="md" />

          <div
            className={classNames('w-full', maxHeightTransitionClass)}
            ref={contentTableRef}
            style={maxTableHeightStyle}
          >
            <InfoTable
              horizontalInset
              items={nodeTableData.slice(6, nodeTableData.length)}
              size="md"
            />
          </div>
          <Box className="!mt-2" flex={1} justify="end">
            <Button
              onClick={toggleTable}
              rightIcon={<CollapseChevron isActive={isTableActive} />}
              variant="borderlessPrimary"
            >
              {isTableActive
                ? t('views.nodes.detail.hideDetails')
                : t('views.nodes.detail.showDetails')}
            </Button>
          </Box>
        </Box>
      </PanelView>

      <NodeDetailsActionPanel nodeAddress={nodeInfo.node_address} />
    </Box>
  );
};

export default NodeDetails;
