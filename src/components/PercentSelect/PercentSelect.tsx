import { Box, Button } from 'components/Atomic'

type Props = {
  options: number[]
  onSelect: (val: number) => void
}

export const PercentSelect = ({ options, onSelect }: Props) => {
  if (!options.length) {
    return null
  }

  return (
    <Box className="gap-2 flex-1">
      {options.map((o) => (
        <Button
          className="h-[35px]"
          key={`${o}`}
          variant="tint"
          stretch
          onClick={() => onSelect(o)}
        >
          {o}%
        </Button>
      ))}
    </Box>
  )
}
