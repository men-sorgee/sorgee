import { FormProvider, useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import { SubscriptionData } from 'models';
import { useMember } from 'lib/hooks/use-member';
import React, { useEffect } from 'react';
import { Button } from 'react-daisyui';
import { FieldInput } from '../forms';

export default function Subscribe() {
  const { user } = useUser();
  const { member } = useMember();
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
        className="grid grid-cols-2 gap-2 md:gap-4 "
      >
        <FieldInput
          field="name"
          registerOptions={{
            required: true
          }}
          placeholder="Willy Dicks"
        />
        <FieldInput
          field="email"
          registerOptions={{
            required: true
          }}
          type="email"
          placeholder="email@gmail.com"
          autoComplete="false"
        />

        <p className="p-2 text-xs">
          Subscribe only if you agree to our <a href="/terms">Terms </a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
        <Button type="submit" color="accent">
          Get Notifications
        </Button>
      </form>
    </FormProvider>
  );
}
