import { UserProfile, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { FormProvider, useForm } from 'react-hook-form';
import { NextPageContext } from 'next';
import { postJSON, pruneUndefined } from 'lib/utils';
import { useEffect, useState } from 'react';
import { getFieldOptions } from '@/lib/services/directus/server';
import { useAppUser } from 'lib/hooks/use-member';
import { NextRouter, useRouter } from 'next/router';
import { FormOptions } from 'lib/types';
import {
  FieldInput,
  FieldSelect,
  FieldWrapper,
  FieldText,
  FieldCheckboxes
} from 'components/forms';
import { Button } from 'react-daisyui';
import FieldCheckbox from 'components/forms/FieldCheckbox';
import ApplicationSteps from './_steps';
import { Applicant } from 'lib/services/directus';
import { LightBulbIcon, SupportIcon } from '@heroicons/react/solid';
import Page from 'components/layout/Page';

export type PageProps = {
  email?: string;
  invite?: string;
  spectrumOptions: FormOptions;
  relationshipOptions: FormOptions;
  timeOfDayOptions: FormOptions;
  positionsOptions: FormOptions;
  skinToneOptions: FormOptions;
  page?: string;
  setComplete: (complete: boolean) => void;
  applicant?: Applicant;
  router: NextRouter;
  user: UserProfile;
  setFormError: (error: string) => void;
};

export async function getServerSideProps(context: NextPageContext) {
  const props: Partial<PageProps> = {
    spectrumOptions: await getFieldOptions('spectrum'),
    relationshipOptions: await getFieldOptions('relationship_status'),
    timeOfDayOptions: await getFieldOptions('event_availability'),
    positionsOptions: await getFieldOptions('my_positions'),
    skinToneOptions: await getFieldOptions('skin_tone')
  };
  return { props };
}

function Apply(props: PageProps) {
  const { user, loading } = useAppUser();
  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    if (user && props.email && user.email != props.email)
      setFormError(
        `You must login using the email address ${props.email} to use this invite.`
      );

  }, [user, props.email]);

  const intro = props.invite
    ? 'You&apos;ve been invited to join our community! While your application is pre-approved, we still need to perform a few verification steps.'
    : 'To apply for membership, complete this application. A member of our team will review your application and contact you with next steps.';

  const data = { ...props, setFormError };
  return (
    <Page
      title="Registration"
      loading={loading}
      header={<ApplicationSteps status={'apply'} />}
    >
      <>
        {formError && <p className="text-red-700">{formError}</p>}
        <p className="text-xl">{intro}</p>
        <p className="text-xl">
          Membership is free, but not everyone can join. There is a vouching and
          verification process for all new members. We do this to ensure the
          safety of our members and to weed out any liars, spammers, bots, or
          flakes.
        </p>
        {formError && <p className="text-red-700">{formError}</p>}
        <Form {...data} />
      </>
    </Page>
  );
}

