import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
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
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Logo } from '../ui'
import { useState, useEffect } from 'react'
import { PageItem } from 'lib/models'
import NextLink from 'next/link'
import { listActivePages } from '@/lib/services/directus/static'
import { constrained } from './index'
import { useSite } from 'hooks'
export type Props = BoxProps & {
  children?: React.ReactNode | React.ReactNode[]
}
function Header({ children, ...props }: Props) {
  const { site } = useSite()
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
      children: navPages,
    },
    {
      label: 'Legal',
      children: [
        {
          label: 'Privacy Policy',
          href: '/privacy',
        },
        {
          label: 'Terms of Service',
          href: '/terms',
        },
      ],
    },
  ]
  return (
    <Box {...props} as="header" color={'white'} bg={'gray.900'}>
      <HStack minH={'60px'} alignItems="middle" spacing={4} __css={constrained}>
        <IconButton
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          variant={'ghost'}
          aria-label={'Toggle Navigation'}
        />
        <Flex flex={1} justify={'center'}>
          <Logo width={'20px'} />
        </Flex>

        <HStack flex={0} alignItems="middle" justifyItems={'center'}>
          <Button variant={'ghost'} onClick={toggleColorMode} mt={1}>
            {colorMode === 'light' ? <MoonIcon fontSize={'3xl'} /> : <SunIcon fontSize={'3xl'} />}
          </Button>
          {children}
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
            children.map((child) => (
              <Link as={NextLink} key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
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
  href?: string
}

export default chakra(Header)
