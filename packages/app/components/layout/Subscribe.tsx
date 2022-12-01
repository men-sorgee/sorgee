import { FormProvider, useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import { SubscriptionData } from 'lib/types';
import { useAppUser } from 'lib/hooks/use-member';
import React, { useEffect } from 'react';
import { Button } from 'react-daisyui';
import { FieldInput } from '../forms';

export default function Subscribe() {
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
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 grid grid-cols-1 gap-4 md:mx-auto md:w-2/3"
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
        <div className="grid grid-cols-3 gap-2 align-top">
          <Button disabled={member != null} color="primary">
            Get Notifications
          </Button>
          <p className="col-span-2 text-xs text-gray-500">
            By subscribing, you agree with our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
