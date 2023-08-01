import { useEffect, useState } from 'react'

import {
  Form,
  FieldCheckbox,
  FieldCheckboxes,
  FieldInput,
  FieldSelect,
  FieldText,
  FieldWrapper
} from 'components/forms'
import Page from 'components/Page'
import { useSite, useUser } from 'hooks'
import { pages } from 'lib/config'
import {
  Applicant,
  ApplicationStatus,
  FieldOptions,
  Member,
  MemberLevel,
  Profile,
  Promo,
  UserInvite
} from 'lib/models'
import { postJSON, pruneUndefined } from 'lib/utils'
import { signIn, useSession } from 'next-auth/react'
import { NextRouter, useRouter } from 'next/router'

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightAddon,
  SimpleGrid,
  Text
} from '@chakra-ui/react'

import { BusyButton, Markdown } from 'components/controls'
import ApplicationSteps from './_steps'

export type PageProps = {
  invite?: UserInvite
  spectrumOptions: FieldOptions
  relationshipOptions: FieldOptions
  timeOfDayOptions: FieldOptions
  positionsOptions: FieldOptions
  skinToneOptions: FieldOptions
  birthMonthOptions: FieldOptions
  page?: string
  setComplete: (complete: boolean) => void
  router: NextRouter
  member: Profile
  setFormError: (error: string) => void
  promo?: Promo
  markdown: string
}

export const getServerSideProps = async (_context) => {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const { getPageById } = await import('lib/services/directus/static')
  const page = await getPageById(pages.applyPage)
  const { markdown } = page
  const props: Partial<PageProps> = {
    spectrumOptions: await getFieldOptions('spectrum'),
    relationshipOptions: await getFieldOptions('relationship_status'),
    timeOfDayOptions: await getFieldOptions('event_availability'),
    positionsOptions: await getFieldOptions('my_positions'),
    skinToneOptions: await getFieldOptions('skin_tone'),
    birthMonthOptions: await getFieldOptions('birth_month'),
    markdown
  }
  return { props }
}

function Apply({ promo, invite, markdown, ...props }: PageProps) {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      signIn()
    }
  })
  const {
    member: user,
    loading,
    reload
  } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.apply,
    redirectsEnabled: true
  })

  const [formError, setFormError] = useState<string>()

  const router = useRouter()
  const { site } = useSite()

  useEffect(() => {
    if (!loading && user) {
      const { email } = user
      if (
        invite &&
        invite.e &&
        invite.e.toLowerCase() != email?.toLowerCase()
      ) {
        setFormError(
          `You must login using the email address ${invite.e} to use this invite, not ${email}. Please logout and try again.`
        )
      }
    }
  }, [invite, loading, promo, user, router, site, status])

  const intro = invite
    ? `You've been invited to join our community! You have been vouched for, but we still need to perform a few verification steps.`
    : 'To apply for membership, complete this application. A member of our team will review your application and contact you with next steps.'

  const data: Omit<PageProps, 'markdown'> = {
    invite,
    promo,
    ...props,
    setFormError
  }
  return (
    <Page
      title="Registration"
      loading={loading}
      header={<ApplicationSteps status={'apply'} />}
    >
      <>
        <Text fontSize={'xl'}>{intro}</Text>
        <Box pb={4}>
          <Markdown content={markdown} size={'xl'} />
        </Box>
        {(formError && (
          <Alert status="error">
            <AlertIcon />
            {formError}
          </Alert>
        )) ||
          (user && <ApplyForm {...data} user={user} reload={reload} />)}
      </>
    </Page>
  )
}

type ApplyFormProps = Pick<
  Applicant,
  | 'nickname'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'email_verified'
  | 'phone'
  | 'biography'
  | 'needs_guidance'
  | 'spectrum'
  | 'relationship_status'
  | 'event_availability'
  | 'birth_month'
  | 'birth_year'
  | 'height'
  | 'weight'
  | 'skin_tone'
  | 'my_positions'
  | 'invite'
> & {
  height_feet: string
  height_inches: string
}

