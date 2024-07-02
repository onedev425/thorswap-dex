import { PanelView } from "components/PanelView";
import { ViewHeader } from "components/ViewHeader";
import { t } from "services/i18n";
import { NodeManagePanel } from "views/Nodes/NodeManagePanel/NodeManagePanel";

const NodeManager = () => {
  return (
    <PanelView
      header={<ViewHeader withBack title={t("common.nodeManager")} />}
      title={t("common.nodeManager")}
    >
      <NodeManagePanel />
    </PanelView>
  );
};

export default NodeManager;
