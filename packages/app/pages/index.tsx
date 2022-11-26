import Head from 'next/head';
import React, { useEffect } from 'react';
import { tw } from 'twind';
import styles from 'styles';
import Fire from '../components/icons/fire';
import { useForm, FieldError } from 'react-hook-form'
import { useUser } from '@auth0/nextjs-auth0'
import { SubscriptionData } from 'lib/types'
import { ErrorMessage } from '@hookform/error-message'
import { useAppUser } from '../lib/hooks/use-member'

export default function Home() {
  const { user } = useUser();
  const { member } = useAppUser();
  const [subscribed, setSubscribed] = React.useState(false);
  const { handleSubmit, register, setError, formState: {
    errors,
  }} = useForm<SubscriptionData>({
    defaultValues: {
      email: user?.email,
      name: user?.name,
    }
  });
  useEffect(() => {
    if (member && member.user_type != 'user' ) {
      setSubscribed(true);
    }
  }, [subscribed, member, user]);
  const onSubmit = async (data:SubscriptionData) => {
    const response = await fetch('/api/admin/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify(data))
    });

    if (response.ok) {
      setSubscribed(true);
    } else {
      const { error } = await response.json();
      setError('email', { message: error });
    }
  }
  return (
    <>
      <Head>
        <title>Home </title>
      </Head>

      <section className={tw(styles.sectionWhite)}>
        <div
          className={tw`flex flex-col items-center md:flex-row max-w-6xl flex-col-reverse `}
        >
          <div className={tw`hidden md:block md:w-1/2 mt-4`}>
             <Fire  />
          </div>
          <div className={tw` md:w-1/2`}>
            <h2 className={tw(styles.h2page)}>Too Hot for the Public</h2>
            <p>
              A hot new social club for men who value discretion. 
              We facilitate discrete events, in safe environments
              for men to express, explore and discover with other
              like-minded men.
            </p>
            <p className={tw`italic`}>
              This club is invite only, but soon we will accept
              applications from 

            </p>
          </div>
        </div>
      </section>
      { subscribed ? 
      <section className={tw(styles.sectionDark)}>
        <div className={tw`max-w-6xl mx-auto flex flex-col items-center md:flex-row `}>
            <div className={tw`w-full mb-4 md:mb-0 pr-8`}>
              <h3 className={tw`${styles.h3section} `}>Interest Noted</h3>
              <p>
                You are signed up to get important updates with 
                our newsletter!
              </p>
            </div>
          </div>
      </section> :
      <section className={tw(styles.sectionDark)}>
        <div className={tw`max-w-6xl mx-auto flex flex-col items-center md:flex-row `}>
            <div className={tw`w-full md:w-1/2 mb-4 md:mb-0 pr-8`}>
              <h3 className={tw`${styles.h3section} `}>Interested?</h3>
              <p>
                Learn more about us and get important updates by 
                subscribing to our newsletter!
              </p>
            </div>
            <div className={tw`w-full md:w-1/2 text-left`}>
              <form
                onSubmit={handleSubmit(onSubmit)}
              >

                <div className={tw`mb-2`}>
                  <input
                    type="text"
                    {...register('name', {required: true})}
                    className={tw(styles.input)}
                    placeholder="Name"
                  />
                </div>
                <div className={tw`mb-2`}>
                  <input
                    type="email"
                    {...register('email', {required: true})}
                    className={tw(styles.input)}
                    placeholder="Email address"
                    autoComplete="email"
                  />
                  <ErrorMessage
                    render={(m) => (
                      <div className={tw(styles.inputError)}>{m.message}</div>
                    )}
                    errors={errors} 
                    name="email" />
                </div>
                <div className={tw`block`}>
                  <button className={tw(styles.buttonPrimary)}>
                    Get Notifications
                  </button>
                </div>
              </form>
            </div>
       
        </div>
      </section>
      }
      <section className={tw(styles.sectionWhite)}>
        <div
          className={tw`flex flex-col items-center max-w-6xl mx-auto md:flex-row`}
        >
          <h3 className={tw`${styles.h3section} sm:w-1/2 !md:text-6xl mt-8`}>
            Real Men, <br className={tw`hidden md:inline`} />
            No Drama
          </h3>
          <div className={tw` w-full md:w-1/2`}>
            
            <p className={tw`md:text-left`}>
              All members are verified by staff or vouched for by trusted members. 
              We are building a community of real guys who are seriously looking for fun,
              and doing so with integrity.
            </p>
           
          </div>
        </div>
      </section>
      <section className={tw(styles.sectionDark)}>
        <div
          className={tw`flex flex-col items-start max-w-6xl mx-auto md:flex-row flex-col-reverse`}
        >
          <div className={tw`w-full md:w-1/2 `}>
            <p>
              
            </p>
          
          </div>
          <div className={tw`w-full md:w-1/2 !md:text-right`}>
           
            <h3 className={tw`${styles.h3section}] !text-green`}>
              
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}
