import {
  withPageAuthRequired,
  UserProfile,
  useUser
} from '@auth0/nextjs-auth0';
import Script from 'next/script';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { tw } from 'twind';
import { User } from 'lib/services/directus/types';
import styles from '_styles';
import { NextPageContext } from 'next';
import Head from 'next/head';
import Info from '../components/ui/Info';

type FormOptions = Array<{
  text: string;
  value: string;
}>;
// TEST: http://localhost:3000/apply?email=jlwicker@gmail.com&referring_email=jason@thebrotherhoodgroup.org

type PageProps = {
  email?: string;
  referring_email?: string;
  spectrumOptions: FormOptions;
  relationshipOptions: FormOptions;
  timeOfDayOptions: FormOptions;
  sexualRolesOptions: FormOptions;
  sexualInterestsOptions: FormOptions;
};

export async function getServerSideProps({ query }: NextPageContext) {
  // const adminClient = await getAdminClient();

  const { email, referring_email } = query;
  return {
    props: {
      email,
      referring_email,
      spectrumOptions: [
        {
          text: 'Straight',
          value: 'straight'
        },
        {
          text: 'Situational',
          value: 'situational'
        },
        {
          text: 'Heterocurious',
          value: 'heterocurious'
        },
        {
          text: 'Bisexual',
          value: 'bisexual'
        },
        {
          text: 'Pansexual',
          value: 'pansexual'
        },
        {
          text: 'Homoflexible',
          value: 'homoflexible'
        },
        {
          text: 'Evolving',
          value: 'evolving'
        },
        {
          text: 'Gay',
          value: 'gay'
        },
        {
          text: 'Queer',
          value: 'queer'
        },
        {
          text: 'Unknown',
          value: 'unknown'
        }
      ],
      relationshipOptions: [
        {
          text: 'Single',
          value: 'single'
        },
        {
          text: 'Open Relationship',
          value: 'open'
        },
        {
          text: 'Partnered',
          value: 'partnered'
        },
        {
          text: 'Married',
          value: 'married'
        },
        {
          text: 'Friends with Benefits',
          value: 'friends'
        },
        {
          text: "It's complicated",
          value: 'complicated'
        },
        {
          text: 'Divorced',
          value: 'divorced'
        },
        {
          text: 'Polyamorous',
          value: 'polyamorous'
        },
        {
          text: 'Monogamous',
          value: 'monogamous'
        },
        {
          text: 'Dating',
          value: 'dating'
        }
      ],
      timeOfDayOptions: [
        {
          text: 'Weekday Afternoons',
          value: 'weekday_afternoons'
        },
        {
          text: 'Friday Afternoons',
          value: 'friday_afternoons'
        },
        {
          text: 'Weekend Afternoons',
          value: 'weekend_afternoons'
        },
        {
          text: 'Weekday Evenings',
          value: 'weekday_evenings'
        },

        {
          text: 'Friday Evenings',
          value: 'friday_evenings'
        },

        {
          text: 'Weekend Evenings',
          value: 'weekend_evenings'
        }
      ],
      sexualRolesOptions: [
        {
          text: 'Dominating Top',
          value: 'dom-top'
        },
        {
          text: 'Top',
          value: 'top'
        },
        {
          text: 'Versatile Top',
          value: 'versatile-top'
        },
        {
          text: 'Passive Top',
          value: 'passive-top'
        },
        {
          text: 'Versatile',
          value: 'versatile'
        },
        {
          text: 'Vers Flip',
          value: 'flip'
        },
        {
          text: 'Versatile Bottom',
          value: 'vers-bottom'
        },
        {
          text: 'Power Bottom',
          value: 'power-bottom'
        },
        {
          text: 'Bottom',
          value: 'bottom'
        },
        {
          text: 'Passive Bottom',
          value: 'passive-bottom'
        },
        {
          text: 'Oral',
          value: 'oral'
        },
        {
          text: 'Oral (give only)',
          value: 'give-oral'
        },
        {
          text: 'Oral (get only)',
          value: 'get-oral'
        },
        {
          text: 'Observer',
          value: 'observer'
        },
        {
          text: 'Learning',
          value: 'learning'
        }
      ],
      sexualInterestsOptions: [
        {
          text: 'Jack Off',
          value: 'jo'
        },
        {
          text: 'Oral',
          value: 'oral'
        },
        {
          text: 'Fucking',
          value: 'fucking'
        },
        {
          text: '1 On 1',
          value: '1-on-1'
        },
        {
          text: 'Group Sex',
          value: 'group'
        },
        {
          text: 'Rimming',
          value: 'rimming'
        },
        {
          text: 'Kissing',
          value: 'kissing'
        },
        {
          text: 'Leather',
          value: 'leather'
        },
        {
          text: 'Role Playing',
          value: 'role-playing'
        },
        {
          text: 'S&M',
          value: 's-m'
        },
        {
          text: 'Nipples',
          value: 'nipples'
        },
        {
          text: 'Feet',
          value: 'feet'
        },
        {
          text: 'Toys',
          value: 'toys'
        },
        {
          text: 'Voyeurism',
          value: 'voyeurism'
        },
        {
          text: 'Exhibition',
          value: 'exhibition'
        },
        {
          text: 'Jocks',
          value: 'jocks'
        },
        {
          text: 'Verbal',
          value: 'verbal'
        },
        {
          text: 'Gang Bangs',
          value: 'gang-bangs'
        },
        {
          text: 'Glory Holes',
          value: 'glory-holes'
        },
        {
          text: 'Uniforms',
          value: 'uniforms'
        },
        {
          text: 'Cowboys',
          value: 'cowboys'
        },
        {
          text: 'Bears',
          value: 'bears'
        },
        {
          text: 'Daddies',
          value: 'daddies'
        },
        {
          text: 'Trans Girls',
          value: 'mtf'
        },
        {
          text: 'Cross Dressing',
          value: 'cd'
        },
        {
          text: 'Chubs',
          value: 'chubs'
        },
        {
          text: 'Twinks',
          value: 'twinks'
        },
        {
          text: 'Tattoos',
          value: 'tattoos'
        },
        {
          text: 'Piercings',
          value: 'piercings'
        },
        {
          text: 'Raunchy',
          value: 'raunchy'
        },
        {
          text: 'Older Guys',
          value: 'older'
        },
        {
          text: 'Younger Guys',
          value: 'younger'
        }
      ]
    }
  };
}

