import { Box, Button } from "components/Atomic";

type Props = {
  options: number[];
  onSelect: (val: number) => void;
};

export const PercentSelect = ({ options, onSelect }: Props) => {
  if (!options.length) return null;

  return (
    <Box className="gap-2 flex-1">
      {options.map((o) => (
        <Button stretch className="h-[35px]" key={o} onClick={() => onSelect(o)} variant="tint">
          {o}%
        </Button>
      ))}
    </Box>
  );
};
