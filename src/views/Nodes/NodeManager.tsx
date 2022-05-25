import { NodeManagePanel } from 'views/Nodes/NodeManagePanel/NodeManagePanel'

import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

const NodeManager = () => {
  return (
    <PanelView
      title={t('common.nodeManager')}
      header={<ViewHeader withBack title={t('common.nodeManager')} />}
    >
      <NodeManagePanel />
    </PanelView>
  )
}

export default NodeManager
