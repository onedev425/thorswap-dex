import {
  Modal as CustomModal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SystemStyleObject,
  Text,
} from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Card, Icon } from 'components/Atomic';
import { ReactNode } from 'react';

type Props = {
  HeaderComponent?: ReactNode;
  isOpened: boolean;
  title: string;
  children: ReactNode;
  withBody?: boolean;
  onBack?: () => void;
  onClose: () => void;
  className?: string;
  sx?: SystemStyleObject;
};

export const Modal = ({
  HeaderComponent,
  title,
  isOpened,
  withBody = true,
  onBack,
  onClose,
  children,
  className,
  sx,
}: Props) => {
  return (
    <CustomModal isCentered isOpen={isOpened} onClose={onClose} size="md">
      <ModalOverlay className="fixed inset-0 backdrop-blur-xl backdrop-brightness-90 dark:backdrop-brightness-50" />

      <ModalContent bg="none" boxShadow="none" className={className} m="auto" sx={sx}>
        <ModalBody className="flex justify-center mx-3 md:mx-0 max-h-[85vh] flex-col" p={0}>
          <Box col>
            {HeaderComponent}
            <Box alignCenter row className="lg:m-5 mb-3 mx-5" justify="between">
              <Box alignCenter row>
                {onBack && (
                  <Icon
                    className="mr-2 text-light-typo-primary dark:text-dark-typo-primary"
                    name="arrowBack"
                    onClick={onBack}
                  />
                )}
                <Text className="text-dark-typo-primary" textStyle="h3">
                  {title}
                </Text>
              </Box>

              <Box
                center
                className={classNames(
                  'h-10 w-10 rounded-2xl self-center border border-solid cursor-pointer hover:brightness-90 dark:hover:brightness-110',
                  'border-dark-typo-primary dark:border-dark-typo-primary',
                )}
                onClick={onClose}
              >
                <Icon className="self-center" color="light" name="close" size={24} />
              </Box>
            </Box>
          </Box>

          {withBody ? (
            <Card stretch className="flex items-center justify-center" size="lg">
              {children}
            </Card>
          ) : (
            children
          )}
        </ModalBody>
      </ModalContent>
    </CustomModal>
  );
};
