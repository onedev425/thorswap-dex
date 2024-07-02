import { Text } from "@chakra-ui/react";
import { Box, Button, Icon } from "components/Atomic";
import { Helmet } from "components/Helmet";
import { Input } from "components/Input";
import { downloadAsFile } from "helpers/download";
import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { t } from "services/i18n";
import { logException } from "services/logger";

export const PhraseView = () => {
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [password, setPassword] = useState<string>("");
  const [phrase, setPhrase] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInvalidStatus(false);
    setPassword(e.target.value);
  }, []);

  const handlePhraseChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInvalidStatus(false);
    setPhrase(e.target.value);
  }, []);

  const handleBackupKeystore = useCallback(async () => {
    if (phrase && password) {
      setProcessing(true);
      const { encryptToKeyStore } = await import("@swapkit/wallet-keystore");

      try {
        const keystore = await encryptToKeyStore(phrase, password);

        downloadAsFile("thorswap-keystore.txt", JSON.stringify(keystore));

        // clean up
        setPassword("");
        setPhrase("");
      } catch (error) {
        logException((error as Error).toString());
        setProcessing(false);
        setInvalidStatus(true);
      }
      setProcessing(false);
    }
  }, [phrase, password]);

  const ready = password.length > 0 && !invalidStatus && !processing;

  return (
    <Box col className="w-full">
      <Helmet
        content={t("views.walletModal.importPhrase")}
        title={t("views.walletModal.importPhrase")}
      />
      <Box row className="space-x-2">
        <Text className="mb-2" fontWeight="semibold" textStyle="subtitle2">
          {t("views.walletModal.enterSeed")}
        </Text>
      </Box>

      <Box className="ph-no-capture w-full">
        <Input
          stretch
          border="rounded"
          name="phrase"
          onChange={handlePhraseChange}
          placeholder={t("views.walletModal.phrase")}
          value={phrase}
        />
      </Box>

      {invalidStatus && (
        <Text className="mt-2 ml-3" textStyle="caption" variant="red">
          {t("common.defaultErrMsg")}
        </Text>
      )}

      <Box row className="space-x-2 mt-6 mb-2">
        <Text textStyle="subtitle2">{t("views.walletModal.keystorePassword")}</Text>
      </Box>

      <Box className="w-full">
        <Input
          stretch
          border="rounded"
          disabled={!phrase}
          name="password"
          onChange={handlePasswordChange}
          placeholder={t("views.walletModal.confirmPassword")}
          type="password"
          value={password}
        />
      </Box>

      <Box className="mt-6">
        <Button
          className="flex-1 group"
          disabled={!ready}
          loading={processing}
          onClick={handleBackupKeystore}
          rightIcon={<Icon className="transition group-hover:text-white" name="backup" size={18} />}
          size="sm"
        >
          {t("views.walletModal.backupKeystore")}
        </Button>
      </Box>
    </Box>
  );
};
