import { FormProvider, useForm } from 'react-hook-form';
import { NextPageContext } from 'next';
import { Applicant, FormOptions, Member, User } from 'lib/models';
import { fetchJSON, postJSON } from 'lib/utils/client';
import { getFieldOptions } from 'lib/services/directus/server';
import { useMember } from 'lib/hooks/use-member';
import { useEffect, useState } from 'react';
import {
  FieldInput,
  FieldSelect,
  FieldWrapper,
  FieldText,
  FieldCheckboxes
} from '../components/forms';
import { Alert, Button, Tabs, Toast } from 'react-daisyui';
import Page from '../components/layout/Page';
import { CameraIcon, LightBulbIcon, XIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import FieldCheckbox from '../components/forms/FieldCheckbox';
import Markdown from 'components/layout/Markdown';
import { ErrorMessage } from '@hookform/error-message';

export type PageProps = {
  spectrumOptions: FormOptions;
  relationshipOptions: FormOptions;
  timeOfDayOptions: FormOptions;
  positionsOptions: FormOptions;
  skinToneOptions: FormOptions;
  hairColorOptions: FormOptions;
  hairStyleOptions: FormOptions;
  eyeColorOptions: FormOptions;
  mannerismsOptions: FormOptions;
  bodyHairOptions: FormOptions;
  bodyAttributesOptions: FormOptions;
  facialHairOptions: FormOptions;
  scenesOptions: FormOptions;
  eventOptions: FormOptions;
  cockGirthOptions: FormOptions;
  cockAttributesOptions: FormOptions;
  ballSizeOptions: FormOptions;
  ballGravityOptions: FormOptions;
  cumAttributesOptions: FormOptions;
  loadPolicyOptions: FormOptions;
  hivStatusOptions: FormOptions;
  vaccinationStatusOptions: FormOptions;
  reload?: () => Promise<void>;
};

export async function getServerSideProps(context: NextPageContext) {
  const props: PageProps = {
    spectrumOptions: await getFieldOptions<User>('spectrum'),
    relationshipOptions: await getFieldOptions<User>('relationship_status'),
    timeOfDayOptions: await getFieldOptions<User>('event_availability'),
    positionsOptions: await getFieldOptions<User>('my_positions'),
    skinToneOptions: await getFieldOptions<User>('skin_tone'),
    hairColorOptions: await getFieldOptions<User>('hair_color'),
    hairStyleOptions: await getFieldOptions<User>('hair_style'),
    eyeColorOptions: await getFieldOptions<User>('eye_color'),
    mannerismsOptions: await getFieldOptions<User>('mannerisms'),
    bodyHairOptions: await getFieldOptions<User>('body_hair'),
    bodyAttributesOptions: await getFieldOptions<User>('body_attributes'),
    facialHairOptions: await getFieldOptions<User>('facial_hair'),
    scenesOptions: await getFieldOptions<User>('sexual_scenes'),
    eventOptions: await getFieldOptions<User>('social_scenes'),
    cockGirthOptions: await getFieldOptions<User>('cock_girth'),
    cockAttributesOptions: await getFieldOptions<User>('cock_attributes'),
    ballSizeOptions: await getFieldOptions<User>('ball_size'),
    ballGravityOptions: await getFieldOptions<User>('ball_gravity'),
    cumAttributesOptions: await getFieldOptions<User>('cum_attributes'),
    loadPolicyOptions: await getFieldOptions<User>('load_policy'),
    hivStatusOptions: await getFieldOptions<User>('hiv_status'),
    vaccinationStatusOptions: await getFieldOptions<User>('vaccinations')
  };
  return { props };
}

type MemberFormData = Applicant & {
  height_feet: string;
  height_inches: string;
};

function Account(props: PageProps) {
  const { member, loading } = useMember();
  const data = { member, ...props };

  return (
    <Page title="Account" loading={loading} sectionClass="gradient p-4">
      <Form {...data} />
    </Page>
  );
}

function Form(props: PageProps & { member: Member }) {
  const router = useRouter();
  const {
    member,
    spectrumOptions,
    positionsOptions,
    relationshipOptions,
    skinToneOptions,
    hairColorOptions,
    hairStyleOptions,
    eyeColorOptions,
    mannerismsOptions,
    bodyHairOptions,
    bodyAttributesOptions,
    facialHairOptions,
    timeOfDayOptions,
    scenesOptions,
    eventOptions,
    cockGirthOptions,
    cockAttributesOptions,
    ballSizeOptions,
    ballGravityOptions,
    cumAttributesOptions,
    loadPolicyOptions,
    hivStatusOptions,
    vaccinationStatusOptions,
    reload
  } = props;
  const [updated, setUpdated] = useState(false);
  const [tabValue, setTabValue] = useState(Number(router.query.t) || 0);

  const methods = useForm<MemberFormData>({
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
    formState: { isSubmitting, errors }
  } = methods;

  useEffect(() => {
    if (updated) {
      reload()
        .then(() => {
          setUpdated(false);
        })
        .catch(console.error);
    }
    if (tabValue !== Number(router.query.t || 0))
      router.push(`/member/account?t=${tabValue}`);
    return () => {};
  }, [updated, tabValue, member, reload, setUpdated]);

  async function onSubmit(data: MemberFormData) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet}' ${data.height_inches}"`;
    }

    const [ok, response] = await postJSON<User>('/api/member/me', data);

    if (ok) {
      setUpdated(true);
    } else if (response.error?.field) {
      // @ts-ignore
      setError(response.error!.field, response.error.message);
    } else {
      setError('form' as any, { message: 'Something went wrong' });
    }
  }

  
  const required = { value: true, message: 'Required' };
  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <Tabs
            variant="bordered"
            value={tabValue}
            onChange={setTabValue}
            className="sm md:lg mb-4 w-full"
          >
            <Tabs.Tab
              className="w-1/4 font-bold text-white"
              activeValue={tabValue}
              value={0}
            >
              Settings
            </Tabs.Tab>
            <Tabs.Tab
              className="w-1/4 font-bold text-white"
              activeValue={tabValue}
              value={1}
            >
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              className="w-1/4 font-bold text-white"
              activeValue={tabValue}
              value={2}
            >
              Events
            </Tabs.Tab>
            <Tabs.Tab
              className="w-1/4 font-bold text-white"
              activeValue={tabValue}
              value={3}
            >
              Sex
            </Tabs.Tab>
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

              <Alert className="w-full">
                <CameraIcon className="h-[10%] max-h-[125px] w-auto self-start" />
                <div>
                  <p className="mt-0">
                    Are you an exhibitionist? If so, you can opt-in to be a part
                    of our marketing efforts. We will never share your personal
                    information with anyone.
                  </p>
                  <div className="flex w-full justify-start gap-4">
                    <FieldCheckbox
                      field="photo_consent"
                      label="Photo Consent"
                      help="I would be willing to be photographed and featured in our promotional materials."
                    />
                    <FieldCheckbox
                      field="video_consent"
                      label="Video Consent"
                      help="I would be willing to filmed for a video testimonial."
                    />
                  </div>
                </div>
              </Alert>
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2"></div>
            </>
          )}
          {tabValue == 1 && (
            <>
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <FieldInput
                  field="nickname"
                  label="Nickname"
                  className="col-span-2 sm:col-span-4"
                  registerOptions={{ required }}
                />

                <FieldSelect
                  field="spectrum"
                  label="Orientation"
                  className="col-span-2"
                  registerOptions={{ required }}
                  formOptions={spectrumOptions}
                />

                <FieldSelect
                  field="relationship_status"
                  label="Relationship Status"
                  className="col-span-2"
                  formOptions={relationshipOptions}
                />

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

                <FieldInput field="weight" label="Weight" type="number" />

                <FieldSelect
                  field="skin_tone"
                  label="Skin Tone"
                  formOptions={skinToneOptions}
                />
                <FieldCheckboxes
                  field="body_attributes"
                  label="Body Attributes"
                  formOptions={bodyAttributesOptions}
                  className="sm:col-span-4"
                />
                <FieldSelect
                  field="hair_color"
                  label="Hair Color"
                  className="col-span-2"
                  formOptions={hairColorOptions}
                />
                <FieldSelect
                  field="hair_style"
                  label="Hair Style"
                  className="col-span-2"
                  formOptions={hairStyleOptions}
                />
                <FieldSelect
                  field="body_hair"
                  label="Body Hair"
                  className="col-span-2"
                  formOptions={bodyHairOptions}
                />
                <FieldSelect
                  field="facial_hair"
                  label="Facial Hair"
                  className="col-span-2"
                  formOptions={facialHairOptions}
                />
                <FieldSelect
                  field="eye_color"
                  label="Eye Color"
                  className="col-span-2"
                  formOptions={eyeColorOptions}
                />
                <FieldSelect
                  field="mannerisms"
                  label="Mannerisms"
                  className="col-span-2"
                  formOptions={mannerismsOptions}
                />
              </div>

              <FieldText
                field="biography"
                label="Biography"
                help="Tell us about yourself. What are your interests? What are you looking for?"
                rows={4}
                placeholder="I am a bit shy, but love to get aggressive in bed."
              />
            </>
          )}
          {tabValue == 2 && (
            <>
              <div className="mb-8 grid grid-cols-1 gap-4">
                <FieldCheckboxes
                  field="social_scenes"
                  label="Social Activities"
                  help="We host events to meet the demands of our brothers. Tell us what kind of events you are interested in."
                  formOptions={eventOptions}
                />
              </div>

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
              <h4>Your Cock</h4>
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <FieldInput
                  field="cock_length"
                  label="Cock Length"
                  type="number"
                  registerOptions={{}}
                />
                <FieldSelect
                  field="cock_girth"
                  label="Cock Girth"
                  formOptions={cockGirthOptions}
                />
              </div>
              <FieldCheckboxes
                field="cock_attributes"
                label=""
                className="sm:col-span-2"
                formOptions={cockAttributesOptions}
              />
              <h4>Your Balls</h4>
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <FieldSelect
                  field="ball_size"
                  label="Ball Size"
                  formOptions={ballSizeOptions}
                />
                <FieldSelect
                  field="ball_gravity"
                  label="Ball Gravity"
                  formOptions={ballGravityOptions}
                />
              </div>
              <FieldCheckboxes
                field="cum_attributes"
                label=""
                className="sm:col-span-2"
                formOptions={cumAttributesOptions}
              />
              <h4>Your Health</h4>
              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <FieldSelect
                  field="hiv_status"
                  label="HIV Status"
                  formOptions={hivStatusOptions}
                />
                <FieldInput
                  field="last_tested"
                  label="Last Tested"
                  type="date"
                />
              </div>
              <FieldCheckboxes
                field="vaccinations"
                label="Vax Status"
                formOptions={vaccinationStatusOptions}
              />
              <FieldCheckboxes
                field="load_policy"
                label="Load Policy"
                className="sm:col-span-2"
                formOptions={loadPolicyOptions}
              />
            </>
          )}

          <input type="hidden" {...register('id')} />
          {tabValue <= 3 && (
            <div className="mt-2 flex items-center space-x-4 pt-4">
              <Button type="submit" color="primary" disabled={isSubmitting}>
                Update Profile
              </Button>
              <ErrorMessage errors={errors} name="form" />
            </div>
          )}
        </form>
      </FormProvider>
      {updated && (
        <Toast color="ghost" vertical="middle" horizontal="center">
          <h4>Profile Updated</h4>
        </Toast>
      )}
    </>
  );
}

const NotificationList = ({
  setUpdated,
  setError
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  async function deleteNotification(id: number) {
    const [ok] = await fetchJSON(
      '/api/member/me',
      {
        id
      },
      'DELETE'
    );

    if (ok) {
      setUpdated(true);
    } else {
      setError('form' as any, { message: 'Something went wrong' });
    }
  }
  return (
    {notifications.map((n, i) => (
            <Alert key={i}>
              <div className="flex-grow">
                <Markdown content={n.message} />
              </div>
              <div className="flex-shrink">
                <a
                  className="btn-ghost btn-sm btn"
                  onClick={async () => {
                    await deleteNotification(n.id);
                  }}
                  data-id={n.id}
                >
                  <XIcon className="h-4 w-4 fill-white" />
                </a>
              </div>
            </Alert>
          ))}
  )
}

export default Account;
