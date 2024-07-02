import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";

import theme from "../../theme/index";

type Props = {
  children: ReactNode;
};

export const ChakraThemeProvider = ({ children }: Props) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
