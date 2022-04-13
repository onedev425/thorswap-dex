import classNames from 'classnames'
import {
  DISCORD_URL,
  THORSWAP_DOCUMENTATION_URL,
  THORSWAP_FEEDBACK_URL,
  THORSWAP_YOUTUBE_URL,
} from 'config/constants'

import { Box, Icon, Link, Modal, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  isOpen: boolean
  onCancel?: () => void
}

const commonClasses =
  'py-2.5 px-2.5 md:px-8 rounded-2xl gap-3 hover:bg-opacity-80 transition'

export const SupportModal = ({
  isOpen,
  onCancel = () => {},
}: Props): JSX.Element => {
  return (
    <Modal title={t('common.support')} isOpened={isOpen} onClose={onCancel}>
      <Box className="!w-[300px] md:!w-[350px] gap-3" col>
        <Typography>{t('components.sidebar.supportInfo')}</Typography>

        <Link to={DISCORD_URL}>
          <Box
            className={classNames(commonClasses, 'bg-discord-purple')}
            alignCenter
            justify="between"
          >
            <Typography className="!text-white">
              {t('components.sidebar.joinDiscord')}
            </Typography>
            <Icon name="discord" className="fill-white" />
          </Box>
        </Link>

        <Link to={THORSWAP_YOUTUBE_URL}>
          <Box
            className={classNames(commonClasses, 'bg-red')}
            alignCenter
            justify="between"
          >
            <Typography className="!text-white">
              {t('components.sidebar.thorswapCommunityYoutube')}
            </Typography>
            <Icon name="youtube" className="fill-white" />
          </Box>
        </Link>

        <Link to={THORSWAP_DOCUMENTATION_URL}>
          <Box
            className={classNames(commonClasses, 'bg-btn-primary')}
            alignCenter
            justify="between"
          >
            <Typography className="!text-white">
              {t('components.sidebar.thorswapDocumentation')}
            </Typography>
            <Icon name="docs" className="fill-white" />
          </Box>
        </Link>

        <Link to={THORSWAP_FEEDBACK_URL}>
          <Box
            className={classNames(commonClasses, 'bg-btn-secondary')}
            alignCenter
            justify="between"
          >
            <Typography className="!text-white">
              {t('components.sidebar.submitFeedback')}
            </Typography>
            <Icon name="feedback" className="fill-white" />
          </Box>
        </Link>
      </Box>
    </Modal>
  )
}
