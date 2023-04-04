import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Link } from 'components/Atomic';
import { RUNEAsset } from 'helpers/assets';
import { getSwapRoute } from 'settings/router';

const RUNEInfoContent = ({ inputAsset }: { inputAsset: AssetEntity }) => (
  <>
    <Text textStyle="caption" variant="yellow">
      {`Are you looking for native token `}
      <Link className="text-twitter-blue" to={getSwapRoute(inputAsset, RUNEAsset)}>
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
