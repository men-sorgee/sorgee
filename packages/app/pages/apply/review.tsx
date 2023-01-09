import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import Page from 'components/Page'
import { Text, Heading, VStack } from '@chakra-ui/react'
import { FieldRadioButtons } from 'components/forms'
import { useForm, FormProvider } from 'react-hook-form'
import { postJSON } from 'lib/utils'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'

function Review() {
  const router = useRouter()
  const [complete, setComplete] = useState<boolean>(false)
  const { loading, member } = useMember()

  if (member && member?.application_status && member.application_status !== 'review') {
    router.push('/apply/' + member?.application_status)
    return null
  }

  const methods = useForm<{ contact_preference: string }>({
    mode: 'onBlur',
    defaultValues: {
      contact_preference: member?.contact_preference || 'email',
    },
  })
  const { setError } = methods
  const toast = useToast()
  const onSubmit = async ({ contact_preference }) => {
    const [ok, response] = await postJSON('/api/member/me', { contact_preference })
    if (ok) {
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted for review.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setComplete(true)
      return
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any)
    }
  }

  return (
    <Page
      title="Verification Review"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'review'} />}
    >
      <>
        <Heading as="h2" size="xl" pt={16}>
          One of our brothers will be in touch with you.
        </Heading>
        <Text fontSize="2xl" pt={16}>
          How would you like to be contacted?
        </Text>
        <VStack alignItems="center" align="center" justify="middle" textAlign="center" mt={8}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <FieldRadioButtons
                w="fit-content"
                field="contact_preference"
                registerOptions={{ required: 'Certification is Required' }}
                formOptions={[
                  { text: 'Email', value: 'email' },
                  { text: 'Phone', value: 'phone_call' },
                  { text: 'Text', value: 'phone_text' },
                ]}
              />
            </form>
          </FormProvider>
        </VStack>
        {complete && (
          <Text fontSize="2xl" maxW="2xl">
            Your application is currently being reviewed by our team. You will receive an email with
            our decision within 7 days.
          </Text>
        )}
      </>
    </Page>
  )
}
export default Review
