import { Box } from '@chakra-ui/react';
import { FireParticle } from 'components/Fire/FireParticle';

type Props = {
  size?: number;
};

const particles = Array.from({ length: 30 }, (_, i) => i);

export const Fire = ({ size = 4 }: Props) => {
  return (
    <Box
      sx={{
        filter: `blur(0.02em)`,
        position: `relative`,
        width: size,
        height: size,
      }}
    >
      {particles.map((p) => (
        <FireParticle index={p} key={p} particlesCount={50} />
      ))}
    </Box>
  );
};
