import classNames from 'classnames'

import { NodeManagePanel } from 'views/Nodes/NodeManagePanel/NodeManagePanel'

import { Box, Card, Typography, useCollapse } from 'components/Atomic'
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse'
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron'

import { t } from 'services/i18n'

type Props = {
  nodeAddress: string
  nodeLoading: boolean
}

export const NodeDetailsActionPanel = ({ nodeAddress }: Props) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()

  return (
    <Card className="!rounded-2xl md:!rounded-3xl !p-0 flex-col items-center self-stretch shadow-lg w-full md:h-auto max-w-[480px] mx-auto">
      <Box
        className="w-full cursor-pointer px-6 py-4 pr-8"
        justify="between"
        onClick={toggle}
      >
        <Typography>{t('views.nodes.nodeActions')}</Typography>
        <CollapseChevron isActive={isActive} />
      </Box>

      <Box className="px-4 self-stretch">
        <div
          className={classNames('w-full', maxHeightTransitionClass)}
          ref={contentRef}
          style={maxHeightStyle}
        >
          <NodeManagePanel address={nodeAddress} />

          <Box className="pb-4"></Box>
        </div>
      </Box>
    </Card>
  )
}