function ApplyForm({
  user,
  reload,
  invite,
  spectrumOptions,
  positionsOptions,
  relationshipOptions,
  birthMonthOptions,
  setFormError
}: Omit<PageProps, 'markdown'> & {
  user: Applicant
  reload: () => Promise<Member>
}) {
  const router = useRouter()

  const minYear = new Date().getFullYear() - 100
  const maxYear = new Date().getFullYear() - 21
  const required = { value: true, message: 'This field is required' }
  return (
    <>
      <Heading as="h3" size="h3">
        Private Information
      </Heading>
      <Text>
        We collect this information for verification purposes only. We will not
        share, show or sell this information to anyone.
      </Text>
      <Form<ApplyFormProps>
        defaultValues={{
          nickname: user?.nickname || user.first_name || '',
          first_name: user?.first_name || '',
          last_name: user?.last_name || '',
          email: user?.email || '',
          email_verified: user?.email_verified || false,
          phone: user?.phone || '',
          biography: user?.biography || null,
          needs_guidance: user?.needs_guidance || false,
          spectrum: user?.spectrum || 'bisexual',
          relationship_status: user?.relationship_status || 'single',
          event_availability: [],
          birth_month: user?.birth_month || null,
          birth_year: user?.birth_year || null,
          height_feet: user?.height?.toString().substring(0, 1),
          height_inches: user?.height?.toString().substring(2),
          weight: user?.weight || null,
          skin_tone: user?.skin_tone || null,
          my_positions: user?.my_positions || [],
          invite
        }}
        onSubmit={(data: ApplyFormProps) => {
          if (data.height_feet || data.height_inches) {
            data.height = `${data.height_feet} ${data.height_inches}`
          }
          return postJSON('/api/apply', pruneUndefined(data))
        }}
        onSuccess={() => {
          reload().then(() => {
            router.push('/apply/verify')
          })
        }}
      >
        {({ register }) => (
          <>
            <SimpleGrid gap={4} py={4} columns={{ base: 1, md: 2 }}>
              <FieldInput
                field="first_name"
                label="First Name"
                registerOptions={{ required }}
              />
              <FieldInput field="last_name" label="Last Name" />
              <FieldInput
                field="email"
                label="Email"
                type="email"
                registerOptions={{ required }}
                readOnly={true}
              />
              <FieldInput
                field="phone"
                label="Mobile Phone"
                help="Must be SMS-enabled. Used for optional verification or optional event reminders. Format: 123 456 7890"
                registerOptions={{
                  pattern: {
                    value:
                      /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                    message: 'US numbers only. Format: 123 456 7890'
                  }
                }}
                placeholder="000 456 7890"
              />
            </SimpleGrid>
            <Heading as="h3" size="h3">
              About You
            </Heading>
            <Text>
              <strong>Be as honest as possible.</strong> Honest answers will
              help your chances of approval and help our AI create the perfect
              group events!
            </Text>
            <SimpleGrid spacing={4} mt={4} columns={[1, 2]}>
              <GridItem colSpan={{ base: 1, sm: 2 }}>
                <FieldInput field="nickname" label="Nickname" />
              </GridItem>
              <FieldSelect
                field="spectrum"
                label="Orientation"
                options={spectrumOptions}
              />
              <FieldSelect
                field="relationship_status"
                label="Relationship Status"
                options={relationshipOptions}
              />
            </SimpleGrid>
            <SimpleGrid spacing={4} mt={4} columns={{ base: 1, sm: 2, md: 4 }}>
              <FieldSelect
                field="birth_month"
                label="Birth Month"
                options={birthMonthOptions}
                registerOptions={{
                  required: 'You must provide your month of birth'
                }}
              />
              <FieldInput
                type="number"
                label="Birth Year"
                field="birth_year"
                min={minYear}
                max={maxYear}
                defaultValue={maxYear - 10}
                registerOptions={{
                  required: 'You must provide your year of birth'
                }}
              />
              <FieldWrapper field="weight" label="Weight">
                <InputGroup>
                  <Input type="number" {...register('weight')} />
                  <InputRightAddon mr={2}>#</InputRightAddon>
                </InputGroup>
              </FieldWrapper>

              <FieldWrapper field="height" label="Height">
                <InputGroup>
                  <Input
                    type="number"
                    id="height_feet"
                    {...register('height_feet')}
                  />
                  <InputRightAddon mr={2}>&apos;</InputRightAddon>
                  <Input
                    type="number"
                    id="height_inches"
                    {...register('height_inches')}
                  />
                  <InputRightAddon>&quot;</InputRightAddon>
                </InputGroup>
              </FieldWrapper>
            </SimpleGrid>
            <SimpleGrid gap={4} py={4} columns={{ base: 1, md: 2 }}>
              <GridItem colSpan={2}>
                <FieldText
                  field="biography"
                  label="Biography"
                  help="Tell us about yourself. What are your interests? What are you looking for?"
                  rows={4}
                />
              </GridItem>
            </SimpleGrid>

            <Heading as="h3" size="h3">
              Sexual Preferences
            </Heading>
            <SimpleGrid gap={4} py={4} columns={1}>
              <FieldCheckboxes
                field="my_positions"
                label="Your Positions"
                help="What positions or acts are you interested in? We will use this to match you with compatible brothers. Select all that apply"
                options={positionsOptions}
              />
              <Heading as="h3" size="h3">
                Assistance
              </Heading>
              <Text>
                We want you to be comfortable. Check this and we will help guide
                you along the way. Unsure how to answer the above questions, or
                just new to this? Just check this box and we will help you out.
              </Text>
              <FieldCheckbox
                field="needs_guidance"
                label="I'd like some guidance"
              />
              <input type="hidden" {...register('invite')} />
            </SimpleGrid>
            <BusyButton type="submit" mt={4} bg="accent.500">
              Save & Continue
            </BusyButton>
          </>
        )}
      </Form>
    </>
  )
}

// Protected route, checking member authentication client-side.(CSR)
export default Apply
