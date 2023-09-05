import { Box, Flex, ListItem, Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Icon, Link, Tooltip } from 'components/Atomic';
import { easeInOutTransition } from 'components/constants';
import type { MouseEventHandler } from 'react';
import { memo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import type { NavItemProps } from './types';
import { iconClasses } from './types';

export const NavItem = memo(
  ({
    sx,
    iconName,
    href = '',
    variant = 'primary',
    label,
    collapsed = false,
    transform = 'uppercase',
    rightIconName,
    onClick,
    onItemClickCb,
    beta,
  }: NavItemProps) => {
    const isActive = useLocation().pathname.includes(href);
    const onClickHandler: MouseEventHandler = useCallback(
      (e) => {
        onClick?.(e);
        onItemClickCb?.();
      },
      [onClick, onItemClickCb],
    );

    return (
      <ListItem sx={sx}>
        <Tooltip content={label} disabled={!collapsed} place="right">
          <Flex
            _hover={{
              bg:
                variant === 'primary'
                  ? 'brand.alpha.btnPrimary'
                  : variant === 'secondary'
                  ? 'brand.alpha.btnSecondary'
                  : undefined,
            }}
            align="center"
            bg={
              isActive && variant === 'primary'
                ? 'brand.btnPrimary'
                : isActive && variant === 'secondary'
                ? 'brand.btnSecondary'
                : undefined
            }
            borderRadius="2xl"
            boxSizing="border-box"
            className="group"
            h={9}
            justify="center"
            overflow="hidden"
            position="relative"
            role="group"
            transition={easeInOutTransition}
            w="full"
          >
            {beta && !isActive && (
              <Flex
                _groupHover={{ bgColor: 'transparent' }}
                align="center"
                bgColor="brand.btnSecondary"
                borderRadius="xl"
                h={collapsed ? 2 : 3}
                justify="center"
                position="absolute"
                px={collapsed ? 2.5 : 4}
                right={collapsed ? -3 : -4}
                top={2}
                transform="rotate(48deg)"
                transition={easeInOutTransition}
              >
                <Text
                  _groupHover={{
                    color: 'white',
                  }}
                  fontSize="10px"
                  fontWeight={500}
                  lineHeight="16px"
                  transition="ease"
                >
                  Beta
                </Text>
              </Flex>
            )}

            <Link
              className="flex overflow-hidden items-center w-full h-full no-underline justify-center"
              onClick={onClickHandler}
              to={href}
            >
              <Flex justify="center" px={4} w="full">
                <Box minH="18px" minW="18px">
                  <Flex align="center" justify="center">
                    {iconName && (
                      <Icon
                        className={classNames(
                          'transition group-hover:stroke-white group-hover:text-white font-bold',
                          iconClasses[variant],
                          { 'stroke-white !text-white': isActive },
                        )}
                        name={iconName}
                        size={18}
                      />
                    )}
                  </Flex>
                </Box>

                <Flex overflow="hidden" transition={easeInOutTransition} w={collapsed ? 0 : 'full'}>
                  <Text
                    _dark={{ color: isActive ? 'white' : 'brand.dark.textGreenLight' }}
                    _groupHover={{ color: 'white' }}
                    fontWeight="semibold"
                    px={2}
                    textStyle="caption"
                    textTransform={transform}
                    transition={easeInOutTransition}
                    whiteSpace="nowrap"
                  >
                    {label}
                  </Text>

                  {rightIconName && (
                    <Icon
                      className={classNames(
                        'ml-auto transition group-hover:stroke-white group-hover:text-white font-bold',
                        iconClasses[variant],
                        { 'stroke-white !text-white': isActive },
                      )}
                      name={rightIconName}
                      size={18}
                    />
                  )}
                </Flex>
              </Flex>
            </Link>
          </Flex>
        </Tooltip>
      </ListItem>
    );
  },
);
