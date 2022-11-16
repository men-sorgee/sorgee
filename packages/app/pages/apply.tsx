import {
  withPageAuthRequired,
  useUser,
  Claims,
  UserProfile
} from '@auth0/nextjs-auth0';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { tw } from 'twind';
import styles from '_styles';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Info from '../components/ui/Info';
import { getAdminClient, User } from '../lib/services/directus';
import router from 'next/router';
import { pruneUndefined } from '../lib/utils/helpers';
import { useState } from 'react';
import { getFieldOptions } from '../lib/services/directus/service';

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
  skinToneOptions: FormOptions;
};

export async function getServerSideProps({ query }: NextPageContext) {
  const { id, vid } = query;
  const email = id
    ? Buffer.from(id as string, 'base64').toString('utf-8')
    : null;
  return {
    props: {
      email,
      vouched_by: vid || null,
      spectrumOptions: await getFieldOptions('spectrum'),
      relationshipOptions: await getFieldOptions('relationship_status'),
      timeOfDayOptions: await getFieldOptions('event_availability'),
      positionsOptions: await getFieldOptions('my_positions'),
      skinToneOptions: await getFieldOptions('skin_tone')
    }
  };
}

const Apply = (props: PageProps) => {
  const { user, error, isLoading } = useUser();
  const [formError, setFormError] = useState<string>();

  if (formError == null && user && props.email && user.email != props.email)
    setFormError(
      `You must login using the email address ${props.email} to use this invite.`
    );

  if (isLoading) return <div>Loading...</div>;
  const data = { user, ...props };
  return (
    <>
      <Head>
        <title>Apply</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>Group Application</h2>
        {formError ? (
          <p className={styles.p}>{formError}</p>
        ) : (
          <Form {...data} />
        )}
      </section>
    </>
  );
};

function Form(props: PageProps & { user?: UserProfile }) {
  const {
    user,
    email: incoming_email = null,
    vouched_by = null,
    spectrumOptions,
    relationshipOptions,
    timeOfDayOptions,
    positionsOptions,
    skinToneOptions
  } = props;
  const { name, email } = user!;
  const {
    h3section,
    input,
    select,
    label,
    textArea,
    checkbox,
    checkboxLabel,
    buttonPrimary
  } = styles;
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      picture: user?.picture,
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
      age: null,
      height_feet: null,
      height_inches: null,
      weight: null,
      skin_tone: null,
      my_positions: []
    }
  });
  const formSection = 'flex flex-col md:flex-row flex-wrap';
  const controlGroup = 'w-full md:w-1/2 pb-4';
  const controlGroup1 = controlGroup + ' md:pr-4';
  const controlGroup2 = ' pb-4';
  return (
    <>
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
              {...register('email')}
              className={tw(input)}
              placeholder="name@gmail.com"
              readOnly={true}
            />
          </div>
          <div className={tw(controlGroup)}>
            <label htmlFor="phone-number" className={tw(label)}>
              Cell Number
              <Info>
                Must be SMS-enabled. Used for optional verification or optional
                event reminders. Format: 123 456 7890
              </Info>
            </label>
            <input
              type="phone"
              id="phone-number"
              className={tw(input)}
              {...register('phone', {
                pattern: {
                  value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                  message: 'US numbers only. Format: 123 456 7890'
                }
              })}
              placeholder="123 456 7890"
            />
            <ErrorMessage errors={errors} name="phone" />
          </div>
          <div className={tw`grid grid-cols-2 md:grid-cols-4`}>
            <div className={tw`pb-4 pr-4`}>
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
              <div className={tw`flex md:pr-4`}>
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
            <div className={tw`pb-4 pr-4`}>
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
                {...register('skin_tone')}
                className={tw(select)}
              >
                {skinToneOptions?.map(({ text, value }, index) => (
                  <option key={index.toString()} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
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
                We host events to meet the demands of our brothers. Let us know
                what times work best in general.
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
        </div>

        <input type="hidden" {...register('picture')} />
        <input type="hidden" {...register('vouched_by')} />
        <input type="hidden" {...register('incoming_email')} />
        <div
          className={tw`flex items-center space-x-4 mt-2 pt-4 border-purple border-t-2`}
        >
          <button type="submit" className={tw(buttonPrimary)}>
            Apply
          </button>
        </div>
      </form>
    </>
  );
}

async function onSubmit(data: any) {
  const {
    picture,
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

  let height = undefined;
  if (height_feet || height_inches) {
    height = `${height_feet}' ${height_inches}"`;
  }

  const userDetails: User = pruneUndefined({
    picture,
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
    height,
    weight,
    skin_tone,
    my_positions,
    sexual_scenes
  });

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
}

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Apply);
