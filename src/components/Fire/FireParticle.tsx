import { Box, keyframes } from "@chakra-ui/react";
import { useMemo } from "react";

type Props = { index: number; size?: number; particlesCount: number };

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(0) scale(1);
  }
  25% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(-30px) scale(0);
  }
`;

const fireColor = "rgb(255, 80, 0)";
const fireColorT = "rgba(255, 80, 0, 0)";

export const FireParticle = ({ index, size = 5, particlesCount }: Props) => {
  const delay = useMemo(() => Math.random(), []);

  return (
    <Box
      animation={`${rise} 1s ease-in infinite`}
      sx={{
        borderRadius: "50%",
        mixBlendMode: "screen",
        opacity: 0,
        position: "absolute",
        bottom: 0,
        width: size,
        height: size,
        backgroundImage: `radial-gradient(${fireColor} 20%,${fireColorT} 70%)`,
        animationDelay: `${delay}s`,
        left: `calc((100% - ${size}px) * ${(index - 1) / particlesCount})`,
      }}
    />
  );
};
