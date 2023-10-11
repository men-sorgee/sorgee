import { FieldInput, Page } from "components";
import { useUser } from "hooks/use-user";
import { InviteLink, Member, MemberLevel, UserInvite } from "lib/models";
import { postJSON } from "lib/utils/apis";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Alert, AlertIcon, Button, Text, useToast } from "@chakra-ui/react";

function Invite() {
  const { loading, member } = useUser({
    minLevel: MemberLevel.brother,
    redirectsEnabled: true,
  })
  return (
    <Page title="Invite a Trusted Buddy" loading={loading}>
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

  const { handleSubmit, setError, reset, watch, formState: { isSubmitting } } = methods



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

  const onSubmit = async ({ email }) => {

    const { success, error, data: { link } } = await postJSON<{ email: string }, { link: string }>('/api/members/invite', {
      email
    })

    if (success) {
      setLink(link)
      toast({
        title: 'Invite Link is Ready',
        description: 'Share the link with your buddy ' + email,
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } else {
      setError('email', { message: error?.message })
    }
  }
  const email = watch('email')

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
              title="Click to Copy"
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
              disabled={!member || isSubmitting}
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
