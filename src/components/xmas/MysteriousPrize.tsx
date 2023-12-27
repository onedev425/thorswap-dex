import { chakra, Flex, shouldForwardProp, Text } from '@chakra-ui/react';
import { Tooltip } from 'components/Atomic/Tooltip';
import { isValidMotionProp, motion } from 'framer-motion';
import { useCallback, useState } from 'react';

import NewYearImg from './2024.png';
import CandycaneImg from './candycane.png';

const isNewYear = true;

const PrizeImg = isNewYear ? NewYearImg : CandycaneImg;

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

export const MysteriousPrize = ({ onOpen }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    if (!onOpen) return;

    if (open) {
      onOpen?.();
    } else {
      setOpen(true);
    }
  }, [onOpen, open]);

  const handleAnimationComplete = useCallback(() => {
    if (open) {
      setTimeout(() => onOpen?.(), 700);
    }
  }, [onOpen, open]);

  return (
    <Flex>
      <Tooltip content={open ? '' : '?!'}>
        <Box
          animate={{
            rotate: open ? wiggleFast : wiggle,
            transition: {
              duration: open ? 1.5 : 3,
              ease: 'easeInOut',
              repeat: open ? 0 : Infinity,
              repeatType: 'loop',
            },
          }}
          cursor={onOpen ? 'pointer' : 'default'}
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
                    rotate: -20,
                    scale: [0, 2],
                    translateY: [-45],
                    translateX: [20, 135],
                    transition: { duration: 0.3, ease: 'easeInOut', delay: 1 },
                  }
                : { scale: 0 }
            }
            onAnimationComplete={handleAnimationComplete}
            position="absolute"
            textAlign="center"
            top={0}
          >
            <Text variant="green">Happy</Text>
            <Text variant="yellow">2024!</Text>
          </Box>
          <Box
            animate={
              open
                ? { scale: [1.8, 2.5], transition: { duration: 0.3, ease: 'easeInOut', delay: 1 } }
                : { scale: 1.8 }
            }
            animation={open ? 'open' : 'stop'}
            bottom={0}
            left={0}
            position="absolute"
            right={0}
            top={0}
            transformOrigin="left"
          >
            <img alt="Candycane" src={PrizeImg} />
          </Box>
        </Box>
      </Tooltip>
    </Flex>
  );
};
