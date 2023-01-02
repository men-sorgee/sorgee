import { useMember } from 'hooks/use-member'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { copyTextToClipboard, postJSON } from '@/lib/utils'
import { MemberLevel, UserInvite } from 'lib/models'
import { getFieldOptions } from '@/lib/services/directus/server'
import { FormOptions, InviteLink } from 'lib/models'
import { HStack, Button, Text, VStack, Box, Link, useToast } from '@chakra-ui/react'
import { FieldInput, FieldSelect } from 'components/forms'
import Page from 'components/Page'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userTypeOptions = await getFieldOptions('user_type')
  const exclude = ['subscriber', 'user', 'reject', 'staff', 'big_brother']
  return {
    props: {
      userTypeOptions: userTypeOptions.filter((o: { value: string }) => !exclude.includes(o.value)),
    },
  }
}

type PageProps = {
  userTypeOptions: FormOptions
}

function Invite({ userTypeOptions }: PageProps) {
  const { loading, member } = useMember()
  return (
    <Page title="Invite Someone" loading={loading} sectionClass="" requireAuth={true}>
      <Text mb={10}>
        {member?.first_name || 'Brother'}, enter your friend&apos;s email address and we will create
        a special link for you to share.
      </Text>
      <Form userTypeOptions={userTypeOptions} />
    </Page>
  )
}

function Form({ userTypeOptions }: PageProps) {
  const { loading, member } = useMember()
  const toast = useToast()
  const [link, setLink] = useState<string>()
  const methods = useForm<InviteLink & { t: MemberLevel }>({
    mode: 'onBlur',
  })

  const { handleSubmit, setError, reset, getFieldState, formState } = methods

  useEffect(() => {}, [loading, member])

  const getLink = ({ e, t }: UserInvite) => {
    if (!member) return
    const data = Buffer.from(JSON.stringify({ e, t, v: member?.id })).toString('base64')
    const invite = `${location.protocol}//${location.host}/apply/${data}`
    setLink(invite)
    return invite
  }

  const onCopyClick = (e: any) => {
    e.preventDefault()
    const invite = getLink(e.target.dataset)
    if (!invite) return
    copyTextToClipboard(invite)
    toast({
      position: 'bottom-left',
      render: () => (
        <Box>
          The invite &nbsp;
          <Link title={link} target={'_blank'} href={link} className="link" rel="noreferrer">
            link
          </Link>
          &nbsp; has been copied to your clipboard.
        </Box>
      ),
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
    const [ok, response] = await postJSON('/api/member/invite', {
      ...data,
      link: inviteLink,
    })

    if (ok) {
      toast({
        position: 'bottom-left',
        render: () => (
          <Box>
            The invite{' '}
            <Link title={link} target={'_blank'} href={link} className="link" rel="noreferrer">
              link
            </Link>
            &nbsp; was sent.
          </Box>
        ),
      })
    } else {
      const { error } = response
      setError('email', { message: error?.message })
    }
  }
  const email = getFieldState('email', formState)

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="gradient">
          <VStack spacing={4}>
            <FieldInput
              field="email"
              type="email"
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
              <FieldSelect
                field="t"
                formOptions={userTypeOptions}
                registerOptions={{
                  required: {
                    value: true,
                    message: 'Please enter an email address',
                  },
                }}
              />
            )}
          </VStack>
          <input type="hidden" name="link" defaultValue={link} />
          <input type="hidden" name="v" defaultValue={member?.id} />
          <HStack spacing={4} mt={4}>
            <Button colorScheme="accent" type="submit" disabled={!member}>
              Send Invite
            </Button>
            {email.isTouched && <Button onClick={onCopyClick}>Copy Link</Button>}
          </HStack>
        </form>
      </FormProvider>
    </>
  )
}

export default Invite
