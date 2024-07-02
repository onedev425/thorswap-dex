import { Flex, Text, chakra, shouldForwardProp } from "@chakra-ui/react";
import { Tooltip } from "components/Atomic/Tooltip";
import { isValidMotionProp, motion } from "framer-motion";
import { useState } from "react";

import EggBottom from "./assets/egg-lrg-bottom.png";
import EggTop from "./assets/egg-lrg-top.png";

const Box = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

type Props = {
  onOpen?: () => void;
};

const ratio = 352 / 500;
const height = 60;
const width = height * ratio;

const wiggle = [0, 10, -10, 5, -15, 2, 0, -2];
const wiggleFast = [0, 5, -5, 5, -5, 5, -5, -5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, -5, 0];

export const Egg = ({ onOpen }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (!onOpen) {
      return;
    }

    if (open) {
      onOpen?.();
    } else {
      setOpen(true);
    }
  };

  const handleAnimationComplete = () => {
    if (open) {
      setTimeout(() => onOpen?.(), 700);
    }
  };

  return (
    <Flex>
      <Tooltip content={open ? "" : "?!"}>
        <Box
          animate={{
            rotate: open ? wiggleFast : wiggle,
            transition: {
              duration: open ? 1.5 : 3,
              ease: "easeInOut",
              repeat: open ? 0 : Number.POSITIVE_INFINITY,
              repeatType: "loop",
            },
          }}
          cursor={onOpen ? "pointer" : "default"}
          height={`${height}px`}
          onClick={handleOpen}
          position="relative"
          transformOrigin="bottom"
          width={width}
        >
          <Box
            animate={
              open
                ? {
                    rotate: -10,
                    scale: [0.2, 1],
                    translateY: [20, -10],
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: 1.3,
                    },
                  }
                : { rotate: -20, translateY: 20, scale: 0.2 }
            }
            onAnimationComplete={handleAnimationComplete}
            position="absolute"
            textAlign="center"
            top={0}
          >
            <Text variant="green">Happy</Text>
            <Text variant="yellow">Easter!</Text>
          </Box>
          <Box
            animate={
              open
                ? {
                    rotate: -130,
                    translateX: -10,
                    translateY: 20,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                      delay: 1.3,
                    },
                  }
                : {}
            }
            animation={open ? "open" : "stop"}
            bottom={0}
            left={0}
            position="absolute"
            right={0}
            top={0}
            transformOrigin="left"
          >
            <img alt="Egg Top" src={EggTop} />
          </Box>
          <Box bottom={0} left={0} position="absolute" right={0} top={0}>
            <img alt="Egg Bottom" src={EggBottom} />
          </Box>
        </Box>
      </Tooltip>
    </Flex>
  );
};
