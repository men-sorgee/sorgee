import { NextPageContext } from 'next'
import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { postJSON } from 'lib/utils'
import {
  Button,
  Heading,
  useToast,
  Flex,
  Text,
  Avatar,
  HStack,
  Alert,
  AlertIcon,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react'
import { EventUser, Invite, Event, User } from 'lib/models'
import { LinkButton, UserBadge } from 'components/ui'
import { FieldSwitch } from 'components/forms'
import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import Page from 'components/Page'
type Props = {
  invite: Invite
  user: User
  event: Event
}

export async function getServerSideProps(context: NextPageContext) {
  const admin = await import('lib/services/directus/server')
  const { invite_id } = context.query

  const invite: EventUser = (await admin.getInvite(Number(invite_id))) as EventUser

  if (!invite) {
    return {
      notFound: true,
    }
  }

  const event: Event = invite.events_id as Event
  delete invite.events_id
  const user: User = invite.users_id as User
  delete invite.users_id
  return { props: { invite, user, event } }
}

type FormValues = {
  id: number
  user_id: string
  attended: boolean
  paid: boolean
  signed_waiver: boolean
}

export default function InviteAdmin({ invite, user, event }: Props) {
  const toast = useToast()
  const { member, loading } = useMember()
  const [working, setWorking] = useState(false)
  const router = useRouter()
  const methods = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      id: invite.id,
      user_id: user.id,
      attended: invite.attended,
      signed_waiver: user.signed_waiver,
    },
  })

  useEffect(() => {
    if (member) {
      if (member.user_type !== 'staff') {
        router.push(`/event/${event.id}?error=You+do+not+have+permission+to+view+admin+events.`)
      }
    }
  }, [member, router, event?.id])

  const { setError } = methods
  const updateInvite = useCallback(
    async (data: FormValues) => {
      setWorking(true)
      data.attended = true
      const [ok, response] = await postJSON('/api/invite/' + invite.id, data)
      if (ok) {
        toast({
          title: 'Invite Updated',
          position: 'bottom',
          description: 'The user is checked in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          onCloseComplete: () => {
            router.push('/event/' + event.id)
          },
        })
      } else if (response.error?.field) {
        setError(response.error!.field as any, response.error.message as any)
      } else {
        toast({
          title: 'Something went wrong.',
          position: 'bottom',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      setWorking(false)
    },
    [event.id, invite.id, router, setError, toast]
  )

  return (
    <Page title="Invite Admin" description="Invite Admin" loading={loading}>
      {(event.status == 'scheduled' && (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(updateInvite)}>
            <SimpleGrid
              columns={[1, 1, 3]}
              border={'1px solid'}
              borderColor="primary"
              rounded="lg"
              shadow="lg"
              gap={4}
              w="full"
              p={4}
            >
              <HStack>
                <Avatar
                  id={user.id}
                  src={'/api/asset/' + user.photo}
                  size="xl"
                  color="white"
                  bg="primary.300"
                  title={user?.biography}
                />
                <VStack align="start">
                  <Heading size={['sm', 'sm', 'md']} textTransform="uppercase" m={0}>
                    {user.first_name} {user.last_name}
                  </Heading>
                  <UserBadge size="lg" user_type={user?.user_type} />
                  <Text fontSize="xs" color="gray.500">
                    <a href={'mailto:' + user.email}>{user.email}</a>
                  </Text>
                </VStack>
              </HStack>
              {(invite.attended == true && (
                <Alert size="xl" status="warning">
                  <AlertIcon />
                  <Heading size="lg">Already checked in</Heading>
                </Alert>
              )) || (
                <>
                  <Flex
                    direction={['row', 'row', 'column']}
                    alignContent="right"
                    justifyContent="stretch"
                  >
                    {invite.guest == false && (
                      <FieldSwitch
                        field="paid"
                        label="Paid"
                        registerOptions={{
                          required: 'Member must pay',
                        }}
                      />
                    )}
                    <FieldSwitch
                      field="signed_waiver"
                      label="Signed"
                      registerOptions={{
                        required: 'Waiver must be signed',
                      }}
                    />
                  </Flex>
                  {!working && (
                    <Button colorScheme={'accent'} p={8} size="xl" type="submit" disabled={working}>
                      Check In
                    </Button>
                  )}
                </>
              )}
            </SimpleGrid>
            <HStack spacing={4}>
              <LinkButton colorScheme="primary" href="/member/scan" my={4}>
                Scan Another
              </LinkButton>
              <LinkButton colorScheme="gray" href={'/event/' + event.id} my={4}>
                Return to Event
              </LinkButton>
            </HStack>
          </form>
        </FormProvider>
      )) || <Text>Event is not scheduled</Text>}
    </Page>
  )
}
