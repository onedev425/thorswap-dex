import { Text } from '@chakra-ui/react';
import { encodeSecp256k1Pubkey, pubkeyToAddress } from '@cosmjs/amino';
import { base64 } from '@swapkit/toolbox-cosmos';
import classNames from 'classnames';
import { Box, Icon } from 'components/Atomic';
import {
  borderHighlightClass,
  borderHoverHighlightClass,
  genericBgClasses,
} from 'components/constants';
import type { MultisigMember } from 'store/multisig/types';

type Props = {
  signer: MultisigMember;
  onClick?: (signer: MultisigMember) => void;
  isSelected: boolean;
};

export const SignerCheckBox = ({ signer, onClick, isSelected }: Props) => {
  return (
    <Box
      center
      className={classNames('gap-2', { 'cursor-pointer': !!onClick })}
      flex={1}
      key={signer.pubKey}
      onClick={() => onClick?.(signer)}
    >
      <Box
        alignCenter
        className={classNames(
          'truncate overflow-hidden flex-1 rounded-2xl px-4 py-2 gap-2',
          genericBgClasses.secondary,
          {
            [borderHighlightClass]: isSelected,
            [borderHoverHighlightClass]: !!onClick || isSelected,
          },
        )}
      >
        <Icon
          color={isSelected ? 'primaryBtn' : 'secondary'}
          name={isSelected ? 'checkBoxChecked' : 'checkBoxBlank'}
          size={20}
        />
        <Box col className="gap-1">
          <div className="flex justify-between">
            <Text textStyle="caption-xs" variant="secondary">
              {signer.name}
              <br />
              {pubkeyToAddress(encodeSecp256k1Pubkey(base64.decode(signer.pubKey)), 'thor')}
            </Text>
          </div>
          <Text className="break-all whitespace-normal" textStyle="caption-xs">
            {signer.pubKey}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
