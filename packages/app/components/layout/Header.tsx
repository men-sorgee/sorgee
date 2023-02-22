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
import { MenuIcon } from '@heroicons/react/solid'
import { Logo } from '../controls'
import { useState, useEffect, useCallback } from 'react'
import { Page, PageItem } from 'lib/models'
import NextLink from 'next/link'
import { listActivePages } from 'lib/services/directus/static'
import { constrained } from './index'
import User from './User'
import { useRouter } from 'next/router'
export type Props = BoxProps & {
  children?: React.ReactNode | React.ReactNode[]
}

const recursiveChildren = (parent: Page, pages: Page[]) => {
  return pages
    .filter((child) => (child.parent as string) === parent.id)
    .map((child) => {
      return {
        title: child.title,
        path: `/${parent.slug}/${child.slug}`,
        children: recursiveChildren(child, pages),
      }
    })
}

function Header({ children, ...props }: Props) {
  const router = useRouter()
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [pages, setPages] = useState<PageItem[]>()

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
              return {
                title: p.title,
                path: `/${p.slug}`,
                children: recursiveChildren(p, pages),
              }
            })
        )
      })
    }
    return () => {
      router.events.off('routeChangeStart', routeStart)
    }
  }, [setPages, pages, router.events, routeStart])

  const navItems: Array<NavItem> = [
    {
      title: 'INFORMATION',
      path: null,
      children: [
        {
          title: 'Home',
          path: '/',
          children: [],
        },
        ...(pages || []),
        {
          title: 'Pricing',
          path: '/pricing',
          children: [],
        },
      ],
    },
    {
      title: 'LEGAL',
      children: [
        {
          title: 'Privacy Policy',
          path: '/privacy',
          reload: true,
          children: [],
        },
        {
          title: 'Terms of Service',
          path: '/terms',
          reload: true,
          children: [],
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
            size="md"
            onClick={onToggle}
            icon={isOpen ? <CloseIcon /> : <MenuIcon />}
            variant="primary"
            aria-label="Toggle Navigation"
          />
          <Flex flex={1} justify="center" ml={8}>
            <Logo width="20px" />
          </Flex>
          <User />
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
        <MobileNavItem key={navItem.title} {...navItem} childrenOpen={index == 0} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ title: label, children, path, childrenOpen = false }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: childrenOpen,
  })

  return (
    <Stack onClick={children && onToggle}>
      <Flex
        py={4}
        as={Link}
        href={path ?? '#'}
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
            children.map((child: NavItem, i: number) => (
              <Box key={i} w="full" _hover={{ bg: 'primary.400' }} py={1} px={2}>
                {(child.reload && (
                  <a style={{ display: 'block' }} href={child.path}>
                    {child.title}
                  </a>
                )) || (
                  <Link
                    display="block"
                    _hover={{ textDecoration: 'none' }}
                    as={NextLink}
                    py={2}
                    href={child.path}
                  >
                    {child.title}
                  </Link>
                )}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

type NavItem = Partial<PageItem> & {
  subLabel?: string
  childrenOpen?: boolean
  reload?: boolean
  children?: NavItem[]
}

export default chakra(Header)
