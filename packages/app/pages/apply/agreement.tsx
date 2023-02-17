import ApplicationSteps from './_steps'
import { useUser } from '@/hooks/use-user'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AgreementData } from 'lib/models'
import { Button, Text, VStack } from '@chakra-ui/react'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { postJSON } from 'lib/utils'
import Page from 'components/Page'

function Agreement() {
  const router = useRouter()
  const { loading, member } = useUser()

  if (member && member?.application_status && member.application_status !== 'agreement') {
    router.push('/apply/' + member?.application_status)
    return null
  }

  return (
    <Page
      title="Agreement"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'agreement'} />}
    >
      <Form router={router} />
    </Page>
  )
}

type Props = {
  router: NextRouter
}

function Form({ router }: Props) {
  const [completed, setCompleted] = useState(false)
  const methods = useForm<AgreementData>({
    mode: 'onBlur',
  })
  const { handleSubmit, setError, watch } = methods

  async function onSubmit(data: AgreementData) {
    const { success, error } = await postJSON('/api/apply/agree', data)

    if (success) {
      setCompleted(true)
      router.push('/apply/approved')
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
          <Text fontSize="xl">
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
              privacy policy
            </a>
          </Text>
          <FieldCheckbox
            textAlign="center"
            field="agree"
            maxWidth="fit-content"
            registerOptions={{
              required: 'You must agree to the terms and conditions',
            }}
          >
            I agree
          </FieldCheckbox>

          <Button colorScheme="primary" type="submit" mt={8} disabled={agree != true}>
            Agree & Continue
          </Button>
        </form>
      </FormProvider>
    )
  )
}

export default Agreement
