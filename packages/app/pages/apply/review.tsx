import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/router'
import ApplicationSteps from './_steps'
import Page from 'components/Page'
import { Text, Heading, VStack, Button, Box, Alert } from '@chakra-ui/react'
import { FieldRadioButtons } from 'components/forms'
import { useForm, FormProvider } from 'react-hook-form'
import { postJSON } from 'lib/utils'
import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Member, MemberLevel, ApplicationStatus } from 'lib/models'

function Review() {
  const router = useRouter()
  const [complete, setComplete] = useState<boolean>(false)
  const { loading, member } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.review,
  })

  useEffect(() => {
    if (!loading && member) {
      if (member.contact_preference) {
        setComplete(true)
      }
      const status = ApplicationStatus[member.application_status]
      if (status != ApplicationStatus.review) {
        router.push('/apply/' + member.application_status)
      }
    }
  }, [loading, member, router])

  const methods = useForm<{ contact_preference: string }>({
    mode: 'onBlur',
    defaultValues: {
      contact_preference: member?.contact_preference || 'email',
    },
  })
  const { setError } = methods
  const toast = useToast()
  const onSubmit = async ({ contact_preference }) => {
    const { success, error } = await postJSON('/api/member/me', { contact_preference })
    if (success) {
      toast({
        title: 'Application Submitted',
        description: 'Your application has been submitted for review.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      setComplete(true)
    } else if (error?.field) {
      setError(error!.field as any, error.message as any)
    }
  }

  return (
    <Page
      title="Verification Review"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'review'} />}
    >
      <Box>
        <Heading as="h1" size="h1">
          Watch your inbox!
        </Heading>
        <Heading as="h2" size="xl" pt={16}>
          One of our brothers will be in touch with you for final verification.{' '}
        </Heading>

        {!complete && (
          <>
            <Text fontSize="2xl" pt={16} mx="auto" w="full">
              How would you like to be contacted?
            </Text>

            <VStack alignItems="center" align="center" justify="middle" textAlign="center" mt={8}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                  <FieldRadioButtons
                    w="fit-content"
                    field="contact_preference"
                    registerOptions={{ required: 'Certification is Required' }}
                    options={[
                      { text: 'Email', value: 'email' },
                      { text: 'Phone', value: 'phone_call' },
                      { text: 'Text', value: 'phone_text' },
                    ]}
                  />
                  <Button type="submit" mt={8} size="lg" bgColor="accent.500">
                    Set Contact Preference
                  </Button>
                </form>
              </FormProvider>
            </VStack>
          </>
        )}
        {complete && (
          <>
            <Alert
              as="h4"
              color="white"
              my={8}
              status="success"
              justifyContent="center"
              py={8}
              rounded="lg"
              shadow="lg"
            >
              Your application is currently being reviewed by our team. You will receive an email
              with our decision within 7 days. <br />
              Thank you for your interest in our fraternity.
            </Alert>
          </>
        )}
      </Box>
    </Page>
  )
}
export default Review
