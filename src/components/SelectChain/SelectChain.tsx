import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { Modal } from 'components/Modal'
import { SelectChainProps } from 'components/SelectChain/types'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

export const SelectChain = ({
  isOpened,
  handleClose,
  chainList,
  handleChainSelected,
  handleConnnect,
}: SelectChainProps) => {
  return (
    <Modal title="Select Chain" isOpened={isOpened} onClose={handleClose}>
      <Box className="flex-1 gap-2" col>
        {chainList.map(({ isConnected, name }) => (
          <Card
            className={classNames(
              'border-solid border-2 flex flex-row items-center gap-32 cursor-pointer hover:opacity-80 bg-light-gray-light dark:bg-dark-gray-light !rounded-3xl',
              isConnected
                ? 'border-light-btn-primary dark:border-dark-btn-primary'
                : 'border-transparent',
            )}
            onClick={() => handleChainSelected(name)}
            key={name}
          >
            <Box className="flex-1 gap-2">
              <AssetIcon name={name} />
              <Box className="flex-1" col>
                <Typography>{name}</Typography>
                <Typography color="secondary">
                  {t('common.notConnected')}
                </Typography>
              </Box>
            </Box>
            <div>{isConnected && <Icon name={'tick'} />}</div>
          </Card>
        ))}
        <Box mt={30} justify="around">
          <Button size="large" outline onClick={() => handleConnnect()}>
            {t('common.connect')}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
