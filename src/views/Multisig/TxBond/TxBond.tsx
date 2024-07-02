import { Box } from "components/Atomic";
import { memo } from "react";
import { useTxBond } from "views/Multisig/TxBond/hooks";
import { NodeManagePanel } from "views/Nodes/NodeManagePanel/NodeManagePanel";

export const TxBond = memo(() => {
  const handleBondAction = useTxBond();

  return (
    <Box col className="gap-1" flex={1}>
      <NodeManagePanel skipWalletCheck handleBondAction={handleBondAction} />
    </Box>
  );
});
