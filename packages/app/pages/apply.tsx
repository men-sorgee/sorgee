import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { tw } from 'twind';
import styles from 'styles';
import { NextPageContext } from 'next';
import Head from 'next/head';
import router from 'next/router';
import { getAdminClient, User, FormOptions } from 'lib/services/directus';

import { pruneUndefined } from 'lib/utils';
import { useEffect, useState } from 'react';
import { getFieldOptions } from 'lib/services/directus/service';
import { useMember } from 'lib/hooks/use-member';
import { Loading } from 'components/ui';
import { Tooltip } from 'flowbite-react';
import { InfoIcon } from 'components/icons';

// TEST: http://localhost:3000/apply?email=jlwicker@gmail.com&vouched_by=jason@thebrotherhoodgroup.org

export type PageProps = {
  email?: string;
  invite?: string;
  spectrumOptions: FormOptions;
  relationshipOptions: FormOptions;
  timeOfDayOptions: FormOptions;
  positionsOptions: FormOptions;
  skinToneOptions: FormOptions;
};

export async function getServerSideProps({ query }: NextPageContext) {
  const props: PageProps = {
    spectrumOptions: await getFieldOptions('spectrum'),
    relationshipOptions: await getFieldOptions('relationship_status'),
    timeOfDayOptions: await getFieldOptions('event_availability'),
    positionsOptions: await getFieldOptions('my_positions'),
    skinToneOptions: await getFieldOptions('skin_tone')
  };
  return { props };
}

function Apply(props: PageProps) {
  const { user, member, loading } = useMember();
  const [formError, setFormError] = useState<string>();

  useEffect(() => {
    if (user && props.email && user.email != props.email)
      setFormError(
        `You must login using the email address ${props.email} to use this invite.`
      );
  }, [user, loading, member]);

  const data = { user, member, ...props };
  const title = props.invite ? 'Member Registration' : 'Member Application';
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>{loading ? 'Loading' : title}</h2>
        {formError && <p className={styles.inputError}>{formError}</p>}
        {!loading && !formError && <Form {...data} />}
      </section>
    </>
  );
}

