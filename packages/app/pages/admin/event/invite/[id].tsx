import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { fetchJSON, postJSON } from 'lib/utils'
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
  Box,
} from '@chakra-ui/react'
import { EventUser, Invite, GroupEvent, User, MemberLevel } from 'lib/models'
import { LinkButton, Loading, TakePhoto, MemberBadge } from 'components/controls'
import { FieldSwitch } from 'components/forms'
import { useRouter } from 'next/router'
import Page from 'components/Page'
import { useMember, useUser } from 'hooks'

type Props = {
  event: GroupEvent
  invite: EventUser
  user: User
}
const visible = (show: boolean) => (show ? 'flex' : 'none')

type FormValues = {
  id: number
  user_id: string
  paid: boolean
  signed_waiver: boolean
  picture?: string
}

export const getServerSideProps = async (context) => {
  const { getInvite } = await import('lib/services/directus/server/users')
  const inviteId = Number(context.query.id)

  const invite = await getInvite(inviteId)
  if (!invite) {
    return {
      notFound: true,
    }
  }
  const event = invite.events_id as GroupEvent
  const user = invite.users_id as User

  return {
    props: {
      invite,
      event,
      user,
    },
  }
}

export default function InviteAdmin({ event, invite, user }: Props) {
  const { member, loading, level } = useUser()
  const { picture: p, name } = useMember(user?.id)
  const [camera, setCamera] = useState(false)
  const [picture, setPicture] = useState<string>(p)

  const toast = useToast()

  const [working, setWorking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading && member) {
      if (event && level < MemberLevel.staff) {
        router.push(
          `/admin/event/${event?.id}?error=You+do+not+have+permission+to+view+admin+events.`
        )
      }
    }
  }, [event, level, loading, member, router])

  const methods = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      id: invite?.id,
      user_id: user?.id,
      signed_waiver: user?.signed_waiver,
      paid: invite?.paid,
    },
  })

  const { setError, handleSubmit, watch } = methods

  const takePhoto = useCallback(
    (data: string) => {
      setPicture(data)
      setCamera(false)
    },
    [setPicture, setCamera]
  )

  const updateInvite = useCallback(
    async (data: FormValues) => {
      setWorking(true)
      if (picture) {
        const media = await fetch(picture!).then((res) => res.blob())
        let formData = new FormData()
        formData.append('media', media)
        await fetch(`/api/member/${user.id}/photos/picture?name=${user.email}-face`, {
          method: 'POST',
          body: formData,
        })
      }

      const { success, error } = await postJSON('/api/invite/' + invite.id, {
        user_id: user.id,
        paid: data.paid,
        attended: true,
        signed_waiver: data.signed_waiver,
      })
      if (success) {
        toast({
          title: 'Invite Updated',
          position: 'bottom',
          description: 'The user is checked in.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          onCloseComplete: () => {
            router.push('/admin/event/' + event.id)
            setWorking(false)
          },
        })
      } else if (error?.field) {
        setError(error!.field as any, error.message as any)
        setWorking(false)
      } else {
        toast({
          title: 'Something went wrong.',
          position: 'bottom',
          description: 'Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        setWorking(false)
      }
    },
    [event?.id, invite?.id, picture, router, setError, toast, user?.email, user?.id]
  )
  const paid = watch('paid')
  const signed_waiver = watch('signed_waiver')
  const ready = picture && signed_waiver && (invite.guest || paid)
  return (
    <Page
      title={`Check-in ${event.name}`}
      description="Invite Admin"
      loading={loading}
      requireAuth={true}
    >
      {(invite && (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(updateInvite)} style={{ marginTop: '2rem' }}>
            {(!working && (
              <Flex
                direction={['column', 'column', 'row']}
                alignItems="center"
                justifyItems="center"
                display={visible(!camera)}
                gap={4}
                w="full"
                p={4}
                border="1px solid"
                borderColor="text"
                shadow="lg"
                rounded="lg"
                my={4}
              >
                <Flex direction="row" gap={8} alignItems="center" justifyItems="center">
                  <Avatar
                    id={user.id}
                    src={picture}
                    size="2xl"
                    color="white"
                    bg="primary.300"
                    title="Change Photo"
                    onClick={() => setCamera(true)}
                    _hover={{ cursor: 'pointer' }}
                  />
                  <Box>
                    <Heading size={['sm', 'sm', 'md']} textTransform="uppercase" m={0}>
                      {user?.first_name} {user?.last_name}
                    </Heading>
                    <MemberBadge size="lg" user_type={user?.user_type} />
                    <Text fontSize="xs" color="gray.500">
                      <a href={'mailto:' + user?.email}>{user?.email}</a>
                    </Text>
                  </Box>
                </Flex>

                <Flex
                  direction="row"
                  w={['100%', '50%', '30%']}
                  justifyItems="space-between"
                  mx="auto"
                >
                  {invite?.guest == false && (
                    <FieldSwitch
                      field="paid"
                      label="Paid"
                      size="lg"
                      registerOptions={{
                        required: 'Member must pay',
                      }}
                    />
                  )}
                  <FieldSwitch
                    field="signed_waiver"
                    label="Signed"
                    size="lg"
                    registerOptions={{
                      required: 'Waiver must be signed',
                    }}
                  />
                </Flex>
                {(picture && (
                  <Button
                    type="submit"
                    hidden={invite?.attended}
                    colorScheme={'accent'}
                    p={8}
                    size="xl"
                    disabled={working || !ready}
                  >
                    Check In
                  </Button>
                )) || (
                  <Button
                    colorScheme={'accent'}
                    p={8}
                    hidden={invite?.attended}
                    size="xl"
                    onClick={() => {
                      setCamera(true)
                    }}
                  >
                    Take Picture
                  </Button>
                )}
                {invite?.attended && (
                  <Alert size="xl" status="warning" justifyContent="center">
                    <AlertIcon />
                    <Heading size="lg">Already checked in</Heading>
                  </Alert>
                )}
              </Flex>
            )) || <Loading />}
            {camera && (
              <Box display={visible(camera)} w="full">
                <TakePhoto onAccept={takePhoto} facingMode="environment" />
              </Box>
            )}
            <HStack spacing={4}>
              <LinkButton colorScheme="gray" href={'/admin/event/' + event?.id} my={4}>
                Return to Event
              </LinkButton>
              <LinkButton colorScheme="primary" href="/member/scan" my={4}>
                Scan Another
              </LinkButton>
            </HStack>
          </form>
        </FormProvider>
      )) || <Text>Invite not found</Text>}
    </Page>
  )
}
