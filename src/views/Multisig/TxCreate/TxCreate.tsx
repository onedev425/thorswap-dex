import { Box } from "components/Atomic";
import { PanelView } from "components/PanelView";
import { ViewHeader } from "components/ViewHeader";
import { t } from "services/i18n";
import { TxCreateProvider } from "views/Multisig/TxCreate/TxCreateContext";
import { TxDetails } from "views/Multisig/TxCreate/TxDetails";
import { RefreshButton } from "views/Multisig/components/RefreshButton";
import { useMultisigProtectedRoute } from "views/Multisig/hooks";

const TxCreate = () => {
  useMultisigProtectedRoute();

  return (
    <TxCreateProvider>
      <PanelView
        header={
          <Box className="w-full justify-between align-center">
            <ViewHeader withBack title={t("views.multisig.createTransaction")} />
            <Box className="px-6">
              <RefreshButton />
            </Box>
          </Box>
        }
        title={t("views.multisig.createTransaction")}
      >
        <Box col className="self-stretch" flex={1}>
          <TxDetails />
        </Box>
      </PanelView>
    </TxCreateProvider>
  );
};

export default TxCreate;
