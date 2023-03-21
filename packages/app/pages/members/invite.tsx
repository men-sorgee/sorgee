import { useUser } from '@/hooks/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import { postJSON } from 'lib/utils'
import { UserInvite, InviteLink, Member } from 'lib/models'
import { HStack, Button, Text, useClipboard, useToast } from '@chakra-ui/react'
import { FieldInput } from 'components/forms'
import { baseUrl } from 'lib/config'
import Page from 'components/Page'

function Invite() {
  const { loading, member } = useUser()
  return (
    <Page title="Invite Someone" loading={loading} sectionClass="" requireAuth={true}>
      {member && <Form member={member} />}
    </Page>
  )
}

function Form({ member }: { member: Member }) {
  const toast = useToast()
  const { setValue, hasCopied } = useClipboard('')
  const [link, setLink] = useState<string>()
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
    e.preventDefault()
    const invite = getLink(e.target.dataset)
    if (!invite) return
    setValue(invite)
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
    setLink(inviteLink)
    const { success, error } = await postJSON('/api/members/invite', {
      ...data,
      link: inviteLink,
    })

    if (success) {
      toast({
        title: 'Copied!',
        description: 'The invite link was sent to ' + data.email,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      reset()
    } else {
      setError('email', { message: error?.message })
    }
  }
  const email = getFieldState('email', formState)

  return (
    <>
      <Text mb={10}>
        {member?.first_name || 'Brother'}, enter your friend&apos;s email address and we will create
        a link that will allow them to apply to join.
      </Text>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldInput
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

          <HStack spacing={4} mt={4}>
            <Button colorScheme="accent" type="submit" disabled={!member || !email.isTouched}>
              Send Invite
            </Button>

            <Button disabled={!email.isTouched} colorScheme="primary" onClick={onCopyClick}>
              {hasCopied ? 'Copied!' : 'Copy'}
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </>
  )
}

export default Invite
