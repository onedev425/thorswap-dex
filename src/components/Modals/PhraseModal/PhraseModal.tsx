import classNames from 'classnames'

import { Box, Button, Modal, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { Input } from 'components/Input'
import { usePhraseModal } from 'components/Modals/PhraseModal/usePhraseModal'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

export type PhraseModalProps = {
  isOpen: boolean
  onCancel?: () => void
}

export const PhraseModal = ({
  isOpen,
  onCancel = () => {},
}: PhraseModalProps): JSX.Element => {
  const { showPhrase, submit, passwordField, errors } = usePhraseModal(isOpen)
  const phrases = multichain.getPhrase().split(' ')

  return (
    <Modal
      title={t('components.modal.keystore.phrase')}
      isOpened={isOpen}
      onClose={onCancel}
    >
      <Box>
        {showPhrase ? (
          <Box
            className={classNames(
              'grid p-2.5 rounded-2xl grid-cols-4',
              genericBgClasses.primary,
            )}
          >
            {phrases.map((phrase: string, index: number) => {
              return (
                <Box className="p-1.5" key={phrase} alignCenter>
                  <Typography>
                    {index + 1}. {phrase}
                  </Typography>
                </Box>
              )
            })}
          </Box>
        ) : (
          <Box flexDirection="column" minWidth={250}>
            <Input
              type="password"
              placeholder={t('common.password')}
              autoComplete="new-password"
              stretch
              autoFocus
              className="!text-md p-1.5 flex-1 border"
              containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
              border="rounded"
              {...passwordField}
            />
            {errors.password && (
              <Box>
                <Typography color="red">
                  {t('components.modal.keystore.wrongPassword')}
                </Typography>
              </Box>
            )}
            <Box justifyCenter mt={4}>
              <Button onClick={submit}>
                {t('components.modal.keystore.viewPhrase')}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  )
}
