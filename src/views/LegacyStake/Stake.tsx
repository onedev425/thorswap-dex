import { Box } from "components/Atomic";
import { Helmet } from "components/Helmet";
import { t } from "services/i18n";

import { StakingCard } from "./StakingCard";
import { ThorchainLPCard } from "./ThorchainLPCard";
import { farmData } from "./farmData";

const Stake = () => {
  return (
    <div className="container mx-auto">
      <Helmet content={t("common.staking")} title={t("common.staking")} />
      <Box className="gap-2.5 flex-wrap justify-center">
        {farmData.map(
          ({ lpToken, lpAsset, ...rest }) =>
            lpToken &&
            lpAsset && (
              <StakingCard {...rest} key={lpToken} lpAsset={lpAsset} stakingToken={lpToken} />
            ),
        )}

        <ThorchainLPCard />
      </Box>
    </div>
  );
};

export default Stake;
