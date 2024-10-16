import { t } from "services/i18n";

export const calculateAverage = (array?: number[]) => {
  if (!array) return;
  const mean = array.reduce((sum, value) => sum + value, 0) / array.length;
  return mean;
};

export const gasState = (array?: number[], estimatedAverage?: number) => {
  const averageValue = estimatedAverage || calculateAverage(array);
  if (!(averageValue && array)) return;
  const latestGasValue = array[array?.length - 1];

  if (latestGasValue < averageValue * 0.85) {
    return { color: "green", state: t("views.swap.low") };
  }
  if (latestGasValue > averageValue * 1.15) {
    return { color: "red", state: t("views.swap.high") };
  }
  return { color: "yellow", state: t("views.swap.average") };
};
