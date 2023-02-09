import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Icon } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { cardFontColors, CardStyleType } from 'components/HighlightCard/types';
import { ReactNode } from 'react';

type Props = {
  className?: string;
  title?: string;
  content?: string | ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  type?: CardStyleType;
  contentClassName?: string;
};

const icons: Record<CardStyleType, ReactNode> = {
  primary: <Icon name="bulb" size={20} />,
  warn: <Icon color="yellow" name="warn" size={20} />,
  info: <Icon color="primaryBtn" name="infoCircle" size={20} />,
  success: <Icon color="green" name="infoCircle" size={20} />,
};

export const InfoTip = ({
  className,
  children,
  title,
  content,
  type = 'primary',
  onClose,
  contentClassName,
}: Props) => {
  return (
    <HighlightCard
      className={classNames(
        'self-stretch items-center !px-2 !pb-2',
        title || onClose ? '!pt-4' : '!pt-2',
        className,
      )}
      type={type}
    >
      {(!!title || !!onClose) && (
        <Box alignCenter className="self-stretch px-2" justify="between">
          {!!title && (
            <Box>
              {icons[type]}

              <Text className="mx-2">{title}</Text>
            </Box>
          )}

          {onClose && (
            <Icon className="ml-auto" color="secondary" name="close" onClick={onClose} size={20} />
          )}
        </Box>
      )}

      {children || (
        <Text
          className={classNames('px-2 py-2 brightness-90', contentClassName)}
          fontWeight="semibold"
          textStyle="caption"
          variant={cardFontColors[type]}
        >
          {content}
        </Text>
      )}
    </HighlightCard>
  );
};
