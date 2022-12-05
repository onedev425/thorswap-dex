import { Asset } from '@thorswap-lib/multichain-core';
import { Link, Typography } from 'components/Atomic';
import { getSwapRoute } from 'settings/router';

const RUNEInfoContent = ({ inputAsset }: { inputAsset: Asset }) => (
  <>
    <Typography color="yellow" variant="caption">
      {`Are you looking for native token `}
      <Link className="text-twitter-blue" to={getSwapRoute(inputAsset, Asset.RUNE())}>
        $RUNE?
      </Link>
    </Typography>
    <Typography variant="caption-xs">&nbsp;</Typography>
    <Typography color="yellow" variant="caption">
      You have selected $RUNE token ticker on Ethereum chain. RUNE token on Ethereum chain is a
      deprecated token. Please make sure you are swapping the correct token.
    </Typography>
  </>
);

export default RUNEInfoContent;
