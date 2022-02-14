export const shortenAddress = (address: string | any[]) =>
  `${address.slice(0, 3)}...${address.slice(address.length - 3)}`
