import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { FormProvider, useForm } from 'react-hook-form';
import { NextPageContext } from 'next';
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
import { Button, Tabs } from 'react-daisyui';
import Page from 'components/layout/Page';
import { LightBulbIcon } from '@heroicons/react/solid';

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

function Account(props: PageProps) {
  const { member, loading } = useAppUser();
  const data = { member, ...props };

  return (
    <Page title="Account" loading={loading && !member} sectionClass="gradient">
      <Form {...data} />
    </Page>
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
  const [tabValue, setTabValue] = useState(0);
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
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any);
    } else {
      setError('form' as any, { message: 'Something went wrong' });
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
          <Tabs
            variant="lifted"
            value={tabValue}
            onChange={setTabValue}
            className="sm md:lg mb-4 w-full"
          >
            <Tabs.Tab value={0}>Settings</Tabs.Tab>
            <Tabs.Tab value={1}>Profile</Tabs.Tab>
            <Tabs.Tab value={2}>Events</Tabs.Tab>
            <Tabs.Tab value={3}>Sex</Tabs.Tab>
          </Tabs>
          {tabValue == 0 && (
            <>
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
                      value:
                        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                      message: 'US numbers only. Format: 123 456 7890'
                    }
                  }}
                  placeholder="000 456 7890"
                />
              </div>
            </>
          )}
          {tabValue == 1 && (
            <>
              <div className="mb-8 grid grid-flow-row grid-cols-1 gap-4 md:grid-cols-2">
                <FieldInput
                  field="nickname"
                  label="Nickname"
                  className="col-span-2"
                  registerOptions={{ required }}
                />

                <FieldSelect
                  field="spectrum"
                  label="Orientation"
                  className=""
                  registerOptions={{ required }}
                  formOptions={spectrumOptions}
                />

                <FieldSelect
                  field="relationship_status"
                  label="Relationship Status"
                  className=""
                  formOptions={relationshipOptions}
                />

                <div className="grid  grid-cols-1 gap-4 md:grid-cols-2">
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
                        placeholder="'"
                      />
                      <input
                        type="number"
                        id="height_inches"
                        className="input  !rounded-l-none"
                        {...register('height_inches')}
                        placeholder='"'
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
            </>
          )}
          {tabValue == 2 && (
            <>
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
                Members who RSVP to events are expected to attend. Members that
                RSVP to event and do not attend, decrease the likelihood of
                getting invited again. We understand that things come up, but
                please be respectful of your brothers and RSVP accurately and
                let us know if you can&apos;t make it.
              </p>
            </>
          )}

          {tabValue == 3 && (
            <>
              <h3>Preferences</h3>
              <div className="mb-8 grid grid-cols-1 gap-4">
                <FieldCheckboxes
                  field="my_positions"
                  label="Your Positions"
                  help="What positions or acts are you interested in? "
                  formOptions={positionsOptions}
                />
                <p className="alert justify-around text-sm">
                  <LightBulbIcon className="w-10" />
                  We will use this to match you with compatible brothers. Select
                  all that apply
                </p>

                <FieldCheckboxes
                  field="sexual_scenes"
                  label="Your Scenes"
                  help="What scenes are you interested in? "
                  formOptions={scenesOptions}
                />
                <p className="alert justify-around text-sm">
                  <LightBulbIcon className="w-10" />
                  We will use this to match you with compatible events. Select
                  all that apply
                </p>
              </div>
            </>
          )}
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

export default withPageAuthRequired(Account);
