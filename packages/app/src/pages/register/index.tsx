import { useEffect, useState } from 'react'

import { Markdown } from 'components/controls'
import { FieldInput, FieldSelect, Form } from 'components/forms'
import Page from 'components/Page'
import { useSite } from 'hooks/use-site'
import { pages } from 'lib/config'
import { FieldOptions, Promo, SignUpForm, User } from 'lib/models'
import { postJSON } from 'lib/utils'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Center,
  GridItem,
  Heading,
  SimpleGrid,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { set } from 'date-fns'

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

export default function Register({
  promo,
  birthMonthOptions,
  markdown
}: Props) {
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
        }
      })
    }
  }, [loading, promo, router, site, toast])

  const required = {
    required: 'This field is required'
  }

  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21

  const [submitted, setSubmitted] = useState<boolean>(false)

  return (
    <Page title="Register" loading={loading}>
      <Box mb={4}>
        <Markdown content={markdown} />
      </Box>

      {(!submitted && (
        <Form<SignUpForm>
          defaultValues={{
            promo: promo?.code
          }}
          onSubmit={(data) => {
            setSubmitted(true)
            return postJSON<SignUpForm>('/api/register', data)
          }}
          onSuccess={({ email }) => {
            signIn('email', {
              callbackUrl: '/apply',
              email
            })
          }}
          onError={(error) => {
            console.error(error)
            setSubmitted(false)
          }}
          successMessage={`Your account has been created. Check your email inbox for the sign-in link. (If you don't see the link, check your spam folder)`}
        >
          {({ register }) => (
            <>
              <SimpleGrid columns={[1, 2]} spacing={4}>
                <FieldInput
                  field="first_name"
                  label="First Name"
                  registerOptions={required}
                />
                <FieldInput field="last_name" label="Last Name" />
                <GridItem colSpan={[1, 2]}>
                  <FieldInput
                    type="email"
                    field="email"
                    label="Email"
                    registerOptions={required}
                    help="Email using Microsoft, Google, Yahoo or Twitter is recommended, for fastest authentication. Other email providers will be sent a link to login."
                  />
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
              <Button bg="accent.500" size="lg" type="submit" mt={4}>
                Start Application
              </Button>
            </>
          )}
        </Form>
      )) || (
        <Center>
          <Spinner />
        </Center>
      )}
    </Page>
  )
}
