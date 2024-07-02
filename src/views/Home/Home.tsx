import { Box } from "components/Atomic";
import { Helmet } from "components/Helmet";
import { t } from "services/i18n";

import { GlobalChart } from "./GlobalChart";
import { GlobalStats } from "./GlobalStats";
import { PoolListView } from "./PoolListView";

const Home = () => {
  return (
    <Box col>
      <Helmet
        content={t("views.home.description")}
        keywords="Liquidity, Pools, THORChain, THORSwap, DEFI, DEX"
        title={t("views.home.title")}
      />

      <Box col className="pt-2">
        <div className="pb-4">
          <GlobalStats />
        </div>

        <GlobalChart />
        <PoolListView />
      </Box>
    </Box>
  );
};

export default Home;
