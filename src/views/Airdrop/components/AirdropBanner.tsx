import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { t } from 'services/i18n';

import Plane from '../assets/airthor.png';
import Bg from '../assets/bg.png';
import Tokens from '../assets/tokens.png';

export const AirdropBanner = () => {
  return (
    <Flex direction="column" mt={5} w="full">
      <Text mb={2} mr={7} textStyle="h4">
        {t('views.airdrop.bannerTitle')}
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
          <Text color="whiteAlpha.800">{t('views.airdrop.bannerMessage')}</Text>
          <a
            href="https://medium.com/@thorswap/2nd-anniversary-airdrop-cf9a7c53188f"
            rel="noreferrer"
            target="_blank"
          >
            <Button size="xs">Learn more</Button>
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
};
