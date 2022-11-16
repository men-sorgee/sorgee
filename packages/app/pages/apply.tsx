import { withPageAuthRequired, useUser } from '@auth0/nextjs-auth0';
import Script from 'next/script';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { tw } from 'twind';
import styles from '_styles';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Info from '../components/ui/Info';
import { getAdminClient, User } from '../lib/services/directus';
import router from 'next/router';

type FormOptions = Array<{
  text: string;
  value: string;
}>;
// TEST: http://localhost:3000/apply?email=jlwicker@gmail.com&vouched_by=jason@thebrotherhoodgroup.org

type PageProps = {
  email?: string;
  vouched_by?: string;
  spectrumOptions: FormOptions;
  relationshipOptions: FormOptions;
  timeOfDayOptions: FormOptions;
  positionsOptions: FormOptions;
  sexualInterestsOptions: FormOptions;
  skinToneOptions: FormOptions;
};

export async function getServerSideProps({ query }: NextPageContext) {
  const adminClient = await getAdminClient();
  const getOptions = async (field: string) => {
    const positionResponse: any = await adminClient.fields.readOne(
      'users',
      field
    );
    return positionResponse!.meta!.options.choices;
  };

  const { id, vid } = query;
  const email = id
    ? Buffer.from(id as string, 'base64').toString('utf-8')
    : null;
  return {
    props: {
      email,
      vouched_by: vid,
      spectrumOptions: await getOptions('spectrum'),
      relationshipOptions: await getOptions('relationship_status'),
      timeOfDayOptions: await getOptions('event_availability'),
      positionsOptions: await getOptions('my_positions'),
      sexualInterestsOptions: await getOptions('sexual_scenes'),
      skinToneOptions: await getOptions('skin_tone')
    }
  };
}

