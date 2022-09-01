import classNames from 'classnames';
import { Box, Card, Typography, useCollapse } from 'components/Atomic';
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse';
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron';
import { t } from 'services/i18n';
import { NodeManagePanel } from 'views/Nodes/NodeManagePanel/NodeManagePanel';

type Props = {
  nodeAddress: string;
};

export const NodeDetailsActionPanel = ({ nodeAddress }: Props) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();

  return (
    <Card className="!rounded-2xl !py-0 !pl-6 !pr-8 md:!rounded-3xl flex-col items-center self-stretch shadow-lg w-full md:h-auto max-w-[480px] mx-auto">
      <Box className="w-full py-4 cursor-pointer" justify="between" onClick={toggle}>
        <Typography>{t('views.nodes.nodeActions')}</Typography>
        <CollapseChevron isActive={isActive} />
      </Box>

      <Box className="px-4 self-stretch">
        <div className={classNames('w-full', maxHeightTransitionClass)} style={maxHeightStyle}>
          <Box col ref={contentRef}>
            <NodeManagePanel address={nodeAddress} />
            <Box className="py-2" />
          </Box>
        </div>
      </Box>
    </Card>
  );
};
