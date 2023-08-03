import {
  ButtonLink,
  FieldSwitch,
  Form,
  MemberAvatar,
  MemberBadge,
  Page,
  PhotoCapture
} from "components";
import { useInviteAdmin, useUser } from "hooks";
import { EventInvite, GroupEvent, Member, MemberLevel } from "lib/models";
import { getAssetUrl } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
  useToast,
  VStack
} from "@chakra-ui/react";

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
  const inviteId = String(id)
  const { loading } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true
  })

  const [user, setUser] = useState<Member>(undefined)
  const [event, setEvent] = useState<GroupEvent>(undefined)
  const [camera, setCamera] = useState(false)
  const [picture, setPicture] = useState<string>(undefined)
  const [working, setWorking] = useState(false)

  const {
    invite,
    loading: inviteLoading,
    checkin,
    reload
  } = useInviteAdmin(inviteId)

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

  const defaultValues = {
    id: invite?.id,
    user_id: user?.id,
    signed_waiver: user?.signed_waiver,
    paid: invite?.paid
  }

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

      return checkin(paid, signed_waiver)
    },
    [checkin, picture, user?.email, user?.id]
  )

  const visible = (show: boolean) => (show ? 'flex' : 'none')

  return (
    <Page
      title={`Check-in`}
      description="Invite Admin"
      loading={loading || inviteLoading}
    >
      <Form<FormProps, EventInvite>
        onSubmit={updateInvite}
        onSuccess={() =>
          reload().then(() => router.push(`/admin/event/${event?.id}`))
        }
        defaultValues={defaultValues}
        successMessage="The invite was successfully updated."
      >
        {({ formState: { isValid, isSubmitting }, register }) => (
          <>
            <Flex
              mt={2}
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
                gap={2}
                alignItems="center"
                justifyItems="center"
              >
                <MemberAvatar
                  member={user}
                  id={user?.id}
                  size="xl"
                  title="Change Photo"
                  onClick={() => setCamera(true)}
                  cursor="pointer"
                />
                <Box>
                  <Heading
                    size={['sm', 'sm', 'md']}
                    textTransform="uppercase"
                    mt={0}
                    mb={2}
                  >
                    {user?.first_name} {user?.last_name}
                  </Heading>
                  <MemberBadge size="lg" member={user} />
                  <Text fontSize="xs" color="gray.500">
                    <a href={'mailto:' + user?.email}>{user?.email}</a>
                  </Text>
                </Box>
              </Flex>

              <Flex
                direction={['column', 'column', 'row']}
                w={[null, null, '30%']}
                justifyItems="space-between"
                align="center"
                mx="auto"
                gap={2}
              >
                {!invite?.attended && !invite?.guest && (
                  <FieldSwitch
                    field="paid"
                    label="Paid"
                    size="lg"
                    registerOptions={{
                      required: 'Member must pay'
                    }}
                  />
                )}
                {!invite?.attended && !user?.signed_waiver && (
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
              <VStack align="center">
                <Heading
                  as="h4"
                  fontSize="h6"
                  textTransform="capitalize"
                  p={0}
                  m={0}
                >
                  {invite?.rsvp}
                </Heading>
                {(picture && (
                  <Button
                    type="submit"
                    hidden={invite?.attended}
                    colorScheme={'accent'}
                    p={8}
                    size="xl"
                    w="full"
                    disabled={!isValid || isSubmitting}
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
                    w="full"
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
              </VStack>
            </Flex>
          </>
        )}
      </Form>
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
    </Page>
  )
}
