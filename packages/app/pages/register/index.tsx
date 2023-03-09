import { signIn } from 'next-auth/react'
import { Button, GridItem, Heading, SimpleGrid, useToast } from '@chakra-ui/react'
import Page from 'components/Page'
import { FieldOptions, Promo, SignUpForm, User } from 'lib/models'
import { useSite } from 'hooks/use-site'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { FieldInput, FieldSelect } from 'components/forms'
import { postJSON } from 'lib/utils'
import { Markdown } from 'components/controls'
import { useRouter } from 'next/router'

export type Props = {
  promo?: Promo
  birthMonthOptions: FieldOptions
}

export async function getServerSideProps() {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const birthMonthOptions = await getFieldOptions<User>('birth_month')

  return { props: { birthMonthOptions } }
}

export default function Register({ promo, birthMonthOptions }: Props) {
  const { site, loading } = useSite()
  const toast = useToast()
  const router = useRouter()

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
  }, [loading, promo, router, site, toast])

  const methods = useForm<SignUpForm>({
    mode: 'onBlur',
    defaultValues: {
      promo: promo?.code,
    },
  })
  const { setError, register } = methods
  const required = {
    required: 'This field is required',
  }

  const onSubmit = async (data: SignUpForm) => {
    const { success, error } = await postJSON('/api/apply/register', data)

    if (success) {
      toast({
        title: 'Success',
        description: 'Your account has been created.',
        status: 'success',
        duration: 1000,
        isClosable: true,
        onCloseComplete: () => {
          signIn('email', { email: data.email, callbackUrl: '/apply' })
        },
      })
    } else if (error) {
      setError((error!.field as any) || 'email', error.message as any)
    }
  }

  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21
  return (
    <Page title="Register" loading={loading}>
      <Heading size="lg" maxW="xl">
        Use the form below to enter your email address and basic info to register.
      </Heading>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
            Sign Up
          </Button>
        </form>
      </FormProvider>
    </Page>
  )
}
