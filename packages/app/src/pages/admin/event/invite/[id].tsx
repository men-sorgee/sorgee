import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  ButtonLink,
  Loading,
  MemberBadge,
  PhotoCapture,
  Page,
  FieldSwitch
} from 'components'
import { useUser, useInviteAdmin } from 'hooks'
import { GroupEvent, MemberLevel, Member } from 'lib/models'
import { getAssetUrl } from 'lib/utils'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useToast
} from '@chakra-ui/react'

type FormProps = {
  id: number
  user_id: string
  paid: boolean
  signed_waiver: boolean
  picture?: string
}

export default function InviteAdmin() {
  const router = useRouter()
  const { id } = router.query
  const { loading } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true
  })
  const [user, setUser] = useState<Member>(undefined)
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [camera, setCamera] = useState(false)
  const [picture, setPicture] = useState<string>(undefined)
  const toast = useToast()
  const [working, setWorking] = useState(false)

  const {
    invite,
    loading: inviteLoading,
    checkin,
    reload
  } = useInviteAdmin(String(id))

  useEffect(() => {
    if (
      !loading &&
      !inviteLoading &&
      invite &&
      user == undefined &&
      event == undefined
    ) {
      setUser(invite.member)
      setEvent(invite.event)
      let { picture, photo } = invite.member
      setPicture(getAssetUrl(picture || photo))
    }
  }, [inviteLoading, invite, setUser, setEvent, loading, user, event])

  const methods = useForm<FormProps>({
    mode: 'onBlur',
    defaultValues: {
      id: invite?.id,
      user_id: user?.id,
      signed_waiver: user?.signed_waiver,
      paid: invite?.paid
    }
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
    async ({ paid, signed_waiver }: FormProps) => {
      setWorking(true)
      if (picture) {
        const media = await fetch(picture!).then((res) => res.blob())
        let formData = new FormData()
        formData.append('media', media)
        await fetch(
          `/api/members/${user.id}/photos/photo?name=${user.email}-face`,
          {
            method: 'POST',
            body: formData
          }
        )
      }

      const { success, error } = await checkin(paid, signed_waiver)

      if (success) {
        toast({
          title: 'Invite Updated',
          position: 'bottom',
          description: 'The user is checked in.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          onCloseComplete: () => {
            reload()
            router.push('/admin/event/' + event.id)
            setWorking(false)
          }
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
          isClosable: true
        })
        setWorking(false)
      }
    },
    [
      checkin,
      event?.id,
      picture,
      reload,
      router,
      setError,
      toast,
      user?.email,
      user?.id
    ]
  )
  const paid = watch('paid')
  const signed_waiver = watch('signed_waiver')
  const ready = picture && signed_waiver && (invite?.guest || paid)
  const visible = (show: boolean) => (show ? 'flex' : 'none')

  return (
    <Page
      title={`Check-in`}
      description="Invite Admin"
      loading={loading || inviteLoading}
      requireAuth={true}
    >
      {(invite && (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(updateInvite)}
            style={{ marginTop: '2rem' }}
          >
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
                <Flex
                  direction="row"
                  gap={8}
                  alignItems="center"
                  justifyItems="center"
                >
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
                    <Heading
                      size={['sm', 'sm', 'md']}
                      textTransform="uppercase"
                      m={0}
                    >
                      {user?.first_name} {user?.last_name} <br />
                      RSVP: {invite?.rsvp}
                    </Heading>
                    <MemberBadge size="lg" member={user} />
                    <Text fontSize="xs" color="gray.500">
                      <a href={'mailto:' + user?.email}>{user?.email}</a>
                    </Text>
                  </Box>
                </Flex>

                <Flex
                  direction={['column', 'column', 'row']}
                  w={[null, '50%', '30%']}
                  justifyItems="space-between"
                  align="center"
                  mx="auto"
                >
                  {!invite.attended && invite?.guest == false && (
                    <FieldSwitch
                      field="paid"
                      label="Paid"
                      size="lg"
                      registerOptions={{
                        required: 'Member must pay'
                      }}
                    />
                  )}
                  {user?.signed_waiver == false && (
                    <FieldSwitch
                      field="signed_waiver"
                      label="Signed"
                      size="lg"
                      registerOptions={{
                        required: 'Waiver must be signed'
                      }}
                    />
                  )}
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
                  <Alert
                    size="xl"
                    status="warning"
                    rounded="lg"
                    shadow="lg"
                    mt={4}
                  >
                    <AlertIcon />
                    <Text fontSize="lg" m={0}>
                      Already checked in
                    </Text>
                  </Alert>
                )}
              </Flex>
            )) || <Loading />}
            {camera && (
              <Box display={visible(camera)} w="full">
                <PhotoCapture onAccept={takePhoto} facingMode="environment" />
              </Box>
            )}
            {user?.needs_guidance && (
              <Alert size="xl" status="warning" rounded="lg" shadow="lg">
                <AlertIcon />
                <Text fontSize="lg" m={0}>
                  User needs guidance
                </Text>
              </Alert>
            )}
            <HStack spacing={4}>
              <ButtonLink
                colorScheme="gray"
                href={'/admin/event/' + event?.id}
                my={4}
              >
                Return to Event
              </ButtonLink>
              <ButtonLink colorScheme="primary" href="/admin/scan" my={4}>
                Scan Another
              </ButtonLink>
            </HStack>
          </form>
        </FormProvider>
      )) || <Text>Invite not found</Text>}
    </Page>
  )
}
