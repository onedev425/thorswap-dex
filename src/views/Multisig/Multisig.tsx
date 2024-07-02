import { Text } from "@chakra-ui/react";
import { Box, Link } from "components/Atomic";
import { THORSWAP_MULTI_SIG } from "config/constants";
import { t } from "services/i18n";
import { useAppSelector } from "store/store";
import { MultisigCreateTile } from "views/Multisig/MultisigCreate/MultisigCreateTile";
import { MultisigImportTile } from "views/Multisig/MultisigImport/MultisigImportTile";
import { MultisigInfo } from "views/Multisig/MultisigInfo";

const Multisig = () => {
  const hasWallet = useAppSelector(({ multisig }) => !!multisig.address);

  return hasWallet ? (
    <MultisigInfo />
  ) : (
    <Box col>
      <Box className="gap-5">
        <Box alignCenter flex={1} justify="between">
          <Text className="mb-5 mx-3" textStyle="h3">
            {t("views.multisig.thorSafeWallet")}
          </Text>
        </Box>
      </Box>
      <Box col className="gap-3 mb-3 mx-3 lg:w-11/12">
        <Text fontWeight="semibold" textStyle="caption" variant="secondary">
          {t("views.multisig.thorsafeDescription")}
        </Text>
        <Text fontWeight="normal" textStyle="caption" variant="secondary">
          {t("views.multisig.thorsafeSecondDescription")}
          <Link className="text-twitter-blue" to={THORSWAP_MULTI_SIG}>
            {t("common.learnMore")}
          </Link>
        </Text>
      </Box>

      <Box className="flex-col md:flex-row gap-5">
        <Box className="gap-4 basis-full">
          <MultisigCreateTile />
        </Box>
        <Box className="gap-4 basis-full">
          <MultisigImportTile />
        </Box>
      </Box>
    </Box>
  );
};

export default Multisig;
