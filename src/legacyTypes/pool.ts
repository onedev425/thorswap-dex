import { AssetValue, SwapKitNumber } from "@swapkit/sdk";

export interface PoolDetail {
  annualPercentageRate: string;
  asset: string;
  assetDepth: string;
  assetPrice: string;
  assetPriceUSD: string;
  liquidityUnits: string;
  loanCollateral: string;
  poolAPY: string;
  runeDepth: string;
  status: string;
  synthSupply: string;
  synthUnits: string;
  units: string;
  volume24h: string;
  saversAPR: string;
  saversDepth: string;
  saversUnits: string;
}

export class Pool {
  public readonly asset: AssetValue;
  public readonly runeDepth: SwapKitNumber;
  public readonly assetDepth: SwapKitNumber;
  public readonly assetUSDPrice: SwapKitNumber;
  public readonly detail: PoolDetail;

  public static fromPoolData(poolDetail: PoolDetail) {
    const { asset, runeDepth, assetDepth } = poolDetail;
    const assetObj = AssetValue.fromStringSync(asset);

    if (assetObj && runeDepth && assetDepth) {
      const runeAmount = SwapKitNumber.fromBigInt(BigInt(runeDepth), 8);
      const assetAmount = SwapKitNumber.fromBigInt(BigInt(assetDepth), 8);

      return new Pool(assetObj, runeAmount, assetAmount, poolDetail);
    }

    return null;
  }

  constructor(
    asset: AssetValue,
    runeDepth: SwapKitNumber,
    assetDepth: SwapKitNumber,
    detail: PoolDetail,
  ) {
    this.asset = asset;
    this.runeDepth = runeDepth;
    this.assetDepth = assetDepth;
    this.detail = detail;

    this.assetUSDPrice = new SwapKitNumber({ value: detail.assetPriceUSD, decimal: 8 });
  }

  get assetPriceInRune() {
    return this.runeDepth.div(this.assetDepth);
  }

  get runePriceInAsset() {
    return this.assetDepth.div(this.runeDepth);
  }
}
