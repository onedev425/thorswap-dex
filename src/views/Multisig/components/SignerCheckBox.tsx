import classNames from 'classnames'

import { Box, Icon, Typography } from 'components/Atomic'
import {
  borderHighlightClass,
  borderHoverHighlightClass,
  genericBgClasses,
} from 'components/constants'

import { MultisigMember } from 'store/multisig/types'

type Props = {
  signer: MultisigMember
  onClick?: (signer: MultisigMember) => void
  isSelected: boolean
}

export const SignerCheckBox = ({ signer, onClick, isSelected }: Props) => {
  return (
    <Box
      key={signer.pubKey}
      className={classNames('gap-2', { 'cursor-pointer': !!onClick })}
      flex={1}
      center
      onClick={() => onClick?.(signer)}
    >
      <Box
        className={classNames(
          'truncate overflow-hidden flex-1 rounded-2xl px-4 py-2 gap-2',
          genericBgClasses.secondary,
          {
            [borderHighlightClass]: isSelected,
            [borderHoverHighlightClass]: !!onClick || isSelected,
          },
        )}
        alignCenter
      >
        <Icon
          name={isSelected ? 'checkBoxChecked' : 'checkBoxBlank'}
          color={isSelected ? 'primaryBtn' : 'secondary'}
          size={20}
        />
        <Box className="gap-1" col>
          <div className="flex justify-between">
            <Typography variant="caption-xs" color="secondary">
              {signer.name}
            </Typography>
          </div>
          <Typography
            className="break-all whitespace-normal"
            variant="caption-xs"
          >
            {signer.pubKey}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
