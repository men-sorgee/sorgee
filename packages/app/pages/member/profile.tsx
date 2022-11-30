import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { FormProvider, useForm } from 'react-hook-form';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { Member } from 'lib/services/directus';
import { postJSON, pruneUndefined } from 'lib/utils';
import { getFieldOptions } from '@/lib/services/directus/server';
import { useAppUser } from 'lib/hooks/use-member';
import { FormOptions } from 'lib/types';
import { useEffect, useState } from 'react';
import {
  FieldInput,
  FieldSelect,
  FieldWrapper,
  FieldText,
  FieldCheckboxes
} from 'components/forms';
import { Button } from 'react-daisyui';
import Loading from '../../components/ui/Loading';

export type PageProps = {
  spectrumOptions: FormOptions;
  relationshipOptions: FormOptions;
  timeOfDayOptions: FormOptions;
  positionsOptions: FormOptions;
  skinToneOptions: FormOptions;
  scenesOptions: FormOptions;
};

export async function getServerSideProps(context: NextPageContext) {
  const props: PageProps = {
    spectrumOptions: await getFieldOptions<Member>('spectrum'),
    relationshipOptions: await getFieldOptions<Member>('relationship_status'),
    timeOfDayOptions: await getFieldOptions<Member>('event_availability'),
    positionsOptions: await getFieldOptions<Member>('my_positions'),
    skinToneOptions: await getFieldOptions<Member>('skin_tone'),
    scenesOptions: await getFieldOptions<Member>('sexual_scenes')
  };
  return { props };
}

function Profile(props: PageProps) {
  const { member, loading } = useAppUser();

  const data = { member, ...props };

  return (
    <>
      <Head>
        <title>Member Profile</title>
      </Head>
      <section className="sectionDark ">
        <h1>Member Profile</h1>

        {(loading && (
          <Loading>
            <h3>Loading</h3>
          </Loading>
        )) ||
          (member && <Form {...data} />)}
      </section>
    </>
  );
}

function Form(props: PageProps & { member?: Member }) {
  const {
    member,
    spectrumOptions,
    positionsOptions,
    relationshipOptions,
    skinToneOptions,
    timeOfDayOptions,
    scenesOptions
  } = props;
  const [updated, setUpdated] = useState(false);
  const methods = useForm({
    defaultValues: {
      ...member,
      height_feet: member?.height?.toString().substring(0, 1),
      height_inches: member?.height?.toString().substring(2)
    }
  });
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting }
  } = methods;

  useEffect(() => {
    if (updated) {
      setTimeout(() => setUpdated(false), 3000);
    }
  }, [updated]);

  async function onSubmit(data: any) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet}' ${data.height_inches}"`;
    }

    const [success, response] = await postJSON(
      '/api/admin/me',
      pruneUndefined(data)
    );

    if (success) {
      setUpdated(true);
      return;
    }

    if (Array.isArray(response.errors)) {
      response.errors.forEach((error) => {
        setError(error.extensions.field as any, { message: error.message });
      });
    }
  }
  const required = true;
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl text-left"
        >
          <h3>Private Information</h3>
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
          <h3 className="md:col-span-2">Your Member Profile</h3>
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
                help="Must be 21+ to apply. We verify ages at events."
                registerOptions={{
                  required,
                  min: {
                    value: 21,
                    message: 'Must be 21+ to apply.'
                  }
                }}
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
            <strong>Important:</strong> Members who RSVP to events are expected
            to attend. Members that RSVP to event and do not attend, decrease
            the likelihood of getting invited again. We understand that things
            come up, but please be respectful of your brothers and RSVP
            accurately and let us know if you can&apos;t make it.
          </p>
          <div className="mb-8 grid grid-cols-1 gap-4">
            <FieldCheckboxes
              field="event_availability"
              label="Preferred Event Times"
              help="We host events to meet the demands of our brothers. Let us know what times work best in general"
              formOptions={timeOfDayOptions}
            />
          </div>

          <h3>Sexual Preferences</h3>
          <div className="mb-8 grid grid-cols-1 gap-4">
            <FieldCheckboxes
              field="my_positions"
              label="Your Positions"
              help="What positions or acts are you interested in? We will use this to match you with compatible brothers. Select all that apply"
              formOptions={positionsOptions}
            />

            <FieldCheckboxes
              field="sexual_scenes"
              label="Your Scenes"
              help="What scenes are you interested in? We will use this to match you with compatible events. Select all that apply"
              formOptions={scenesOptions}
            />
          </div>
          <input type="hidden" {...register('id')} />
          <div className="mt-2 flex items-center space-x-4 pt-4">
            <Button type="submit" color="primary" disabled={isSubmitting}>
              Update Profile
            </Button>
          </div>
          {updated && (
            <div className="toast-center toast-middle toast">
              <div className="alert-ghost alert whitespace-nowrap opacity-75">
                <div>
                  <h4>Profile Updated</h4>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </>
  );
}

export default withPageAuthRequired(Profile);
