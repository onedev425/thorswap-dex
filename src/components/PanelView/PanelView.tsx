import { Flex } from "@chakra-ui/react";
import { Box, Card } from "components/Atomic";
import { Helmet } from "components/Helmet";
import { easeInOutTransition } from "components/constants";
import type { ReactNode } from "react";
import { memo } from "react";

export type Props = {
  title: string;
  header: ReactNode;
  children: ReactNode;
  description?: string;
  keywords?: string;
};

export const PanelView = memo(({ title, description, keywords, header, children }: Props) => {
  return (
    <Flex alignSelf="center" mt={2} w="full">
      <Flex flex={1} justify="center" transition={easeInOutTransition}>
        <Box col className="self-stretch w-full max-w-[480px]">
          <Helmet content={description || title} keywords={keywords} title={title} />

          <Box col className="w-full mx-2">
            {header}
          </Box>

          <Card
            stretch
            className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:h-auto"
            size="lg"
          >
            {children}
          </Card>
        </Box>
      </Flex>
    </Flex>
  );
});
