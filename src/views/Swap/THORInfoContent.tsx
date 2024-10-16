import { Text } from "@chakra-ui/react";
import { AssetValue } from "@swapkit/sdk";
import { Link } from "components/Atomic";
import { getSwapRoute } from "settings/router";

const THORInfoContent = ({ inputAsset }: { inputAsset: AssetValue }) => (
  <>
    <Text textStyle="caption" variant="yellow">
      {`Are you looking for THORSwap's protocol token `}
      <Link
        className="text-twitter-blue"
        to={getSwapRoute(inputAsset, AssetValue.fromChainOrSignature("ETH.THOR"))}
      >
        $THOR (Ethereum ERC-20)?
      </Link>
    </Text>
    <Text textStyle="caption-xs">&nbsp;</Text>
    <Text textStyle="caption" variant="yellow">
      {
        "You have selected $THOR token ticker on Avalanche C-Chain. Thor Financial is a different unaffiliated project based on the Avalanche network. "
      }
    </Text>
  </>
);

export default THORInfoContent;
