import { signIn, useSession } from 'next-auth/react'
import { Button, GridItem, Heading, SimpleGrid, useToast } from '@chakra-ui/react'
import Page from 'components/Page'
import { ApiError, FieldOptions, Promo, SignUpForm, User } from 'lib/models'
import { useSite } from 'hooks/use-site'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { ConnectForm, FieldInput, FieldSelect, Form } from 'components/forms'
import { postJSON } from 'lib/utils'
import { Markdown } from 'components/controls'
import { useRouter } from 'next/router'
import { pages } from 'lib/config'

export type Props = {
  promo?: Promo
  birthMonthOptions: FieldOptions
  markdown: string
}

export async function getServerSideProps() {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const birthMonthOptions = await getFieldOptions<User>('birth_month')
  const { getPageById } = await import('lib/services/directus/static')
  const page = await getPageById(pages.registrationPage)
  const { markdown } = page

  return { props: { birthMonthOptions, markdown } }
}

export default function Register({ promo, birthMonthOptions, markdown }: Props) {
  const { site, loading } = useSite()
  const toast = useToast()
  const router = useRouter()
  const { status, data: session } = useSession()
  const { user } = session || {}
  const { email } = user || {}

  useEffect(() => {
    if (!loading && site && site.invite_only && !promo) {
      toast({
        title: 'Invalid Promo Code',
        description: 'The promo code you entered is invalid.',
        status: 'error',
        duration: 1000,
        isClosable: true,
        onCloseComplete: () => {
          router.push('/')
        },
      })
    }
    if (status == 'authenticated') {
      router.push('/apply')
    }
  }, [loading, promo, router, site, status, toast])

  const required = {
    required: 'This field is required',
  }

  const onSubmit = async (data: SignUpForm): Promise<[SignUpForm, ApiError]> => {
    const { data: response, error } = await postJSON<SignUpForm>('/api/apply/register', data)
    return [response, error]
  }

  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21

  return (
    <Page title="Register" loading={loading}>
      <Heading size="lg" maxW="xl">
        Use the form below to enter your email address and basic info to register.
      </Heading>
      <Markdown content={markdown} />
      <Form<SignUpForm>
        defaultValues={{
          promo: promo?.code,
          email,
        }}
        onSuccess={() => {
          signIn(null, {
            callbackUrl: '/apply',
          })
        }}
        onSubmit={onSubmit}
        successMessage={'Your account has been created.'}
      >
        <ConnectForm>
          {({ register, formState: { isDirty, isSubmitting } }) => (
            <>
              <SimpleGrid columns={[1, 2]} spacing={4}>
                <FieldInput field="first_name" label="First Name" registerOptions={required} />
                <FieldInput field="last_name" label="Last Name" />
                <GridItem colSpan={[1, 2]}>
                  <FieldInput type="email" field="email" label="Email" registerOptions={required} />
                </GridItem>
                <FieldSelect
                  field="birth_month"
                  label="Birth Month"
                  options={birthMonthOptions}
                  registerOptions={required}
                />
                <FieldInput
                  type="number"
                  field="birth_year"
                  label="Birth Year"
                  min={minYear}
                  max={maxYear}
                  registerOptions={required}
                />
                <input type="hidden" {...register('promo')} />
              </SimpleGrid>
              {promo?.code && (
                <>
                  <Heading>
                    Promo Code: <strong>{promo?.code}</strong>
                  </Heading>
                  <Markdown content={promo?.description} />
                </>
              )}
              <Button color="accent" type="submit" mt={4}>
                Start Application
              </Button>
            </>
          )}
        </ConnectForm>
      </Form>
    </Page>
  )
}
