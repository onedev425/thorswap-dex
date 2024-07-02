import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box, Button, Checkbox, Icon } from "components/Atomic";
import { showSuccessToast } from "components/Toast";
import { borderHoverHighlightClass, genericBgClasses } from "components/constants";
import copy from "copy-to-clipboard";
import { useCallback, useMemo, useState } from "react";
import { t } from "services/i18n";

type Props = {
  phrase: string;
  onConfirm: () => void;
};

export const ConfirmKeystorePhrase = ({ phrase, onConfirm }: Props) => {
  const [keystoreCopyConfirmed, setKeystoreCopyConfirmed] = useState(false);
  const phrases = useMemo(() => phrase?.split(" ") || [], [phrase]);

  const handleCopyPhrase = useCallback(() => {
    copy(phrase);
    showSuccessToast(t("views.walletModal.phraseCopied"));
  }, [phrase]);

  return (
    <Box col className="w-full md:!min-w-[350px] max-w-[420px] self-stretch" flex={1}>
      <Box col className="gap-2">
        <Box justify="end">
          <Button
            onClick={handleCopyPhrase}
            rightIcon={<Icon color="primaryBtn" name="copy" />}
            variant="borderlessTint"
          >
            {t("views.walletModal.copyPhrase")}
          </Button>
        </Box>
        <Box
          className={classNames(
            "ph-no-capture grid p-2.5 rounded-2xl grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            genericBgClasses.primary,
            borderHoverHighlightClass,
          )}
        >
          {phrases.map((phrase: string, index: number) => {
            return (
              <Box alignCenter className="p-1.5" key={phrase}>
                <Text>
                  {index + 1}. {phrase}
                </Text>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box className="mb-3">
        <Checkbox
          className="pt-4 pb-2"
          label={
            <Box alignCenter>
              <Text>{t("views.walletModal.confirmBackupKeystore")}</Text>
            </Box>
          }
          onValueChange={(v) => setKeystoreCopyConfirmed(v)}
          value={keystoreCopyConfirmed}
        />
      </Box>

      <Button disabled={!keystoreCopyConfirmed} onClick={onConfirm}>
        Continue
      </Button>
    </Box>
  );
};
