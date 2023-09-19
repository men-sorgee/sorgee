import { useUser } from "hooks";
import { Member, MemberLevel, MemberLevelColorMap } from "lib/models";
import NextLink from "next/link";
import { memo, ReactNode } from "react";

import { LockIcon } from "@chakra-ui/icons";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardProps,
  chakra,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Spacer,
  Text
} from "@chakra-ui/react";

import { Markdown, MemberActions } from "../";
import {
  MemberAttributeBanner,
  MemberHeader,
  MemberMessageStats,
  MemberRelationBanner
} from "./";

export type MemberCardProps = CardProps & {
  viewer: Member
  member: Partial<Member>
  full?: boolean
  onClick?: () => void
  onChange?: () => void
  href?: string
  children?: ReactNode | ReactNode[]
}

export const MemberCard = memo(chakra(
  function MemberCard({
    member,
    onClick,
    full = false,
    size = ['lg', 'xl'],
    href = `/member/${member.id}`,
    children,
    onChange,
    ...props
  }: MemberCardProps) {
    const levelValue = MemberLevel[member?.user_type || 'applicant']
    const levelColor = MemberLevelColorMap[levelValue]
    const { member: viewer, level } = useUser()
    const viewerLevel = MemberLevel[viewer?.user_type || 'applicant']

    return (
      <>
        <Card
          w="full"
          h="full"
          bgGradient={`linear(to-bl, ${levelColor[0]}, ${levelColor[1]})`}
          rounded="lg"
          border="1px solid transparent"
          borderColor="primary"
          color="white"
          minW="full"
          overflow="hidden"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
          {...props}
        >
          {member.status == 'active' ? (
            <>
              <LinkBox key={member.id}>

                <CardHeader mb={0} >
                  <LinkOverlay
                    as={NextLink}
                    href={href}
                    onClick={(e) => {
                      if (onClick) {
                        e.stopPropagation()
                        e.preventDefault()
                        onClick()
                      } else {
                        return member.show_profile
                      }
                    }}
                  >
                    <MemberHeader member={member} size={size} minimal={!full} onChange={() => {
                      if (onChange) onChange()
                    }}>
                      {member?.show_profile && <MemberAttributeBanner member={member} />}
                    </MemberHeader>
                  </LinkOverlay>
                </CardHeader>
              </LinkBox>
              <CardBody pt={0} m={0}>
                {(full && (levelValue == MemberLevel.pledge || viewerLevel == MemberLevel.staff)) && (
                  <MemberMessageStats memberId={member?.id} viewerLevel={level} />
                )}
                {full && !member.show_profile && (
                  <>
                    <Flex
                      px={4}
                      direction="column"
                      align="center"
                      justify="center"
                    >
                      <LockIcon color="primary.500" h={20} w={20} mx={'auto'} />
                      <Heading as="h3" mt={10} size="sm" p={0} textAlign="center" color="white">
                        PRIVATE PROFILE
                      </Heading>
                    </Flex>
                  </>
                )}
                {children}
                {full && member?.show_profile && (
                  <Markdown content={member?.biography} noOfLines={2} py={0} my={0} />
                )}
              </CardBody>
              <Spacer />
              <MemberRelationBanner member={member} viewer={viewer} bg={'primary.900'} />
              <CardFooter
                flexDir="column"
                justify="space-between"
                alignItems="end"
                bg="primary.800"
                p={4}
              >
                <MemberActions viewer={viewer} member={member} size={['sm', 'md']} />
              </CardFooter>
            </>) : (<CardBody><Text>Deleted User</Text></CardBody>)}
        </Card>


      </>
    )
  }
))