function Form(props: PageProps) {
  const { member: applicant, user } = useAppUser();
  const router = useRouter();
  const {
    invite,
    spectrumOptions,
    positionsOptions,
    relationshipOptions,
    skinToneOptions,
    timeOfDayOptions,
    setFormError
  } = props;
  const { name, email } = user!;
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
      spectrum: applicant?.spectrum || null,
      relationship_status: applicant?.relationship_status || null,
      event_availability: [],
      age: applicant?.age || null,
      height_feet: applicant?.height?.toString().substring(0, 1),
      height_inches: applicant?.height?.toString().substring(2),
      weight: applicant?.weight || null,
      skin_tone: applicant?.skin_tone || null,
      my_positions: applicant?.my_positions || [],
      invite
    }
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = methods;

  async function onSubmit(data: any) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet} ${data.height_inches}`;
    }
    const [ok, response] = await postJSON(
      '/api/admin/apply',
      pruneUndefined(data)
    );

    if (ok) {
      router.push('/apply/verify');
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any);
    } else {
      setFormError('Something went wrong');
    }
  }

  const required = { value: true, message: 'This field is required' };
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-4xl text-left"
        >
          <h3>Private Information</h3>
          <p>
            We collect this information for verification purposes only. We will
            not share, show or sell this information to anyone.
          </p>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldInput
              field="first_name"
              label="First Name"
              registerOptions={{ required }}
            />
            <FieldInput
              field="last_name"
              label="Last Name"
              registerOptions={{ required }}
            />
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
                  message: 'US numbers only. Format: 123 456 7890'
                }
              }}
              placeholder="000 456 7890"
            />
          </div>
          <h3>About You</h3>
          <p>
            <strong>Please be as honest as possible.</strong> Honest answers
            will help your chances of approval and help our AI create the
            perfect group events!
          </p>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <FieldInput
              field="nickname"
              label="Nickname"
              className="col-span-2"
              registerOptions={{ required }}
            />

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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldInput
                field="age"
                label="Age"
                type="number"
                help="Must be 21+ to apply. We verify ages at events."
                registerOptions={{
                  required,
                  min: {
                    value: 21,
                    message: 'Must be 21+ to apply.'
                  }
                }}
                min={21}
              />

              <FieldWrapper field="height" label="Height">
                <div className="flex">
                  <input
                    type="number"
                    id="height_feet"
                    className="input  !rounded-r-none"
                    {...register('height_feet')}
                    placeholder="feet"
                  />
                  <input
                    type="number"
                    id="height_inches"
                    className="input  !rounded-l-none"
                    {...register('height_inches')}
                    placeholder="inches"
                  />
                </div>
              </FieldWrapper>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FieldInput field="weight" label="Weight" type="number" />

              <FieldSelect
                field="skin_tone"
                label="Skin Tone"
                formOptions={skinToneOptions}
              />
            </div>
            <FieldText
              className="col-span-2"
              field="biography"
              label="Biography"
              help="Tell us about yourself. What are your interests? What are you looking for?"
              rows={4}
              placeholder="I am a bit shy, but love to get aggressive in bed."
            />
          </div>
          <h3>Event Preferences</h3>
          <p>
            We currently coordinate events in Denver, for the following times
            bi-monthly. We try to create events that can include new members,
            however, we do not guarantee that you will be included in every
            event. As the group grows, so too will the number of events we can
            create.
          </p>

          <div className="mb-8 grid grid-cols-1 gap-4">
            <FieldCheckboxes
              field="event_availability"
              label="Preferred Event Times"
              help="We host events to meet the demands of our brothers. Let us know what times work best in general"
              formOptions={timeOfDayOptions}
            />
          </div>
          <p className="alert text-xs">
            <LightBulbIcon className="w-10" />
            Members who RSVP to events are expected to attend. Members that RSVP
            to event and do not attend, decrease the likelihood of getting
            invited again. We understand that things come up, but please be
            respectful of your brothers and RSVP accurately and let us know if
            you can&apos;t make it.
          </p>
          <h3>Sexual Preferences</h3>
          <div className="mb-8 grid grid-cols-1 gap-4">
            <FieldCheckboxes
              field="my_positions"
              label="Your Positions"
              help="What positions or acts are you interested in? We will use this to match you with compatible brothers. Select all that apply"
              formOptions={positionsOptions}
            />

            <FieldCheckbox
              field="needs_guidance"
              label="I'd like some guidance"
              help=""
            >
              <p className="align-start alert justify-start text-xs">
                <SupportIcon className="w-10" />
                We want you to be comfortable. Check this and we will help guide
                you along the way. Unsure how to answer the above questions, or
                just new to this? Just check this box and we will help you out.
              </p>
            </FieldCheckbox>
          </div>

          <input type="hidden" {...register('invite')} />

          <Button
            type="submit"
            className="mt-2"
            color={'primary'}
            disabled={isSubmitting}
          >
            Save & Continue
          </Button>
        </form>
      </FormProvider>
    </>
  );
}

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Apply);
