import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

const WalletBalance = () => {
  return (
    <div>
      <Box alignCenter className="justify-between pb-6 px-[40px]">
        <Button
          className="px-3.5 hidden cursor-auto md:flex hover:bg-transparent dark:hover:bg-transparent"
          type="outline"
          variant="tint"
          startIcon={
            <Icon
              name="refresh"
              color="primaryBtn"
              size={18}
              onClick={() => {}}
            />
          }
        />
        <Typography> {t('views.walletDrawer.openWalletPage')}</Typography>
      </Box>
      <Box
        alignCenter
        className="justify-between px-[40px] md:flex-row gap-4"
        col
      >
        <Button
          variant="tertiary"
          textColor="secondary"
          type="outline"
          onClick={() => {}}
        >
          {t('views.walletDrawer.disconnectAll')}
        </Button>
        <Button type="outline" onClick={() => {}}>
          {t('views.walletDrawer.connectAnotherWallet')}
        </Button>
      </Box>
      <ul className="list-none p-0">
        {balanceData.map((item) => (
          <li
            key={item.address}
            className="px-[40px] min-h-[155px] bg-gradient-primary-light dark:bg-gradient-primary-dark rounded-b-[24px]"
          >
            <Box className="border-0 border-b-2 border-dashed border-bottom border-light-typo-gray dark:border-dark-typo-gray justify-between py-6">
              <Box>
                <Icon
                  name="refresh"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
                <Typography color="secondary" className="ml-2">
                  {item.asset.name}
                </Typography>
              </Box>
              <Box>
                <Typography color="primary" className="ml-8 mr-2 truncate">
                  {item.address}
                </Typography>
                <Icon
                  className="mr-2"
                  name="squares"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
                <Icon
                  className="mr-2"
                  name="app"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
                <Icon
                  name="share"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
              </Box>
            </Box>
            <Box className="border-0 border-b-2 border-dashed border-bottom border-light-typo-gray dark:border-dark-typo-gray justify-between py-6">
              <Box>
                <Icon
                  name="refresh"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
                <Typography color="secondary" className="ml-2">
                  {item.asset.name}
                </Typography>
              </Box>
              <Box>
                <Typography color="primary" className="ml-8 mr-2 truncate">
                  {item.address}
                </Typography>
                <Icon
                  className="mr-2"
                  name="squares"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
                <Icon
                  className="mr-2"
                  name="app"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
                <Icon
                  name="share"
                  color="secondary"
                  size={18}
                  onClick={() => {}}
                />
              </Box>
            </Box>
            <Box alignCenter className="justify-between py-4">
              <Box>
                <AssetIcon name={item.asset.name as Inexpressible} />
                <div className="flex flex-col flex-1 ml-2">
                  <Typography>{'BTC'}</Typography>
                  <Typography color="secondary">{'Native'}</Typography>
                </div>
              </Box>
              <Box>
                <Typography color="primary" className="ml-2">
                  {0}
                </Typography>
              </Box>
              <Box>
                <Button
                  className="px-3.5"
                  type="outline"
                  onClick={() => {}}
                  startIcon={<Icon name="send" size={18} onClick={() => {}} />}
                />
              </Box>
            </Box>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WalletBalance

const balanceData = [
  {
    asset: { name: 'BTC', icon: 'bitcoin', iconColor: 'yellow' },
    address: '3f4njkncevw3nsdD0AD0E0ACD',
  },
  {
    asset: { name: 'THOR', icon: 'thorchain', iconColor: 'purple' },
    address: '3f4njknceaw3nsdD0AD0E0A6D',
  },
  {
    asset: { name: 'ETH', icon: 'ethereum', iconColor: 'purple' },
    address: '3f4njkncew3nsdD0AD0E69vCD',
  },
  {
    asset: { name: 'BTC', icon: 'bitcoin', iconColor: 'yellow' },
    address: '3f4njkncew3nsdD0vAD0A69CD',
  },
  {
    asset: { name: 'THOR', icon: 'thorchain', iconColor: 'purple' },
    address: '3f4njknceaw3nsdD0AD0A69CD',
  },
  {
    asset: { name: 'ETH', icon: 'ethereum', iconColor: 'purple' },
    address: '3f4najkncew3nsdD0AD0E69CD',
  },
]
