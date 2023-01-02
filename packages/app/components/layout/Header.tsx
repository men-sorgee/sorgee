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
  LinkBox,
  LinkOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  useColorMode,
  chakra,
  BoxProps,
  HStack,
  StackProps,
  Show,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoonIcon,
  SunIcon,
} from '@chakra-ui/icons'
import { Logo } from '../ui'
import { useState, useEffect } from 'react'
import { PageItem } from 'lib/models'
import NextLink from 'next/link'
import { listActivePages } from '@/lib/services/directus/static'
import User from './User'
import { constrained } from './index'
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
    ...navPages,
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
      <HStack minH={'60px'} spacing={4} __css={constrained}>
        <IconButton
          onClick={onToggle}
          icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          variant={'ghost'}
          aria-label={'Toggle Navigation'}
          display={{ base: 'flex', md: 'none' }}
        />
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Logo width={'50px'} />
          <Show above="md">
            <DesktopNav marginLeft={10} navItems={navItems} />
          </Show>
        </Flex>

        <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={4}>
          <Button variant={'ghost'} onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
          {children}
          <User />
        </Stack>
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={navItems} />
      </Collapse>
    </Box>
  )
}

const DesktopNav = ({ navItems, ...props }: StackProps & { navItems: NavItem[] }) => {
  const linkColor = useColorModeValue('gray.200', 'white')
  const linkHoverColor = useColorModeValue('white', 'white')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')

  return (
    <HStack as="nav" direction={'row'} spacing={4} __css={props}>
      {navItems?.map((navItem: NavItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? '#'}
                fontSize={{
                  md: 'xl',
                }}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </HStack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <LinkBox
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <LinkOverlay href={href} />
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'pink.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </LinkBox>
  )
}

const MobileNav = ({ navItems, ...props }: StackProps & { navItems: NavItem[] }) => {
  return (
    <Stack as="nav" bg={'gray.800'} color={'white'} p={4} display={{ md: 'none' }} __css={props}>
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
        color={'white'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
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
          borderColor={useColorModeValue('gray.200', 'gray.700')}
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
