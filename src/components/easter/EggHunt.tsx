import {
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from '@chakra-ui/react';
import { Button } from 'components/Atomic';
import { Egg } from 'components/easter/Egg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useHuntEggMutation, useValidateEggQuery } from 'store/swapKitDashboard/api';

const domain = window.location.origin;
export const EggHunt = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const urlToValidate = useMemo(() => {
    const isTx = location.pathname.includes('/tx');

    return isTx ? `${domain}/tx` : `${domain}${location.pathname}`;
  }, [location.pathname]);

  const { data } = useValidateEggQuery(urlToValidate);

  const [reserveEgg] = useHuntEggMutation();
  const [isHunted, setIsHunted] = useState(false);
  const [error, setError] = useState('');
  const [placement, setPlacement] = useState({ top: '20%', left: '20%' });

  useEffect(() => {
    setIsOpen(false);
    setError('');
  }, [location]);

  useEffect(() => {
    setIsHunted(false);
    setError('');

    setPlacement({
      top: `${Math.floor(Math.random() * 70) + 10}%`,
      left: `${Math.floor(Math.random() * 70) + 10}%`,
    });
  }, [data]);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ address: string }>();

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isHunted, isOpen, isSubmitting, reset]);

  const onSubmit = useCallback(
    async (values: { address: string }) => {
      setError('');

      if (!data?.egg) return true;

      try {
        const response = await reserveEgg({
          eggHash: data.egg.eggHash,
          userWallet: values.address,
        });

        if ('data' in response) {
          if (response.data?.valid) {
            return setIsHunted(true);
          }
        }

        throw new Error('Something went wrong');
      } catch (e) {
        setError('This egg has already been secured by someone else.');
      }

      return true;
    },
    [data, reserveEgg],
  );

  return (
    <Flex>
      {data?.valid && !isHunted && (
        <Flex position="fixed" sx={placement} zIndex={1}>
          <Egg onOpen={() => setIsOpen(true)} />
        </Flex>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent zIndex={9999}>
          <ModalHeader color="brand.btnSecondary">You have found a hidden Easter Egg!</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" gap={4}>
              <Flex gap={4}>
                {isHunted ? (
                  <Text textStyle="h4" variant="green">
                    You have secured the egg!
                  </Text>
                ) : (
                  <Text fontWeight="semibold" textStyle="caption">
                    Ēastre the goddess of spring and rebirth has blessed you with {data?.egg?.value}{' '}
                    $THOR! Secure the coveted egg with your wallet address, and the Easter Bunny
                    shall airdrop your reward soon!
                  </Text>
                )}
                <Flex mx={3}>
                  <Egg />
                </Flex>
              </Flex>

              <Input
                disabled={isHunted}
                isInvalid={!!errors.address}
                placeholder="Erc-20 wallet address 0x..."
                {...register('address', {
                  required: 'Address is required',
                  validate: {
                    isValidAddress: (value: string) => {
                      return value.length && value.startsWith('0x') && value.length === 42
                        ? true
                        : 'Invalid address';
                    },
                  },
                })}
              />

              <Text opacity={error ? 1 : 0} textStyle="caption" variant="red">
                {error || '-'}
              </Text>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              disabled={!!errors.address}
              loading={isSubmitting}
              mr={3}
              onClick={isHunted ? () => setIsOpen(false) : handleSubmit(onSubmit)}
            >
              {isHunted ? 'Close' : 'Secure my egg!'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
