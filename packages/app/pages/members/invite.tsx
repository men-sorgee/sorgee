import { useUser } from '@/hooks/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { postJSON } from 'lib/utils'
import { MemberLevel, UserInvite, FieldOptions, InviteLink, UserType } from 'lib/models'
import { HStack, Button, Box, Text, VStack, useClipboard, useToast } from '@chakra-ui/react'
import { FieldInput, FieldSelect } from 'components/forms'
import Page from 'components/Page'
import { GetServerSideProps } from 'next'
import { baseUrl } from '../../lib/config'

export const getServerSideProps: GetServerSideProps = async (_context) => {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const userTypeOptions = await getFieldOptions('user_type')
  const exclude: UserType[] = ['subscriber', 'reject', 'staff', 'big_brother', 'admin']
  return {
    props: {
      userTypeOptions: userTypeOptions.filter(
        (o: { value: string }) => !exclude.includes(o.value as any)
      ),
    },
  }
}

type PageProps = {
  userTypeOptions: FieldOptions
}

function Invite({ userTypeOptions }: PageProps) {
  const { loading, member } = useUser()
  return (
    <Page title="Invite Someone" loading={loading} sectionClass="" requireAuth={true}>
      {member && <Form userTypeOptions={userTypeOptions} />}
    </Page>
  )
}

function Form({ userTypeOptions }: PageProps) {
  const { loading, member } = useUser()
  const toast = useToast()
  const { setValue, hasCopied } = useClipboard('')
  const [link, setLink] = useState<string>()
  const methods = useForm<InviteLink & { t: MemberLevel }>({
    mode: 'onBlur',
  })

  const { handleSubmit, setError, reset, getFieldState, formState } = methods

  useEffect(() => {}, [loading, member])

  const getLink = ({ e, t }: UserInvite) => {
    if (!member) return
    const data = Buffer.from(JSON.stringify({ e, t, v: member?.id })).toString('base64')
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

  const onSubmit = async (data: InviteLink & { t: MemberLevel }) => {
    if (!member) {
      setError('email', { message: 'Member not found' })
    }
    const inviteLink = getLink({
      e: data.email,
      t: data.t,
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

          {member?.user_type == 'staff' && (
            <FieldSelect bg="primary.50" field="t" label="Level" options={userTypeOptions} />
          )}

          <input type="hidden" name="link" defaultValue={link} />
          <input type="hidden" name="v" defaultValue={member?.id} />
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
