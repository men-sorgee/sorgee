import { signIn } from 'next-auth/react'
import { Button, GridItem, Heading, SimpleGrid, useToast } from '@chakra-ui/react'
import Page from 'components/Page'
import { FormOptions, Promo, User } from 'lib/models'
import { findPromo, getFieldOptions } from 'lib/services/directus/server'
import { useSite } from 'hooks/use-site'
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { FieldInput, FieldSelect } from 'components/forms'
import { postJSON } from 'lib/utils'
import { Markdown } from 'components/ui'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type Props = {
  promo?: Promo
  birthMonthOptions: FormOptions
}

export async function getServerSideProps({ params }) {
  const birthMonthOptions = await getFieldOptions<User>('birth_month')
  const { code } = params
  if (!code) return { props: { birthMonthOptions } }

  const promo = await findPromo(code)
  if (!promo) return { props: { birthMonthOptions } }

  return {
    props: {
      promo,
      birthMonthOptions,
    },
  }
}

type SignUpForm = {
  first_name: string
  last_name: string
  birth_month: number
  birth_year: number
  email: string
  promo: string
}

export default function Register({ promo, birthMonthOptions }: Props) {
  const { site, loading } = useSite()
  const toast = useToast()
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/')
    }
    if (!loading && !promo) {
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
  }, [loading, promo, router, site, status, toast])

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
    const [ok, response] = await postJSON('/api/apply/register', data)

    if (ok) {
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
    } else if (response.error) {
      setError((response.error!.field as any) || 'email', response.error.message as any)
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
              formOptions={birthMonthOptions}
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
          <Heading>
            Promo Code: <strong>{promo?.code}</strong>
          </Heading>
          <Markdown content={promo?.description} />
          <Button color="accent" type="submit" mt={4}>
            Sign Up
          </Button>
        </form>
      </FormProvider>
    </Page>
  )
}
