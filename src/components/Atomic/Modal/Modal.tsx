import { Modal as CustomModal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Card, Icon, Typography } from 'components/Atomic';
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
}: Props) => {
  return (
    <CustomModal isCentered isOpen={isOpened} onClose={onClose} size="md">
      <ModalOverlay className="fixed inset-0 backdrop-blur-xl backdrop-brightness-90 dark:backdrop-brightness-50" />

      <ModalContent bg="none" boxShadow="none" className={className} m="auto">
        <ModalBody className="flex justify-center max-h-[85vh] mt-3 lg:mt-0 flex-col" p={0}>
          <Box col>
            {HeaderComponent}
            <Box alignCenter row className="lg:m-5 mx-5" justify="between">
              <Box alignCenter row>
                {onBack && (
                  <Icon
                    className="mr-2 text-light-typo-primary dark:text-dark-typo-primary"
                    name="arrowBack"
                    onClick={onBack}
                  />
                )}
                <Typography variant="h3">{title}</Typography>
              </Box>

              <Box
                center
                className={classNames(
                  'h-10 w-10 rounded-2xl self-center border border-solid cursor-pointer hover:brightness-90 dark:hover:brightness-110',
                  'border-light-typo-primary dark:border-dark-typo-primary',
                )}
                onClick={onClose}
              >
                <Icon className="self-center" color="primary" name="close" size={24} />
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