const Apply = (props: PageProps) => {
  const { user, error, isLoading } = useUser();
  const { name, email } = user!;
  const {
    email: incoming_email,
    vouched_by,
    spectrumOptions,
    relationshipOptions,
    timeOfDayOptions,
    positionsOptions,
    sexualInterestsOptions,
    skinToneOptions
  } = props;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    defaultValues: {
      photo: user?.picture,
      first_name: name?.split(' ')[0] || name,
      last_name: name?.split(' ')[1] || '',
      email,
      incoming_email,
      vouched_by,
      email_verified: user?.email_verified || false,
      phone: null,
      biography: null,
      needs_guidance: false,
      spectrum: null,
      relationship_status: null,
      event_availability: [],
      age: 0,
      height_feet: 0,
      height_inches: 0,
      weight: 0,
      skin_tone: null,
      my_positions: [],
      sexual_scenes: []
    }
  });

  if (incoming_email && email != incoming_email)
    setError('email', {
      message:
        "This email doesn't match the invite. Please login with the email address you were invited with."
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const onSubmit = async (data: any) => {
    const {
      first_name,
      last_name,
      email,
      vouched_by,
      email_verified,
      phone,
      biography,
      needs_guidance,
      spectrum,
      relationship_status,
      event_availability,
      age,
      height_feet,
      height_inches,
      weight,
      skin_tone,
      my_positions,
      sexual_scenes
    } = data;

    const userDetails: User = {
      //photo,
      first_name,
      last_name,
      email,
      vouched_by,
      email_verified,
      phone,
      biography,
      needs_guidance,
      spectrum,
      relationship_status,
      event_availability,
      age,
      height: `${height_feet} ${height_inches}`,
      weight,
      skin_tone,
      my_positions,
      sexual_scenes
    };

    const response = await fetch('/api/admin/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify(userDetails))
    });

    if (response.ok) {
      router.push('/thanks');
    }
  };

  const {
    h2page,
    h3section,
    input,
    select,
    label,
    textArea,
    checkbox,
    checkboxLabel,
    sectionDark,
    buttonPrimary
  } = styles;

  const formSection = 'flex flex-col md:flex-row flex-wrap';
  const controlGroup = 'w-full md:w-1/2 mb-4';
  const controlGroup1 = controlGroup + ' md:pr-4';
  const controlGroup2 = 'w-1/4 pr-4 mb-4';

  return (
    <>
      <Head>
        <title>Apply</title>
      </Head>
      <section className={tw`${sectionDark}`}>
        <h2 className={tw(h2page)}>Begin Application</h2>

        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          className={tw`max-w-3xl mx-auto text-left`}
        >
          <h3 className={tw`${h3section} !text-2xl !text-left`}>About You</h3>
          <div className={tw`flex flex-col md:flex-row flex-wrap`}>
            <div className={tw(controlGroup1)}>
              <label htmlFor="first_name" className={tw(label)}>
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                {...register('first_name', { required: true })}
                className={tw(input)}
              />
              <ErrorMessage errors={errors} name="first_name" />
            </div>
            <div className={tw(controlGroup)}>
              <label htmlFor="last_name" className={tw(label)}>
                Last Name
                <Info>
                  Optional. We will use your first name in your profile.
                </Info>
              </label>
              <input
                type="text"
                id="last_name"
                {...register('last_name')}
                className={tw(input)}
              />
            </div>
            <div className={tw(controlGroup1)}>
              <label htmlFor="email" className={tw(label)}>
                Email
                <Info>Required for authentication..</Info>
              </label>
              <input
                type="email"
                id="email"
                {...register('email', { required: true })}
                className={tw(input)}
                placeholder="name@gmail.com"
              />
              <ErrorMessage errors={errors} name="email" />
            </div>
            <div className={tw(controlGroup)}>
              <label htmlFor="phone-number" className={tw(label)}>
                Cell Number
                <Info>
                  Must be SMS-enabled. Used for optional verification or
                  optional event reminders.
                </Info>
              </label>
              <input
                type="phone"
                id="phone-number"
                className={tw(input)}
                {...register('phone')}
                placeholder="XXX-XXX-XXXX"
              />
              <ErrorMessage errors={errors} name="phone" />
            </div>
            <div className={tw(controlGroup2)}>
              <label htmlFor="age" className={tw(label)}>
                Age
                <Info>
                  Must be 21+ to apply. We will verify your age at the event.
                </Info>
              </label>
              <input
                type="number"
                id="age"
                className={tw(input)}
                {...register('age', {
                  required: true,
                  min: {
                    value: 21,
                    message: 'Must be 21+ to apply.'
                  }
                })}
              />
              <ErrorMessage errors={errors} name="age" />
            </div>
            <div className={tw(controlGroup2)}>
              <label htmlFor="height_feet" className={tw(label)}>
                Height
              </label>
              <div className={tw`flex`}>
                <input
                  type="number"
                  id="height_feet"
                  className={tw`${input} !rounded-r-none`}
                  {...register('height_feet')}
                  placeholder="feet"
                />
                <input
                  type="number"
                  id="height_inches"
                  className={tw`${input} !rounded-l-none`}
                  {...register('height_inches')}
                  placeholder="inches"
                />
              </div>
            </div>
            <div className={tw(controlGroup2)}>
              <label htmlFor="weight" className={tw(label)}>
                Weight
              </label>
              <input
                type="number"
                id="weight"
                className={tw(input)}
                {...register('weight')}
              />
            </div>
            <div className={tw`${controlGroup2} !pr-0 `}>
              <label htmlFor="skin_tone" className={tw(label)}>
                Skin Tone
              </label>
              <select
                id="skin_tone"
                {...register('skin_tone', { required: true })}
                className={tw(select)}
              >
                {skinToneOptions?.map(({ text, value }, index) => (
                  <option key={index.toString()} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
            <div className={tw(controlGroup1)}>
              <label htmlFor="spectrum" className={tw(label)}>
                Sexual Orientation
              </label>
              <select
                id="spectrum"
                {...register('spectrum', { required: true })}
                className={tw(select)}
              >
                {spectrumOptions?.map(({ text, value }, index) => (
                  <option key={index.toString()} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
            <div className={tw(controlGroup)}>
              <label htmlFor="relationship_status" className={tw(label)}>
                Relationship Status
              </label>
              <select
                id="relationship_status"
                {...register('relationship_status')}
                className={tw(select)}
              >
                {relationshipOptions?.map(({ text, value }, index) => (
                  <option key={index.toString()} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
            <div className={tw`w-full mb-4`}>
              <label htmlFor="biography" className={tw(label)}>
                Biography
                <Info>Describe yourself in a few sentences</Info>
              </label>
              <textarea
                id="biography"
                rows={4}
                className={tw(textArea)}
                {...register('biography')}
                placeholder="Describe yourself in a few sentences"
              ></textarea>
            </div>
          </div>
          <h3 className={tw`${h3section} !text-2xl !text-left`}>Preferences</h3>
          <div className={tw(formSection)}>
            <div className={tw`w-full mb-4`}>
              <label className={tw(label)}>
                Preferred Event Times
                <Info>
                  We host events to meet the demands of our brothers. Let us
                  know what times work best in general.
                </Info>
              </label>
              <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
                {timeOfDayOptions?.map(({ text, value }, index) => (
                  <div key={index.toString()} className={tw`flex flex-row`}>
                    <input
                      id={value}
                      value={value}
                      type="checkbox"
                      {...register('event_availability')}
                      className={tw(checkbox)}
                    />
                    <label htmlFor={value} className={tw(checkboxLabel)}>
                      {text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className={tw`w-full mb-4`}>
              <label className={tw(label)}>
                Your Positions
                <Info>
                  What positions or acts are you interested in? We will use this
                  to match you with compatible brothers. Select all that apply.
                </Info>
              </label>
              <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
                {positionsOptions?.map(({ text, value }, index) => (
                  <div key={index.toString()} className={tw`flex flex-row`}>
                    <input
                      id={value}
                      type="checkbox"
                      value={value}
                      {...register('my_positions')}
                      className={tw(checkbox)}
                    />
                    <label htmlFor={value} className={tw(checkboxLabel)}>
                      {text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className={tw`w-full mb-4`}>
              <label className={tw(label)}>
                Turn Ons
                <Info>
                  What really gets you going? We will use this to invite you to
                  compatible events. Select all that apply.
                </Info>
              </label>
              <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
                {sexualInterestsOptions?.map(({ text, value }, index) => (
                  <div key={index.toString()} className={tw`flex flex-row`}>
                    <input
                      id={value}
                      type="checkbox"
                      value={value}
                      {...register('sexual_scenes')}
                      className={tw(checkbox)}
                    />
                    <label htmlFor={value} className={tw(checkboxLabel)}>
                      {text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <input type="hidden" {...register('photo')} />
          <input type="hidden" {...register('vouched_by')} />
          <input type="hidden" {...register('incoming_email')} />
          <input type="hidden" {...register('email_verified')} />
          <div className={tw`flex items-center space-x-4`}>
            <button type="submit" className={tw(buttonPrimary)}>
              Apply
            </button>
          </div>
        </form>

        <Script
          type="text/javascript"
          src="https://app.termly.io/embed.min.js"
          data-auto-block="on"
          data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
        ></Script>
      </section>
    </>
  );
};

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Apply);
