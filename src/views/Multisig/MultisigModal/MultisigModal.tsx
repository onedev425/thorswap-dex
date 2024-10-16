import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box, Button, Modal } from "components/Atomic";
import { FieldLabel, TextField } from "components/Form";
import { HoverIcon } from "components/HoverIcon";
import { Input } from "components/Input";
import { Scrollbar } from "components/Scrollbar";
import { t } from "services/i18n";
import { useMultisigForm } from "views/Multisig/MultisigCreate/hooks";

type Props = {
  isOpen: boolean;
  onCancel?: () => void;
};

export const MultisigModal = ({ isOpen, onCancel = () => undefined }: Props): React.JSX.Element => {
  const { formFields, submit, errors, register, addMember, removeMember, isRequiredMember } =
    useMultisigForm();

  return (
    <Modal isOpened={isOpen} onClose={onCancel} title={t("views.multisig.multisigModalTitle")}>
      <Box col>
        <Box
          col
          className="!w-[300px] md:!w-[450px] gap-3 max-h-[80vh] lg:max-h-[65vh] overflow-y-auto -mr-7"
        >
          <Scrollbar maxHeight="65vh">
            <Box col className="gap-6 pr-7">
              <Text className="mx-2 my-3" textStyle="caption">
                {t("views.multisig.nameYourMultisigWallet")}
              </Text>

              <Box col>
                <TextField
                  field={formFields.name}
                  hasError={!!errors.name}
                  label={t("views.multisig.nameOfNewMultisig")}
                  placeholder={t("views.multisig.nameExample")}
                />
              </Box>

              <Box col>
                <FieldLabel
                  hasError={!!errors.signatureValidation}
                  label={`${t("views.multisig.members")}${
                    errors.signatureValidation ? ` (${errors.signatureValidation.message})` : ""
                  }`}
                />
                <Text className="mx-2 my-3" fontWeight="semibold" textStyle="caption-xs">
                  {t("views.multisig.addMembersDescription")}
                </Text>
                <Box className="mx-2">
                  <Box flex={1}>
                    <Text textStyle="caption">{t("views.multisig.walletName")}</Text>
                  </Box>
                  <Box flex={2}>
                    <Text textStyle="caption">{t("common.pubKey")}</Text>
                  </Box>
                </Box>
                <Box col className="gap-4">
                  {formFields.members.map((item, index) => (
                    <Box className="gap-2" key={item.id}>
                      <Box flex={1}>
                        <TextField
                          field={register(`members.${index}.name`)}
                          hasError={!!errors.members?.[index]?.name}
                          placeholder={t("views.multisig.memberName")}
                        />
                      </Box>
                      <Box flex={2}>
                        <TextField
                          field={register(`members.${index}.pubKey`, {
                            required: isRequiredMember(index),
                          })}
                          hasError={!!errors.members?.[index]?.pubKey}
                          placeholder="Member public key (base 64)"
                        />
                      </Box>

                      {isRequiredMember(index) ? (
                        <HoverIcon
                          color="secondary"
                          iconName="infoCircle"
                          tooltip={t("views.multisig.requiredMember")}
                        />
                      ) : (
                        <HoverIcon
                          color="secondary"
                          iconName="close"
                          onClick={() => {
                            removeMember(index);
                          }}
                          tooltip={t("views.multisig.removeMember")}
                        />
                      )}
                    </Box>
                  ))}

                  <Button stretch onClick={addMember} variant="outlineTertiary">
                    {t("views.multisig.addMember")}
                  </Button>
                </Box>
              </Box>

              <Box center className="mx-1 gap-2">
                <Text textStyle="caption">{t("views.multisig.setMultisigSigners")}</Text>

                <Box center className="gap-2">
                  <Input
                    stretch
                    border="rounded"
                    className="py-1 min-w-[25px] text-right"
                    containerClassName={classNames({
                      "!border-red": !!errors.threshold,
                    })}
                    {...formFields.threshold}
                  />

                  <Text className="whitespace-nowrap" textStyle="caption">
                    {t("views.multisig.outOf")}
                    {formFields.members.length}
                  </Text>
                </Box>
              </Box>

              <Box className="mt-8" flex={1}>
                <Button stretch onClick={() => submit(onCancel)} variant="secondary">
                  {t("views.multisig.create")}
                </Button>
              </Box>
            </Box>
          </Scrollbar>
        </Box>
      </Box>
    </Modal>
  );
};
