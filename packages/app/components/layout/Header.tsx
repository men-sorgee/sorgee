import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  useDisclosure,
  useColorMode,
  chakra,
  BoxProps,
  HStack,
  StackProps,
  useColorModeValue,
} from '@chakra-ui/react'
import { CloseIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { MoonIcon, SunIcon, MenuIcon } from '@heroicons/react/solid'
import { Logo } from '../ui'
import { useState, useEffect, useCallback } from 'react'
import { PageItem } from 'lib/models'
import NextLink from 'next/link'
import { listActivePages } from 'lib/services/directus/static'
import { constrained } from './index'
import User from './User'
import { useRouter } from 'next/router'
export type Props = BoxProps & {
  children?: React.ReactNode | React.ReactNode[]
}
function Header({ children, ...props }: Props) {
  const router = useRouter()
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [pages, setPages] = useState<PageItem[]>()
  const { colorMode, toggleColorMode } = useColorMode()

  const routeStart = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    router.events.on('routeChangeStart', routeStart)

    if (!pages) {
      listActivePages().then((pages) => {
        setPages(
          pages
            .filter((p) => p.in_menu)
            .map((p) => {
              return { title: p.title, path: `/${p.slug}` }
            })
        )
      })
    }
    return () => {
      router.events.off('routeChangeStart', routeStart)
    }
  }, [setPages, pages, router.events, routeStart])

  const navPages =
    pages?.map((p) => {
      return {
        label: p.title,
        href: p.path,
      }
    }) || []
  const navItems: Array<NavItem> = [
    {
      label: 'INFORMATION',
      children: [
        {
          label: 'Home',
          href: '/',
        },
        ...navPages,
        {
          label: 'Pricing',
          href: '/pricing',
        },
      ],
    },
    {
      label: 'LEGAL',
      children: [
        {
          label: 'Privacy Policy',
          href: '/privacy',
          reload: true,
        },
        {
          label: 'Terms of Service',
          href: '/terms',
          reload: true,
        },
      ],
    },
  ]
  return (
    <>
      <Box
        {...props}
        as="header"
        color="white"
        position="sticky"
        shadow="xl"
        bg={useColorModeValue('primary.800', 'black')}
        minH="60px"
      >
        <HStack
          alignItems="center"
          justifyItems="space-between"
          align="center"
          spacing={4}
          __css={constrained}
        >
          <IconButton
            size="lg"
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <MenuIcon />}
            variant="primary"
            aria-label="Toggle Navigation"
          />
          <Flex flex={1} justify="center" ml={12}>
            <Logo width="20px" />
          </Flex>

          <HStack spacing={2} alignItems="center" justifyItems="middle">
            <User />

            <IconButton
              size="lg"
              onClick={toggleColorMode}
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              variant="primary"
              aria-label="Toggle Theme"
            />
          </HStack>
        </HStack>
        <Collapse in={isOpen} animateOpacity>
          <MobileNav navItems={navItems} {...constrained} />
        </Collapse>
      </Box>
    </>
  )
}

const MobileNav = ({ navItems, ...props }: StackProps & { navItems: NavItem[] }) => {
  return (
    <Stack as="nav" color={'white'} __css={props} mb={4}>
      {navItems?.map((navItem, index) => (
        <MobileNavItem key={navItem.label} {...navItem} childrenOpen={index == 0} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href, childrenOpen = false }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: childrenOpen,
  })

  return (
    <Stack onClick={children && onToggle}>
      <Flex
        py={4}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color={'white'} textTransform="uppercase">
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack
          spacing={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={'white'}
          align={'start'}
        >
          {children &&
            children.map((child, i) => (
              <Box key={i} w="full" _hover={{ bg: 'primary.400' }} py={1} px={2}>
                {(child.reload && (
                  <a style={{ display: 'block' }} href={child.href}>
                    {child.label}
                  </a>
                )) || (
                  <Link
                    display="block"
                    _hover={{ textDecoration: 'none' }}
                    as={NextLink}
                    py={2}
                    href={child.href}
                  >
                    {child.label}
                  </Link>
                )}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  childrenOpen?: boolean
  href?: string
  reload?: boolean
}

export default chakra(Header)
