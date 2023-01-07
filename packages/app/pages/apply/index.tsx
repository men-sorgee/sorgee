import { FormProvider, useForm } from 'react-hook-form'
import { postJSON, pruneUndefined } from 'lib/utils'
import { useEffect, useState } from 'react'
import { getFieldOptions } from 'lib/services/directus/server'
import { useMember } from 'hooks/use-member'
import { NextRouter, useRouter } from 'next/router'
import { Applicant, FormOptions, Profile } from 'lib/models'
import {
  FieldCheckbox,
  FieldInput,
  FieldSelect,
  FieldWrapper,
  FieldText,
  FieldCheckboxes,
  FieldNumber,
} from 'components/forms'
import {
  Alert,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  AlertIcon,
  HStack,
  SimpleGrid,
  GridItem,
  Heading,
  Text,
} from '@chakra-ui/react'
import ApplicationSteps from './_steps'
import { LightBulbIcon, SupportIcon } from '@heroicons/react/solid'
import Page from 'components/Page'
import { useSession } from 'next-auth/react'

export type PageProps = {
  email?: string
  invite?: string
  spectrumOptions: FormOptions
  relationshipOptions: FormOptions
  timeOfDayOptions: FormOptions
  positionsOptions: FormOptions
  skinToneOptions: FormOptions
  page?: string
  setComplete: (complete: boolean) => void
  applicant?: Applicant
  router: NextRouter
  member: Profile
  setFormError: (error: string) => void
}

export const getServerSideProps = async () => {
  const props: Partial<PageProps> = {
    spectrumOptions: await getFieldOptions('spectrum'),
    relationshipOptions: await getFieldOptions('relationship_status'),
    timeOfDayOptions: await getFieldOptions('event_availability'),
    positionsOptions: await getFieldOptions('my_positions'),
    skinToneOptions: await getFieldOptions('skin_tone'),
  }
  return { props }
}

function Apply(props: PageProps) {
  const { data: session, status } = useSession()
  const [formError, setFormError] = useState<string>()
  const [loading] = useState(status !== 'loading')
  const router = useRouter()
  useEffect(() => {
    if (!loading) {
      if (status === 'unauthenticated') {
        setFormError(`You must login before you can register.`)
      } else if (props.email && session.user.email != props.email)
        setFormError(
          `You must login using the email address ${props.email} to use this invite. Please logout and try again.`
        )
    }
  }, [session, status])

  const intro = props.invite
    ? `You've been invited to join our community! While your application is pre-approved, we still need to perform a few verification steps.`
    : 'To apply for membership, complete this application. A member of our team will review your application and contact you with next steps.'

  const data = { ...props, setFormError }
  return (
    <Page
      title="Registration"
      loading={loading}
      requireAuth={true}
      header={<ApplicationSteps status={'apply'} />}
    >
      <>
        <Text fontSize={'xl'}>{intro}</Text>
        <Text fontSize={'xl'} pb={4}>
          This is a private group, not open to the public. There is a vouching, vetting and
          verification process for everyone. We do this to ensure the safety of our group and to
          filter out liars, spammers, bots, and flakes.
        </Text>
        {(formError && (
          <Alert status="error">
            <AlertIcon />
            {formError}
          </Alert>
        )) ||
          (session && <Form {...data} />)}
      </>
    </Page>
  )
}

