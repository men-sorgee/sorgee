import Head from 'next/head';
import React, { useEffect } from 'react';
import Fire from '../components/icons/fire';
import { useForm, FormProvider } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import { SubscriptionData } from 'lib/types';
import { useAppUser } from '../lib/hooks/use-member';
import { Button } from 'react-daisyui';
import FieldInput from '../components/forms/FieldInput';
import { GetStaticProps } from 'next';
import { useMeta } from '../lib/hooks/user-meta-context';

export const getStaticProps: GetStaticProps = async (context) => {
  const pageId = 'ac330d1b-0340-4a61-9b42-996aa0936d2b';
  return {
    props: {}
  };
};

export default function Home() {
  useMeta('Home');
  const { user } = useUser();
  const { member } = useAppUser();
  const [subscribed, setSubscribed] = React.useState(false);
  const methods = useForm<SubscriptionData>({
    defaultValues: {
      email: user?.email,
      name: user?.name
    }
  });
  const { handleSubmit, setError } = methods;
  const onSubmit = async (data: SubscriptionData) => {
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
  };

  useEffect(() => {
    if (member && member.user_type != 'user') {
      setSubscribed(true);
    }
  }, [subscribed, member, user]);

  return (
    <>
      <section className="">
        <div className="flex max-w-6xl flex-col-reverse items-center md:flex-row ">
          <div className="mt-4 hidden md:block md:w-1/2">
            <Fire />
          </div>
          <div className=" md:w-1/2">
            <h2>Too Hot for the Public</h2>
            <p>
              A hot new social club for men who value discretion. We facilitate
              discrete events, in safe environments for men to express, explore
              and discover with other like-minded men.
            </p>
            <p className="italic">This club is invite only.</p>
          </div>
        </div>
      </section>

      <section className="">
        <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row ">
          <div className="mb-4 w-full pr-8 md:mb-0 md:w-1/2">
            <h3>Interested?</h3>
            <p>
              Learn more about us and get important updates by subscribing to
              our newsletter!
            </p>
          </div>
          <div className="w-full text-left md:w-1/2">
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 gap-4"
              >
                <FieldInput
                  field="email"
                  registerOptions={{
                    required: true
                  }}
                  type="email"
                  placeholder="email@gmail.com"
                  autoComplete="false"
                />
                <FieldInput
                  field="name"
                  registerOptions={{
                    required: true
                  }}
                  placeholder="Willy Dicks"
                />
                <div className="grid grid-cols-2 gap-4 align-top">
                  <Button disabled={member != null} color="primary">
                    Get Notifications
                  </Button>
                  <p className="text-xs text-gray-500">
                    By subscribing, you agree with our{' '}
                    <a href="/terms">Terms of Service</a>
                    and <a href="/privacy">Privacy Policy</a>.
                  </p>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </section>

      <section className="">
        <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
          <h3 className="  !md:text-6xl mt-8 sm:w-1/2">
            Real Men, <br className="hidden md:inline" />
            No Drama
          </h3>
          <div className=" w-full md:w-1/2">
            <p className="md:text-left">
              All members are verified by staff or vouched for by trusted
              members. We are building a community of real guys who are
              seriously looking for fun, and doing so with integrity.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
