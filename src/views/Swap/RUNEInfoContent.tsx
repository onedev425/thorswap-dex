import { Text } from '@chakra-ui/react';
import { Asset } from '@thorswap-lib/multichain-core';
import { Link } from 'components/Atomic';
import { getSwapRoute } from 'settings/router';

const RUNEInfoContent = ({ inputAsset }: { inputAsset: Asset }) => (
  <>
    <Text textStyle="caption" variant="yellow">
      {`Are you looking for native token `}
      <Link className="text-twitter-blue" to={getSwapRoute(inputAsset, Asset.RUNE())}>
        $RUNE?
      </Link>
    </Text>
    <Text textStyle="caption-xs">&nbsp;</Text>
    <Text textStyle="caption" variant="yellow">
      You have selected $RUNE token ticker on Ethereum chain. RUNE token on Ethereum chain is a
      deprecated token. Please make sure you are swapping the correct token.
    </Text>
  </>
);

export default RUNEInfoContent;
