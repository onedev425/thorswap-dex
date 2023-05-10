import { Flex, Image, Text } from '@chakra-ui/react';

import Plane from '../assets/airthor.png';
import Bg from '../assets/bg.png';
import Tokens from '../assets/tokens.png';

export const AirdropBanner = () => {
  return (
    <Flex direction="column" mt={5} w="full">
      <Text mb={2} mr={7} textStyle="h4">
        Celebrating THORSwap&apos;s two year anniversary!
      </Text>
      <Flex position="relative">
        <Image borderRadius={8} src={Bg} w="full" />
        <Image position="absolute" right={8} src={Tokens} top="30%" w="20%" />
        <Image position="absolute" right={0} src={Plane} top="-60%" w="40%" />

        <Flex
          direction="column"
          gap={[0, 0, 3]}
          height="full"
          justifyContent="center"
          ml={6}
          position="absolute"
          py={1}
          width="full"
        >
          <Text color="whiteAlpha.800">
            Connect your wallet to determine your airdrop eligibility
          </Text>
          {/* <a href="#TODO" target="_blank">
            <Button size="xs">Learn more</Button>
          </a> */}
        </Flex>
      </Flex>
    </Flex>
  );
};