function Form(props: PageProps) {
  const { data: session } = useSession()
  const { user } = session || {}
  const { member: applicant } = useMember()
  const router = useRouter()
  const {
    invite,
    spectrumOptions,
    positionsOptions,
    relationshipOptions,
    skinToneOptions,
    timeOfDayOptions,
    setFormError,
  } = props
  const { name, email } = user!
  const methods = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      nickname: applicant?.nickname || name,
      first_name: applicant?.first_name || name?.split(' ')[0] || name,
      last_name: applicant?.last_name || name?.split(' ')[1] || '',
      email,
      email_verified: user?.email_verified || false,
      phone: applicant?.phone || '',
      biography: applicant?.biography || null,
      needs_guidance: applicant?.needs_guidance || false,
      spectrum: applicant?.spectrum || 'bisexual',
      relationship_status: applicant?.relationship_status || 'single',
      event_availability: [],
      age: applicant?.age || null,
      height_feet: applicant?.height?.toString().substring(0, 1),
      height_inches: applicant?.height?.toString().substring(2),
      weight: applicant?.weight || null,
      skin_tone: applicant?.skin_tone || null,
      my_positions: applicant?.my_positions || [],
      invite,
    },
  })
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = methods

  async function onSubmit(data: any) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet} ${data.height_inches}`
    }
    const [ok, response] = await postJSON('/api/member/apply', pruneUndefined(data))

    if (ok) {
      router.push('/apply/verify')
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any)
    } else {
      setFormError('Something went wrong')
    }
  }

  const required = { value: true, message: 'This field is required' }
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="text-left">
          <Heading as="h3">Private Information</Heading>
          <Text>
            We collect this information for verification purposes only. We will not share, show or
            sell this information to anyone.
          </Text>
          <SimpleGrid gap={4} py={4} columns={{ base: 1, md: 2 }}>
            <FieldInput field="first_name" label="First Name" registerOptions={{ required }} />
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
                  value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                  message: 'US numbers only. Format: 123 456 7890',
                },
              }}
              placeholder="000 456 7890"
            />
          </SimpleGrid>
          <Heading as="h3">About You</Heading>
          <Text>
            <strong>Please be as honest as possible.</strong> Honest answers will help your chances
            of approval and help our AI create the perfect group events!
          </Text>
          <SimpleGrid gap={4} py={4} columns={{ base: 1, md: 2 }}>
            <GridItem colSpan={2}>
              <FieldInput field="nickname" label="Nickname" registerOptions={{ required }} />
            </GridItem>
            <FieldSelect
              field="spectrum"
              label="Orientation"
              registerOptions={{ required }}
              formOptions={spectrumOptions}
            />

            <FieldSelect
              field="relationship_status"
              label="Relationship Status"
              formOptions={relationshipOptions}
            />

            <SimpleGrid gap={4} py={4} columns={{ base: 1, md: 2 }}>
              <FieldNumber
                field="age"
                label="Age"
                type="number"
                help="Must be 21+ to apply. We verify ages at events."
                registerOptions={{
                  required,
                  min: {
                    value: 21,
                    message: 'Must be 21+ to apply.',
                  },
                }}
                min={21}
              />

              <FieldWrapper field="height" label="Height">
                <HStack>
                  <NumberInput>
                    <NumberInputField
                      id="height_feet"
                      className="input  !rounded-r-none"
                      {...register('height_feet')}
                      placeholder="feet"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <NumberInput>
                    <NumberInputField
                      id="height_inches"
                      className="input  !rounded-l-none"
                      {...register('height_inches')}
                      placeholder="inches"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </HStack>
              </FieldWrapper>
            </SimpleGrid>
            <SimpleGrid gap={4} py={4} columns={{ base: 1, md: 2 }}>
              <FieldInput field="weight" label="Weight" type="number" />

              <FieldSelect field="skin_tone" label="Skin Tone" formOptions={skinToneOptions} />
            </SimpleGrid>
            <GridItem colSpan={2}>
              <FieldText
                field="biography"
                label="Biography"
                help="Tell us about yourself. What are your interests? What are you looking for?"
                rows={4}
              />
            </GridItem>
          </SimpleGrid>

          <Heading as="h3">Event Preferences</Heading>
          <Text>
            We currently coordinate events in Denver, for the following times bi-monthly. We try to
            create events that can include new members, however, we do not guarantee that you will
            be included in every event. As the group grows, so too will the number of events we can
            create.
          </Text>
          <SimpleGrid gap={4} py={4} columns={1}>
            <FieldCheckboxes
              field="event_availability"
              label="Preferred Event Times"
              help="We host events to meet the demands of our brothers. Let us know what times work best in general"
              formOptions={timeOfDayOptions}
            />

            <Heading as="h3">Sexual Preferences</Heading>

            <FieldCheckboxes
              field="my_positions"
              label="Your Positions"
              help="What positions or acts are you interested in? We will use this to match you with compatible brothers. Select all that apply"
              formOptions={positionsOptions}
            />
            <Heading as="h3">Assistance</Heading>
            <Text>
              We want you to be comfortable. Check this and we will help guide you along the way.
              Unsure how to answer the above questions, or just new to this? Just check this box and
              we will help you out.
            </Text>
            <FieldCheckbox field="needs_guidance" label="I'd like some guidance" />
            <input type="hidden" {...register('invite')} />
          </SimpleGrid>
          <Button type="submit" mt={4} colorScheme={'primary'} disabled={isSubmitting}>
            Save & Continue
          </Button>
        </form>
      </FormProvider>
    </>
  )
}

// Protected route, checking member authentication client-side.(CSR)
export default Apply
