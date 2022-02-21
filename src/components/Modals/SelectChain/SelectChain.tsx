import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { AssetTickerType } from 'components/AssetIcon/types'
import { Card, Box, Typography, Button, Modal, Icon } from 'components/Atomic'
import { ChainListType } from 'components/Modals'

import { t } from 'services/i18n'

type SelectChainProps = {
  isOpened: boolean
  handleClose: () => void
  chainList: ChainListType[]
  handleChainSelected: (chain: AssetTickerType) => void
  handleConnect: () => void
}

export const SelectChain = ({
  isOpened,
  handleClose,
  chainList,
  handleChainSelected,
  handleConnect,
}: SelectChainProps) => {
  return (
    <Modal title="Select Chain" isOpened={isOpened} onClose={handleClose}>
      <Box className="flex-1 gap-2" col>
        {chainList.map(({ isConnected, name }) => (
          <Card
            className={classNames(
              'border-solid border-2 flex flex-row items-center gap-32 cursor-pointer hover:opacity-80 bg-light-gray-light dark:bg-dark-gray-light !rounded-3xl',
              isConnected
                ? 'border-btn-primary dark:border-btn-primary'
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
            <div>{isConnected && <Icon name="tick" />}</div>
          </Card>
        ))}
        <Box mt={30} justify="around">
          <Button type="outline" onClick={() => handleConnect()}>
            {t('common.connect')}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
