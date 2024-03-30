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
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useReserveMutation, useValidateUrlQuery } from 'store/trpcApi/api';

const domain = window.location.origin;
export const EggHunt = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const urlToValidate = useMemo(() => {
    const isTx = location.pathname.includes('/tx');
    const pathname = location.pathname.split('?')[0];

    return isTx ? `${domain}/tx` : `${domain}${pathname}`;
  }, [location.pathname]);

  const url = useDebouncedValue(urlToValidate, 5000);
  const { data } = useValidateUrlQuery(url);

  const [reservePrize] = useReserveMutation();
  const [isTaken, setIsTaken] = useState(false);
  const [error, setError] = useState('');
  const [placement, setPlacement] = useState({ top: '20%', left: '20%' });
  const isValidPrize = data?.prize && !isTaken;

  useEffect(() => {
    setIsOpen(false);
    setError('');
  }, [location]);

  useEffect(() => {
    setIsTaken(false);
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
  }, [isTaken, isOpen, isSubmitting, reset]);

  const onSubmit = useCallback(
    async (values: { address: string }) => {
      setError('');

      if (!data?.prize) return true;

      try {
        const response = await reservePrize({ hash: data.prize.hash, wallet: values.address });

        if ('data' in response) {
          if (response.data?.prize) {
            return setIsTaken(true);
          }
        }

        throw new Error('Something went wrong');
      } catch (e) {
        setError('This prize has already been secured by someone else.');
      }

      return true;
    },
    [data, reservePrize],
  );

  return (
    <Flex>
      {isValidPrize && (
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
                {isTaken ? (
                  <Text textStyle="h4" variant="green">
                    You have secured the egg!
                  </Text>
                ) : (
                  <Text fontWeight="semibold" textStyle="caption">
                    Ēastre the goddess of spring and rebirth has blessed you with{' '}
                    {data?.prize?.value} $THOR! Secure the coveted egg with your wallet address, and
                    the Easter Bunny shall airdrop your reward soon!
                  </Text>
                )}
                <Flex mx={3}>
                  <Egg />
                </Flex>
              </Flex>

              <Input
                disabled={isTaken}
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
              onClick={isTaken ? () => setIsOpen(false) : handleSubmit(onSubmit)}
            >
              {isTaken ? 'Close' : 'Secure my egg!'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isValidPrize && <Confetti recycle={isOpen} />}
    </Flex>
  );
};
