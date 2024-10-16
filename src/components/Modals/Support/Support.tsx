import { Text } from "@chakra-ui/react";
import classNames from "classnames";
import { Box, Icon, Link, Modal } from "components/Atomic";
import { DISCORD_URL, THORSWAP_DOCUMENTATION_URL, THORSWAP_YOUTUBE_URL } from "config/constants";
import { t } from "services/i18n";

type Props = {
  isOpen: boolean;
  onCancel?: () => void;
};

const commonClasses = "py-2.5 px-2.5 md:px-8 rounded-2xl gap-3 hover:bg-opacity-80 transition";

export const SupportModal = ({ isOpen, onCancel = () => undefined }: Props): React.JSX.Element => {
  return (
    <Modal isOpened={isOpen} onClose={onCancel} title={t("common.support")}>
      <Box col className="!w-[300px] md:!w-[350px] gap-3">
        <Text>{t("components.sidebar.supportInfo")}</Text>

        <Link to={DISCORD_URL}>
          <Box
            alignCenter
            className={classNames(commonClasses, "bg-discord-purple")}
            flex={1}
            justify="between"
          >
            <Text className="!text-white">{t("components.sidebar.joinDiscord")}</Text>
            <Icon className="fill-white" name="discord" />
          </Box>
        </Link>

        <Link to={THORSWAP_YOUTUBE_URL}>
          <Box
            alignCenter
            className={classNames(commonClasses, "bg-red")}
            flex={1}
            justify="between"
          >
            <Text className="!text-white">{t("components.sidebar.thorswapCommunityYoutube")}</Text>
            <Icon className="fill-white" name="youtube" />
          </Box>
        </Link>

        <Link to={THORSWAP_DOCUMENTATION_URL}>
          <Box
            alignCenter
            className={classNames(commonClasses, "bg-btn-primary")}
            flex={1}
            justify="between"
          >
            <Text className="!text-white">{t("components.sidebar.thorswapDocumentation")}</Text>
            <Icon className="fill-white" name="docs" />
          </Box>
        </Link>

        <Link external to="/tos">
          <Box
            alignCenter
            className={classNames(commonClasses, "bg-chain-thor")}
            flex={1}
            justify="between"
          >
            <Text className="!text-white">Terms Of Service</Text>
            <Icon className="fill-white" name="rules" />
          </Box>
        </Link>
      </Box>
    </Modal>
  );
};
