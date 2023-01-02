import ApplicationSteps from './_steps'
import { useMember } from 'hooks/use-member'
import { NextRouter, useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AgreementData } from 'lib/models'
import { Button, Text, VStack } from '@chakra-ui/react'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { postJSON } from '@/lib/utils'
import Page from 'components/Page'

function Agreement() {
  const router = useRouter()
  const { loading, member } = useMember()
  const [completed, setCompleted] = useState(false)

  if (member && member?.application_status && member.application_status !== 'agreement') {
    router.push('/apply/' + member?.application_status)
    return null
  }
  let props = { router, setCompleted }
  return (
    <Page
      title="Agreement"
      loading={loading || completed}
      requireAuth={true}
      header={<ApplicationSteps status={'agreement'} />}
    >
      <Form {...props} />
    </Page>
  )
}

type Props = {
  router: NextRouter
  setCompleted: Dispatch<SetStateAction<boolean>>
}

function Form({ router, setCompleted }: Props) {
  const methods = useForm<AgreementData>()
  const { handleSubmit, setError } = methods

  async function onSubmit(data: AgreementData) {
    const [success, response] = await postJSON('/api/member/agree', data)

    if (success) {
      setCompleted(true)
      router.push('/apply/approved')
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any)
    } else {
      setError('agree', { message: 'Something went wrong' })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 'xl', margin: '0 auto' }}>
        <VStack alignItems="center" justifyItems="middle">
          <Text fontSize="xl" maxWidth="50%">
            Please read and agree to our{' '}
            <a href="/terms" target="_blank" className="link">
              {' '}
              terms and conditions
            </a>
          </Text>
          <FieldCheckbox
            field="agree"
            label="I agree to the terms and conditions"
            maxWidth="fit-content"
            registerOptions={{
              required: {
                value: true,
                message: 'You must agree to the terms and conditions',
              },
            }}
          />

          <Button colorScheme="primary" type="submit">
            Agree & Continue
          </Button>
        </VStack>
      </form>
    </FormProvider>
  )
}

export default Agreement
