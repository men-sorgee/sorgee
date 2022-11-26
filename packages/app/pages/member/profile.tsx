import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { tw } from 'twind';
import styles from 'styles';
import { NextPageContext } from 'next';
import Head from 'next/head';
import { Member } from 'lib/services/directus';
import { pruneUndefined } from 'lib/utils';
import { getFieldOptions} from '@/lib/services/directus/server';
import { useAppUser } from 'lib/hooks/use-member';
import { InfoIcon } from 'components/icons';
import { FormOptions } from 'lib/types'
import { useEffect, useState } from 'react'

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
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>{loading ? 'Loading' : 'Member Profile'}</h2>

        {!loading && <Form {...data} />}
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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      ...member,
      height_feet: member?.height?.toString().substring(0, 1),
      height_inches: member?.height?.toString().substring(2)
    }
  });
    
  useEffect(() => {
    if (updated) {
      setTimeout(() => setUpdated(false), 3000);
    }
  }, [updated]);

  async function onSubmit(data: any) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet}' ${data.height_inches}"`;
    }
    const response = await fetch('/api/admin/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify(pruneUndefined(data)))
    });

    if (response.ok) {
      setUpdated(true)
      return;
    }

    const body = await response.json();
    if (Array.isArray(body.errors)) {
      body.errors.forEach((error) => {
        setError(error.extensions.field, { message: error.message });
      });
    }
  }

  return (
    <>
      <form
        action="#"
        onSubmit={handleSubmit(onSubmit)}
        className={tw`max-w-3xl mx-auto text-left`}
      >
        <h3 className={tw`${styles.h3section} !text-2xl !text-left`}>
          Private Information
        </h3>
        <div className={tw`flex flex-col md:flex-row flex-wrap`}>
          <div className={tw`${styles.inputGroup} md:pr-4`}>
            <label htmlFor="first_name" className={tw(styles.label)}>
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              {...register('first_name', { required: true })}
              className={tw(styles.input)}
            />
            <ErrorMessage
              render={(m) => (
                <div className={tw(styles.inputError)}>{m.message}</div>
              )}
              errors={errors}
              name="first_name"
            />
          </div>
          <div className={tw(styles.inputGroup)}>
            <label htmlFor="last_name" className={tw(styles.label)}>
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              {...register('last_name', { required: true })}
              className={tw(styles.input)}
            />
            <ErrorMessage
              render={(m) => (
                <div className={tw(styles.inputError)}>{m.message}</div>
              )}
              errors={errors}
              name="last_name"
            />
          </div>
          <div className={tw`${styles.inputGroup} md:pr-4`}>
            <label htmlFor="email" className={tw(styles.label)}>
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', { required: true })}
              className={tw(styles.input)}
              placeholder="name@gmail.com"
              readOnly={true}
            />
          </div>
          <div className={tw(styles.inputGroup)}>
            <label htmlFor="phone-number" className={tw(styles.label)}>
              Cell Number
              <InfoIcon
                className={tw(styles.infoIcon)}
                title="Must be SMS-enabled. Used for optional verification or optional event reminders. Format: 123 456 7890"
              />
            </label>
            <input
              type="phone"
              id="phone-number"
              className={tw(styles.input)}
              {...register('phone', {
                pattern: {
                  value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                  message: 'US numbers only. Format: 123 456 7890'
                }
              })}
              placeholder="123 456 7890"
            />
            <ErrorMessage
              render={(m) => (
                <div className={tw(styles.inputError)}>{m.message}</div>
              )}
              errors={errors}
              name="phone"
            />
          </div>
          <h3 className={tw`${styles.h3section} w-full !text-2xl !text-left`}>
            You Profile
          </h3>
          <div className={tw`mb-4 w-full`}>
            <label htmlFor="nickname" className={tw(styles.label)}>
              Nickname
            </label>
            <input
              id="nickname"
              type="text"
              {...register('nickname', { required: true })}
              className={tw(styles.select)}
            />
              
          </div>
          <div className={tw`${styles.inputGroup} md:pr-4`}>
            <label htmlFor="spectrum" className={tw(styles.label)}>
              Orientation
            </label>
            <select
              id="spectrum"
              {...register('spectrum', { required: true })}
              className={tw(styles.select)}
            >
              {spectrumOptions?.map(({ text, value }, index) => (
                <option key={index.toString()} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>

          <div className={tw(styles.inputGroup)}>
            <label htmlFor="relationship_status" className={tw(styles.label)}>
              Relationship Status
            </label>
            <select
              id="relationship_status"
              {...register('relationship_status')}
              className={tw(styles.select)}
            >
              {relationshipOptions?.map(({ text, value }, index) => (
                <option key={index.toString()} value={value}>
                  {text}
                </option>
              ))}
            </select>
          </div>

          <div className={tw`grid grid-cols-2 md:grid-cols-4`}>
            <div className={tw`pb-4 pr-4`}>
              <label htmlFor="age" className={tw(styles.label)}>
                Age
                <InfoIcon
                  title="Must be 21+ to apply. We verify ages at events."
                  className={tw(styles.infoIcon)}
                />
              </label>
              <input
                type="number"
                id="age"
                className={tw(styles.input)}
                {...register('age', {
                  required: true,
                  min: {
                    value: 21,
                    message: 'Must be 21+ to apply.'
                  }
                })}
              />
              <ErrorMessage
                render={(m) => (
                  <div className={tw(styles.inputError)}>{m.message}</div>
                )}
                errors={errors}
                name="age"
              />
            </div>
            <div className={tw`pb-4`}>
              <label htmlFor="height_feet" className={tw(styles.label)}>
                Height
              </label>
              <div className={tw`flex md:pr-4`}>
                <input
                  type="number"
                  id="height_feet"
                  className={tw`${styles.input} !rounded-r-none`}
                  {...register('height_feet')}
                  placeholder="feet"
                />
                <input
                  type="number"
                  id="height_inches"
                  className={tw`${styles.input} !rounded-l-none`}
                  {...register('height_inches')}
                  placeholder="inches"
                />
              </div>
            </div>
            <div className={tw`pb-4 pr-4`}>
              <label htmlFor="weight" className={tw(styles.label)}>
                Weight
              </label>
              <input
                type="number"
                id="weight"
                className={tw(styles.input)}
                {...register('weight')}
              />
            </div>
            <div className={tw`pb-4 pr-4 !pr-0 `}>
              <label htmlFor="skin_tone" className={tw(styles.label)}>
                Skin Tone
              </label>
              <select
                id="skin_tone"
                {...register('skin_tone')}
                className={tw(styles.select)}
              >
                {skinToneOptions?.map(({ text, value }, index) => (
                  <option key={index.toString()} value={value}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={tw`w-full mb-4`}>
            <label htmlFor="biography" className={tw(styles.label)}>
              Biography
              <InfoIcon
                title="Describe yourself in a few sentences"
                className={tw(styles.infoIcon)}
              />
            </label>
            <textarea
              id="biography"
              rows={4}
              className={tw(styles.textArea)}
              {...register('biography')}
              placeholder="Describe yourself in a few sentences"
            ></textarea>
          </div>
        </div>
        <h3 className={tw`${styles.h3section} !text-2xl !text-left`}>
          Event Preferences
        </h3>

        <div className={tw`w-full pb-4`}>
          <div className={tw`w-full mb-4`}>
            <label className={tw(styles.label)}>
              Preferred Event Times
              <InfoIcon
                title="We host events to meet the demands of our brothers. Let us know what times work best in general."
                className={tw(styles.infoIcon)}
              />
            </label>
            <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
              {timeOfDayOptions?.map(({ text, value }, index) => (
                <div key={index.toString()} className={tw`flex flex-row`}>
                  <input
                    id={value}
                    value={value}
                    type="checkbox"
                    {...register('event_availability')}
                    className={tw(styles.checkbox)}
                  />
                  <label htmlFor={value} className={tw(styles.checkboxLabel)}>
                    {text}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <p className={tw` !text-sm`}>
            <strong>Important:</strong> Members who RSVP to events are expected
            to attend. Members that RSVP to event and do not attend, decrease
            the likelihood of getting invited again. We understand that things
            come up, but please be respectful of your brothers and RSVP
            accurately and let us know if you can&apos;t make it.
          </p>
          <h3 className={tw`${styles.h3section} !text-2xl !text-left`}>
          Sexual Preferences
          </h3>
          <div className={tw`w-full mb-4`}>
            <label className={tw(styles.label)}>
              Your Positions
              <InfoIcon
                title="What positions or acts are you interested in? We will use this to match you with compatible brothers. Select all that apply."
                className={tw(styles.infoIcon)}
              />
            </label>
            <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
              {positionsOptions?.map(({ text, value }, index) => (
                <div key={index.toString()} className={tw`flex flex-row`}>
                  <input
                    id={value}
                    type="checkbox"
                    value={value}
                    {...register('my_positions')}
                    className={tw(styles.checkbox)}
                  />
                  <label htmlFor={value} className={tw(styles.checkboxLabel)}>
                    {text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={tw`w-full mb-4`}>
          <label className={tw(styles.label)}>
            Your Scenes
            <InfoIcon
              title="What scenes are you interested in? We will use this to match you with compatible events. Select all that apply."
              className={tw(styles.infoIcon)}
            />
          </label>
          <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
            {scenesOptions?.map(({ text, value }, index) => (
              <div key={index.toString()} className={tw`flex flex-row`}>
                <input
                  id={value}
                  type="checkbox"
                  value={value}
                  {...register('sexual_scenes')}
                  className={tw(styles.checkbox)}
                />
                <label htmlFor={value} className={tw(styles.checkboxLabel)}>
                  {text}
                </label>
              </div>
            ))}
          </div>
        </div>
  
        <div className={tw`flex items-center space-x-4 mt-2 pt-4`}>
          <button
            type="submit"
            className={tw(styles.buttonPrimary)}
            disabled={isSubmitting}
          >
            Update Profile
          </button>
        </div>
        { updated && <p className={tw`text-green-500 text-left m-2`}>Profile Updated</p>}
      </form>
    </>
  );
}

export default withPageAuthRequired(Profile);
