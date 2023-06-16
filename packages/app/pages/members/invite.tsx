import { useState } from 'react'

import { FieldInput } from 'components/forms'
import Page from 'components/Page'
import { baseUrl } from 'lib/config'
import { InviteLink, Member, MemberLevel, UserInvite } from 'lib/models'
import { postJSON } from 'lib/utils'
import { FormProvider, useForm } from 'react-hook-form'

import { useUser } from '@/hooks/use-user'
import { Alert, AlertIcon, Button, Text, useToast } from '@chakra-ui/react'

function Invite() {
  const { loading, member } = useUser({
    minLevel: MemberLevel.brother,
  })
  return (
    <Page title="Invite a Trusted Buddy" loading={loading} requireAuth={true}>
      {member && <Form member={member} />}
    </Page>
  )
}

function Form({ member }: { member: Member }) {
  const toast = useToast()
  const [link, setLink] = useState<string | boolean>(false)
  const methods = useForm<InviteLink>({
    mode: 'onBlur',
  })

  const { handleSubmit, setError, reset, getFieldState, formState } = methods

  const getLink = ({ e }: UserInvite) => {
    if (!member) return
    const data = Buffer.from(JSON.stringify({ e, v: member?.id })).toString('base64')
    const invite = `${baseUrl}/apply/${data}`
    setLink(invite)
    return invite
  }

  const onCopyClick = (e: any) => {
    navigator?.clipboard?.writeText(link as string)
    toast({
      title: 'Copied!',
      description: 'The invite link was copied to your clipboard.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  const onSubmit = async (data: InviteLink) => {
    if (!member) {
      setError('email', { message: 'Member not found' })
    }
    const inviteLink = getLink({
      e: data.email,
      v: member?.id,
    })
    const { success, error } = await postJSON('/api/members/invite', {
      ...data,
      link: inviteLink,
    })

    if (success) {
      toast({
        title: 'Invite Link is Ready',
        description: 'Share the link with your buddy ' + data.email,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } else {
      setError('email', { message: error?.message })
    }
  }
  const email = getFieldState('email', formState)

  return (
    <>
      <Text>
        {member?.first_name || 'Brother'}, enter your friend&apos;s email address and we will create
        a link that will allow them to apply to join.
      </Text>
      <Alert status="warning" rounded="lg" shadow="lg" mb={10} mt={1}>
        <AlertIcon />
        <Text m={0}>
          <b>Warning:</b>&nbsp; By inviting this person, you are personally vouching for them. If
          they get banned for bad behavior, you will also be banned.
        </Text>
      </Alert>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {link ? (
            <FieldInput
              key="link"
              field="link"
              label="Link"
              rounded="md"
              onClick={onCopyClick}
              value={link as string}
              readOnly
            />
          ) : (
            <FieldInput
              key="email"
              field="email"
              type="email"
              label="Email"
              rounded="md"
              autoComplete="email"
              registerOptions={{
                required: {
                  value: true,
                  message: 'Please enter an email address',
                },
              }}
              placeholder="Email address"
            />
          )}
          {link && (
            <Alert rounded="lg" shadow="lg" mt={1} mb={10}>
              <AlertIcon />
              <Text m={0}>
                <b>Important:</b>&nbsp;{' '}
                <em>
                  This link is unique to you and your friend. Please do not share it with anyone
                  else.
                </em>
              </Text>
            </Alert>
          )}
          {link ? (
            <Button
              mt={4}
              colorScheme="accent"
              onClick={() => {
                reset()
                setLink(false)
              }}
            >
              Clear
            </Button>
          ) : (
            <Button
              mt={4}
              colorScheme="accent"
              type="submit"
              disabled={!member || !email.isTouched}
            >
              Create Invite
            </Button>
          )}
        </form>
      </FormProvider>
    </>
  )
}

export default Invite
