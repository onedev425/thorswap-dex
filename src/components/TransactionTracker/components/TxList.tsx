import { Flex, Text } from "@chakra-ui/react";
import { TxListItem } from "components/TransactionTracker/components/TxListItem";
import { useTransactionsState } from "store/transactions/hooks";

type Props = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export const TxList = ({ selectedId, onSelect }: Props) => {
  const { pending, completed, transactions } = useTransactionsState();

  if (!transactions.length)
    return (
      <Flex align="center" justify="center">
        <Text variant="secondary">No transactions to show</Text>
      </Flex>
    );

  return (
    <Flex
      direction="column"
      gap={1}
      minW="200px"
      overflowY="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "5px",
        },
        "::-webkit-scrollbar-thumb": {
          backgroundColor: "tintHoverPrimary",
          borderRadius: "5px",
        },
      }}
    >
      {pending
        .filter((item) => item.txid)
        .map((item) => (
          <TxListItem
            isSelected={!!item.txid && selectedId === item.txid}
            item={item}
            key={item.id}
            onClick={() => onSelect(item.txid || "")}
          />
        ))}
      {completed
        .filter((item) => item.txid)
        .map((item) => (
          <TxListItem
            isSelected={!!item.txid && selectedId === item.txid}
            item={item}
            key={item.id}
            onClick={() => onSelect(item.txid || "")}
          />
        ))}
    </Flex>
  );
};
