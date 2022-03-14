import { Box, Typography } from 'components/Atomic'

import { getIntFromName, rainbowStop } from './utils'

type Props = {
  ticker: string
  size: number
}

export const FallbackIcon = ({ ticker, size }: Props) => {
  const tickerNums = getIntFromName(ticker)
  const fallbackBgImg = `linear-gradient(45deg, ${rainbowStop(
    tickerNums[0],
  )}, ${rainbowStop(tickerNums[1])})`

  return (
    <Box
      alignCenter
      justifyCenter
      className="rounded-full"
      width={size}
      height={size}
      style={{ background: fallbackBgImg }}
    >
      <Typography variant="caption-xs">{ticker}</Typography>
    </Box>
  )
}
