import { t } from 'services/i18n';

export const calculateAverage = (array?: number[]) => {
  if (!array) return;
  let sum = 0;
  let count = 0;

  for (const num of array) {
    sum += num;
    count++;
  }

  const average = sum / count;
  return average;
};

export const gasState = (array?: number[], estimatedAverage?: number) => {
  const averageValue = estimatedAverage || calculateAverage(array);
  if (!averageValue || !array) return;
  const latestGasValue = array[array?.length - 1];

  if (latestGasValue < averageValue * 0.85) {
    return { color: 'green', state: t('views.swap.low') };
  } else if (latestGasValue > averageValue * 1.15) {
    return { color: 'red', state: t('views.swap.high') };
  } else {
    return { color: 'yellow', state: t('views.swap.average') };
  }
};
