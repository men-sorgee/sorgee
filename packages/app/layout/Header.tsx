import { useCallback, useEffect, useRef, useState } from 'react'

import { Page, PageItem, UserType } from 'lib/models'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  chakra,
  Collapse,
  HStack,
  IconButton,
  Link,
  Stack,
  StackProps,
  useColorModeValue,
  useDisclosure,
  useOutsideClick
} from '@chakra-ui/react'
import { Bars4Icon, XMarkIcon } from '@heroicons/react/24/solid'

import { Logo } from '../components/controls'
import { constrained } from './index'
import User from './User'

export type Props = BoxProps & {
  userType?: UserType
  children?: React.ReactNode | React.ReactNode[]
}

function Header({ userType, children, ...props }: Props) {
  const router = useRouter()
  const { isOpen, onToggle, onClose } = useDisclosure()
  const [pages, setPages] = useState<PageItem[]>()
  const ref = useRef()
  useOutsideClick({
    ref: ref,
    handler: () => {
      onClose()
    }
  })
  useEffect(() => {
    const routeComplete = () => {
      if (isOpen) onClose()
    }
    router.events.on('routeChangeComplete', routeComplete)
    return () => {
      router.events.off('routeChangeComplete', routeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events, isOpen])

  const canSee = useCallback(
    (visibility: UserType[] = []) => {
      if (visibility.length == 0) return true
      return visibility.includes(userType)
    },
    [userType]
  )
  const mapPage = useCallback(
    (page: Page, isChild: boolean = false): PageItem => {
      return {
        title: page.title,
        path: `/${page.slug}`,
        children:
          page.children
            ?.filter((p) => canSee(p.visibility))
            .map((p) => mapPage(p, true)) || [],
        isChild: isChild || page.parent?.id != undefined,
        visibility: page.visibility || []
      }
    },
    [canSee]
  )
  useEffect(() => {
    if (!pages) {
      import('lib/services/directus/static')
        .then(({ listPages }) => listPages())
        .then((pages) => {
          setPages(
            pages
              .filter((p) => !p.parent && p.status == 'published' && p.in_menu)
              .map((p) => mapPage(p))
          )
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, userType])

  const mainPages = pages?.filter((p) => p.children.length == 0) || []
  const menus = pages?.filter((p) => p.children.length > 0) || []

  const navItems: Array<NavItem> = [
    {
      title: 'INFORMATION',
      path: null,
      children: [
        ...(mainPages.filter((p) => canSee(p.visibility)) || []),
        {
          title: 'Health & Wellness',
          path: '/blog',
          children: []
        },
        {
          title: 'Pricing',
          path: '/pricing',
          children: [],
          visibility: ['pledge', 'inductee', 'brother', 'staff']
        }
      ]
    },
    ...menus.filter((p) => canSee(p.visibility)),
    {
      title: 'LEGAL',
      children: [
        {
          title: 'Privacy Policy',
          path: '/privacy',
          reload: true,
          children: []
        },
        {
          title: 'Cookie Policy',
          path: '/cookies',
          reload: true,
          children: []
        },
        {
          title: 'Terms of Service',
          path: '/terms',
          reload: true,
          children: []
        }
      ]
    }
  ]
  const bg = useColorModeValue('primary.800', 'black')

  const NavMenu = ({
    navItems,
    ...props
  }: StackProps & { navItems: NavItem[] }) => {
    return (
      <Accordion
        allowToggle
        defaultIndex={[0]}
        as="nav"
        color={'white'}
        __css={props}
        mx={0}
        px={0}
        mb={4}
        {...constrained}
      >
        {navItems.map((navItem, index) => (
          <NavMenuItem
            key={navItem.title}
            onClose={onClose}
            item={navItem}
            childrenOpen={index == 0}
          />
        ))}
      </Accordion>
    )
  }

  return (
    <>
      <Box
        {...props}
        as="header"
        color="white"
        shadow="xl"
        bg={bg}
        minH="60px"
        px={0}
      >
        <HStack
          alignItems="center"
          alignContent="center"
          py={2}
          pr={[4, 6, 2]}
          align="center"
          {...constrained}
        >
          <Box w="50%">
            <IconButton
              size="md"
              onClick={onToggle}
              icon={
                isOpen ? (
                  <XMarkIcon height="30px" width="30px" />
                ) : (
                  <Bars4Icon height="30px" width="30px" />
                )
              }
              variant="primary"
              ml={[0, 2, -4]}
              aria-label="Toggle Navigation"
            />
          </Box>

          <Logo />
          <Box w="50%" textAlign="right">
            <User />
          </Box>
        </HStack>
        <Collapse in={isOpen} animateOpacity ref={ref}>
          <NavMenu navItems={navItems} {...constrained} />
        </Collapse>
      </Box>
    </>
  )
}

const NavMenuItem = ({
  onClose,
  item: { title: label, children, path }
}: {
  onClose: () => void
  childrenOpen?: boolean
  item: NavItem
}) => {
  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          <Link
            as={path ? NextLink : 'div'}
            _hover={{
              textDecoration: 'none'
            }}
            href={path}
            fontWeight={600}
            color={'white'}
            textTransform="uppercase"
          >
            {label}
          </Link>
        </Box>
        <AccordionIcon />
      </AccordionButton>
      {children && (
        <AccordionPanel>
          <Stack
            spacing={2}
            pl={2}
            ml={2}
            align={'start'}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={'white'}
          >
            {children.map((child: NavItem, i: number) => (
              <Box
                key={i}
                w="full"
                _hover={{ bg: 'primary.400' }}
                py={1}
                px={2}
              >
                {(child.reload && (
                  <a style={{ display: 'block' }} href={child.path}>
                    {child.title}
                  </a>
                )) || (
                  <Link
                    as={NextLink}
                    display="block"
                    _hover={{ textDecoration: 'none' }}
                    onClick={() => {
                      onClose()
                    }}
                    py={2}
                    href={child.path}
                  >
                    {child.title}
                  </Link>
                )}
              </Box>
            ))}
          </Stack>
        </AccordionPanel>
      )}
    </AccordionItem>
  )
}

type NavItem = Partial<PageItem> & {
  subLabel?: string
  childrenOpen?: boolean
  reload?: boolean
  children?: NavItem[]
}

export default chakra(Header)
