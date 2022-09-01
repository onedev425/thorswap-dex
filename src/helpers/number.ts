export const abbreviateNumber = (value: number, decimal = 0): string => {
  let newValue = value;
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Q', 's'];
  let suffixNum = 0;

  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  const suffix = suffixNum > 0 ? ` ${suffixes[suffixNum]}` : '';
  return `${newValue.toFixed(decimal)}${suffix}`;
};

export const toOptionalFixed = (num: number, decimal = 2): string => {
  const maskStr = Array(decimal + 1).join('0');
  const regex = new RegExp(`[.,]${maskStr}$`); // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp

  return num.toFixed(decimal).replace(regex, '');
};
