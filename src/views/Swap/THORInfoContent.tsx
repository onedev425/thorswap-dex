import { Asset } from '@thorswap-lib/multichain-core';
import { Link, Typography } from 'components/Atomic';
import { getSwapRoute } from 'settings/router';

const THORInfoContent = () => (
  <>
    <Typography color="yellow" variant="caption">
      {`Are you looking for THORSwap's protocol token $THOR?`}
    </Typography>
    <Typography variant="caption-xs">&nbsp;</Typography>
    <Typography color="yellow" variant="caption">
      {
        'You have selected $THOR token ticker on Avalanche C-Chain. Thor Financial is a different unaffiliated project based on the Avalanche network. '
      }
      <Link className="text-twitter-blue" to={getSwapRoute(Asset.THOR())}>
        $THOR (Ethereum ERC-20)
      </Link>
    </Typography>
  </>
);

export default THORInfoContent;
