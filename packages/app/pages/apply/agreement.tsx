import ApplicationSteps from './_steps'
import { useUser } from '@/hooks/use-user'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AgreementData, ApplicationStatus, Member, MemberLevel } from 'lib/models'
import { Box, Button, Text } from '@chakra-ui/react'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { postJSON } from 'lib/utils'
import Page from 'components/Page'
import { useRouter } from 'next/router'

function Agreement() {
  const { loading, member, reload } = useUser(MemberLevel.applicant, ApplicationStatus.agreement)

  return (
    <Page
      title="Agreement"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'agreement'} />}
    >
      <Form reload={reload} />
    </Page>
  )
}

function Form({ reload }: { reload: () => Promise<Member> }) {
  const router = useRouter()
  const [completed, setCompleted] = useState(false)
  const methods = useForm<AgreementData>({
    mode: 'onBlur',
  })
  const { handleSubmit, setError, watch } = methods

  async function onSubmit(data: AgreementData) {
    const { success, error } = await postJSON('/api/apply/agree', data)

    if (success) {
      setCompleted(true)
      reload().then(() => {
        router.push('/apply/approved')
      })
    } else if (error?.field) {
      setError(error!.field as any, error.message as any)
    } else {
      setError('agree', { message: 'Something went wrong' })
    }
  }
  const agree = watch('agree')
  return (
    !completed && (
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ maxWidth: 'xl', margin: '0 auto', textAlign: 'center' }}
        >
          <Text textAlign="center" fontSize="xl">
            Please read and agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              style={{ textDecoration: 'underline' }}
              className="link"
            >
              terms
            </a>{' '}
            and{' '}
            <a
              href="/terms"
              target="_blank"
              style={{ textDecoration: 'underline' }}
              className="link"
            >
              privacy policy.
            </a>
            By entering this site, you commit to keep all user information confidential and not to
            share it with any third parties. You also agree to not use this site for any illegal
            purposes.
          </Text>
          <Box w="100px" mx="auto" mt={4}>
            <FieldCheckbox
              textAlign="center"
              field="agree"
              registerOptions={{
                required: 'You must agree to the terms and conditions',
              }}
            >
              I agree
            </FieldCheckbox>
          </Box>

          <Button colorScheme="primary" type="submit" mt={8} disabled={agree != true}>
            Agree & Continue
          </Button>
        </form>
      </FormProvider>
    )
  )
}

export default Agreement
