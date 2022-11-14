/* eslint-disable react/no-unescaped-entities */
import { Asset } from '@thorswap-lib/multichain-core';
import { Link } from 'components/Atomic';
import { getSwapRoute } from 'settings/router';

const THORInfoContent = () => {
  return (
    <>
      Are you looking for THORSwap's protocol token $THOR You have selected $THOR token ticker on
      Avalanche C-Chain. Thor Financial is a different unaffiliated project based on the Avalanche
      network.
      <Link className="text-twitter-blue" to={getSwapRoute(Asset.THOR())}>
        $THOR (Ethereum ERC-20)
      </Link>
    </>
  );
};

export default THORInfoContent;
