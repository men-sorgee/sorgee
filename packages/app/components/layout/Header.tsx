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
import { HamburgerIcon, CloseIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Logo } from '../ui'
import { useState, useEffect } from 'react'
import { PageItem } from 'lib/models'
import NextLink from 'next/link'
import { listActivePages } from 'lib/services/directus/static'
import { constrained } from './index'
import User from './User'
export type Props = BoxProps & {
  children?: React.ReactNode | React.ReactNode[]
}
function Header({ children, ...props }: Props) {
  const { isOpen, onToggle } = useDisclosure()
  const [pages, setPages] = useState<PageItem[]>()
  const { colorMode, toggleColorMode } = useColorMode()
  useEffect(() => {
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
  }, [setPages, pages])

  const navPages =
    pages?.map((p) => {
      return {
        label: p.title,
        href: p.path,
      }
    }) || []
  const navItems: Array<NavItem> = [
    {
      label: 'Home',
      children: [
        ...navPages,
        {
          label: 'Pricing',
          href: '/pricing',
        },
      ],
    },
    {
      label: 'Legal',
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
    <Box {...props} as="header" color={'white'} bg={useColorModeValue('primary.800', 'black')}>
      <HStack
        minH={'60px'}
        alignItems="center"
        justifyItems="space-between"
        align="center"
        spacing={4}
        __css={constrained}
      >
        <IconButton
          size={'lg'}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant={'ghost'}
          aria-label={'Toggle Navigation'}
        />
        <Flex flex={1} justify={'center'}>
          <Logo width={'20px'} />
        </Flex>

        <HStack spacing={2} alignItems="center" justifyItems="middle">
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant={'ghost'}
            aria-label={'Toggle Theme'}
          />
          <User />
        </HStack>
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} {...constrained} />
      </Collapse>
    </Box>
  )
}

const MobileNav = ({ navItems, ...props }: StackProps & { navItems: NavItem[] }) => {
  return (
    <Stack as="nav" bg={'gray.800'} color={'white'} p={4} __css={props}>
      {navItems?.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color={'white'}>
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

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={'white'}
          align={'start'}
        >
          {children &&
            children.map(
              (child) =>
                (child.reload && (
                  <a key={child.label} style={{ paddingTop: 2 }} href={child.href}>
                    {child.label}
                  </a>
                )) || (
                  <Link as={NextLink} key={child.label} py={2} href={child.href}>
                    {child.label}
                  </Link>
                )
            )}
        </Stack>
      </Collapse>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
  reload?: boolean
}

export default chakra(Header)
