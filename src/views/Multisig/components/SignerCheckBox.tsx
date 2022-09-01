import classNames from 'classnames';
import { Box, Icon, Typography } from 'components/Atomic';
import {
  borderHighlightClass,
  borderHoverHighlightClass,
  genericBgClasses,
} from 'components/constants';
import { MultisigMember } from 'store/multisig/types';

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
            <Typography color="secondary" variant="caption-xs">
              {signer.name}
            </Typography>
          </div>
          <Typography className="break-all whitespace-normal" variant="caption-xs">
            {signer.pubKey}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
