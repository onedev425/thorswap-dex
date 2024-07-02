import { t } from "services/i18n";

export enum VestingType {
  THOR = "THOR",
  VTHOR = "VTHOR",
}

export const vestingTabs = [
  {
    label: t("views.vesting.vestingThor"),
    value: VestingType.THOR,
  },
  {
    label: t("views.vesting.vestingVthor"),
    value: VestingType.VTHOR,
  },
];

export const vestingAddr = {
  [VestingType.THOR]: "0xa5f2211B9b8170F694421f2046281775E8468044",
  [VestingType.VTHOR]: "0x815C23eCA83261b6Ec689b60Cc4a58b54BC24D8D",
};
