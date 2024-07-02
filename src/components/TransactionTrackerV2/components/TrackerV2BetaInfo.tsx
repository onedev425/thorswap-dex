import { Badge, Flex, Text } from "@chakra-ui/react";
import { Button, Icon } from "components/Atomic";
import { InfoRow } from "components/InfoRow";

export const TrackerV2BetaInfo = ({ explorerUrl }: { explorerUrl?: string }) => {
  return (
    <>
      <InfoRow
        label={
          <Flex>
            <Badge background="brand.btnSecondary">BETA</Badge>
            <Text ml={2} textStyle="caption" variant="secondary">
              Tracker beta version
            </Text>
          </Flex>
        }
        size="md"
        value=""
      />
      {!!explorerUrl && (
        <InfoRow
          label="External explorer"
          size="md"
          value={
            <a href={explorerUrl} rel="noreferrer" target="_blank">
              <Button
                className="!px-2 h-auto"
                rightIcon={<Icon color="primaryBtn" name="external" size={14} />}
                size="xs"
                variant="borderlessTint"
              >
                Chainflip explorer
              </Button>
            </a>
          }
        />
      )}
    </>
  );
};