const Apply = ({
  email: incoming_email,
  referring_email,
  spectrumOptions,
  relationshipOptions,
  timeOfDayOptions,
  sexualRolesOptions,
  sexualInterestsOptions
}: PageProps) => {
  const { user, error, isLoading } = useUser();
  const { name, email } = user!;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: name?.split(' ')[0] || name,
      last_name: name?.split(' ')[1] || '',
      email,
      incoming_email,
      referring_email,
      email_verified: email == incoming_email,
      phone: null,
      biography: null,
      needs_guidance: false,
      spectrum: null,
      relationship_status: null,
      event_availability: [],
      //age: undefined,
      //height: '',
      //weight: undefined,
      sexual_roles: [],
      sexual_interests: []
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const onSubmit = (data: any) => console.log(data);
  const {
    h2page,
    h3section,
    input,
    select,
    label,
    textArea,
    checkbox,
    checkboxLabel
  } = styles;
  const formSection = 'flex flex-col md:flex-row flex-wrap';
  const controlGroup = 'w-full md:w-1/2 mb-4';
  const controlGroup1 = controlGroup + ' md:pr-1.5';
  return (
    <>
      <Head>
        <title>Apply</title>
      </Head>
      <section className={tw`bg-gray-900`}>
        <h2 className={tw(h2page)}>Begin Application</h2>
        <div className={tw`max-w-2xl px-4 py-8 mx-auto lg:py-16 text-left`}>
          <form action="#" onSubmit={handleSubmit(onSubmit)}>
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
            <h3 className={tw`${h3section} !text-2xl !text-left`}>
              Preferences
            </h3>
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
                  Preferred Roles
                  <Info>
                    What roles are you interested in? We will use this to match
                    you with compatible brothers. Select all that apply.
                  </Info>
                </label>
                <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
                  {sexualRolesOptions?.map(({ text, value }, index) => (
                    <div key={index.toString()} className={tw`flex flex-row`}>
                      <input
                        id={value}
                        type="checkbox"
                        value={value}
                        {...register('sexual_roles')}
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
                    What really gets you going? We will use this to invite you
                    to compatible events. Select all that apply.
                  </Info>
                </label>
                <div className={tw`grid grid-cols-2 md:grid-cols-3 gap-2`}>
                  {sexualInterestsOptions?.map(({ text, value }, index) => (
                    <div key={index.toString()} className={tw`flex flex-row`}>
                      <input
                        id={value}
                        type="checkbox"
                        value={value}
                        {...register('sexual_interests')}
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

            <input type="hidden" {...register('referring_email')} />
            <input type="hidden" {...register('incoming_email')} />
            <input type="hidden" {...register('email_verified')} />
            <div className={tw`flex items-center space-x-4`}>
              <button
                type="submit"
                className={tw`text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800`}
              >
                Apply
              </button>
            </div>
          </form>

          <Script src="https://cdn.jsdelivr.net/npm/flowbite@latest/dist/flowbite.js"></Script>
        </div>
      </section>
    </>
  );
};

// Protected route, checking user authentication client-side.(CSR)
export default withPageAuthRequired(Apply);
