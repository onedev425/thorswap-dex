import { Flex } from "@chakra-ui/react";

export function LoanInfoRowCell({ children }: { children: React.ReactNode }) {
  return (
    <Flex align="start" direction="column" flex={1} gap={2} justify="center">
      {children}
    </Flex>
  );
}
