export const shortenAddress = (
  address: string[] | string,
  bothOrLeftLength = 3,
  rightLength?: number,
) =>
  `${address.slice(0, bothOrLeftLength)}...${address.slice(
    Math.max(address.length - (rightLength || bothOrLeftLength), 0),
  )}`;