function Form(props: PageProps & { user?: UserProfile; member?: User }) {
  const {
    user,
    email: incoming_email = null,
    invite,
    spectrumOptions,
    relationshipOptions,
    timeOfDayOptions,
    positionsOptions,
    skinToneOptions,
    member
  } = props;
  const { name, email } = user!;
  const [registered, setRegistered] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<User & { invite: string }>({
    defaultValues: {
      picture: user?.picture,
      first_name: member?.first_name || name?.split(' ')[0] || name,
      last_name: member?.last_name || name?.split(' ')[1] || '',
      email,
      email_verified: user?.email_verified || false,
      phone: member?.phone || '',
      biography: member?.biography || null,
      needs_guidance: member?.needs_guidance || false,
      spectrum: member?.spectrum || null,
      relationship_status: member?.relationship_status || null,
      event_availability: [],
      age: member?.age || null,
      height_feet: member?.height?.toString().substring(0, 1) || null,
      height_inches: member?.height?.toString().substring(2) || null,
      weight: member?.weight || null,
      skin_tone: member?.skin_tone || null,
      my_positions: member?.my_positions || [],
      invite
    }
  });

  async function onSubmit(data: any) {
    if (data.height_feet || data.height_inches) {
      data.height = `${data.height_feet}' ${data.height_inches}"`;
    }
    const response = await fetch('/api/admin/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify(pruneUndefined(data)))
    });

    if (response.ok) {
      setRegistered(true);
      return true;
    }
    const body = await response.json();
    if (Array.isArray(body.errors)) {
      body.errors.forEach((error: any) => {
        setError(error.extensions.field, { message: error.message });
      });
    }
  }

  const controlGroup1 = styles.inputGroup + ' md:pr-4';
  const controlGroup2 = ' pb-4';
  const intro = watch('invite')
    ? "You've been invited to join our community of men! While your application is pre-approved, we still need to perform a few verification steps."
    : 'Thanks for requesting to join our community. Please fill out the form and one of our team members will review your application and get back to you shortly.';

  if (registered && member) return <Verification member={member} />;

  return (
    <>
      <form
        action="#"
        onSubmit={handleSubmit(onSubmit)}
        className={tw`max-w-3xl mx-auto text-left`}
      >
        <p className={tw(styles.pLg)}>{intro}</p>
        <p className={tw(styles.pLg)}>
          Membership is free, but there is a vetting and verification process.
          We do this to ensure the safety of our members and to weed out any
          liars, spammers, bots, or flakes.
        </p>
        <h3 className={tw`${styles.h3section} !text-2xl !text-left`}>
          Private Information
        </h3>
        <p className={tw(styles.p)}>
          We collect this information for verification purposes only. We will
          not share, show or sell this information to anyone.
        </p>
        <div className={tw`flex flex-col md:flex-row flex-wrap`}>
          <div className={tw(controlGroup1)}>
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
              render={(m) => <div className={tw(inputError)}>{m.message}</div>}
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
              render={(m) => <div className={tw(inputError)}>{m.message}</div>}
              errors={errors}
              name="last_name"
            />
          </div>
          <div className={tw(controlGroup1)}>
            <label htmlFor="email" className={tw(styles.label)}>
              Email
              <InfoIcon
                title="Required for authentication.."
                className={tw(styles.infoIcon)}
              />
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
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
              render={(m) => <div className={tw(inputError)}>{m.message}</div>}
              errors={errors}
              name="phone"
            />
          </div>
          <h3 className={tw`${styles.h3section} !text-2xl !text-left`}>
            About You
          </h3>
          <p className={tw(styles.p)}>
            <strong>Please be as honest as possible.</strong> Honest answers
            will help your chances of approval and help our AI create the
            perfect group events!
          </p>
          <div className={tw(controlGroup1)}>
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
            <div className={tw(controlGroup2)}>
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
            <div className={tw`${controlGroup2} !pr-0 `}>
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
          Preferences
        </h3>
        <p className={tw(styles.p)}>
          We currently coordinate events in Denver, for the following times
          bi-monthly. We try to create events that can include new members,
          however, we do not guarantee that you will be included in every event.
          As the group grows, so too will the number of events we can create.
        </p>
        <div className={tw(styles.formSection)}>
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
          <p className={tw`${styles.p} !text-sm`}>
            <strong>Important:</strong> Members who RSVP to events are expected
            to attend. Members that RSVP to event and do not attend,
            dramatically decrease the chances of getting invited again. We
            understand that things come up, but please be respectful of your
            brothers and RSVP accurately and let us know if you can't make it.
          </p>

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

        <div className={tw`w-full pb-4`}>
          <label className={tw(styles.label)}>
            New to this?
            <InfoIcon
              className={tw(styles.infoIcon)}
              title="We want you to be comfortable. Check this and we will
            help guide you along the way."
            />
          </label>
          <div className={tw(`flex flex-row align-middle items-center`)}>
            <input
              id="needs_guidance"
              type="checkbox"
              {...register('needs_guidance')}
              className={tw(styles.checkbox)}
            />
            <label
              htmlFor={'needs_guidance'}
              className={tw(styles.checkboxLabel)}
            >
              I Need Guidance
            </label>
          </div>
        </div>
        <input type="hidden" {...register('picture')} />
        <input type="hidden" {...register('invite')} />

        <div className={tw`flex items-center space-x-4 mt-2 pt-4`}>
          <button
            type="submit"
            className={tw(styles.buttonPrimary)}
            disabled={isSubmitting}
          >
            {watch('invite') ? 'Join' : 'Apply'}
          </button>
        </div>
      </form>
    </>
  );
}

function Verification({ member }: { member: User }) {
  return (
    <>
      <h3 className={tw(styles.h3section)}>Photo Verification</h3>
      <p className={tw(styles.pLg)}>
        To complete your application, take a selfie while holding a piece of
        paper the following verification code on it, and email it to&nbsp;
        <a className={tw(styles.link)} href="mailto:support@guysnheat.com">
          support@guysnheat.com
        </a>
        &nbsp; using the email address you registered with.
      </p>
      <h2 className={tw`font-sans !text-6xl`}>
        {member.id.slice(0, 4)} {member.id.slice(4, 8)}
      </h2>
      <p className={tw`${styles.pLg} mt-8`}>
        <strong>
          Be sure your face and code is clearly visible, with no sunglasses or
          hats.
        </strong>
        &nbsp; This photo will not be shared with anyone and will not be used
        for your profile.
      </p>
    </>
  );
}

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Apply);
