import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ApplicationSteps from './_steps';
import { useMember } from 'lib/hooks/use-member';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AgreementData, Props } from 'models';
import { Button } from 'react-daisyui';
import FieldCheckbox from 'components/forms/FieldCheckbox';
import { postJSON } from 'lib/utils/client';
import Page from 'components/layout/Page';

function Agreement() {
  const router = useRouter();
  const { loading, member } = useMember();
  const [completed, setCompleted] = useState(false);

  if (
    member &&
    member?.application_status &&
    member.application_status !== 'agreement'
  ) {
    router.push('/apply/' + member?.application_status);
    return null;
  }

  return (
    <Page
      title="Agreement"
      loading={loading || completed}
      sectionClass="gradient p-4"
      header={<ApplicationSteps status={'agreement'} />}
    >
      <Form {...{ router, setCompleted }} />
    </Page>
  );
}

function Form({ router, setComplete }: Props) {
  const methods = useForm<AgreementData>();
  const { handleSubmit, setError } = methods;

  async function onSubmit(data: AgreementData) {
    const [success, response] = await postJSON('/api/member/agree', data);

    if (success) {
      setComplete(true);
      router.push('/apply/approved');
    } else if (response.error?.field) {
      setError(response.error!.field as any, response.error.message as any);
    } else {
      setError('agree', { message: 'Something went wrong' });
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="text-center text-xl">
          Please read and agree to our{' '}
          <a href="/terms" target="_blank" className="link">
            {' '}
            terms and conditions
          </a>
          .
        </p>
        <div className="flex-cols-1 mx-auto mt-4 flex max-w-md flex-col text-center">
          <FieldCheckbox
            field="agree"
            label="I agree to the terms and conditions"
            registerOptions={{
              required: {
                value: true,
                message: 'You must agree to the terms and conditions'
              }
            }}
          />

          <div className="mt-2 flex space-x-4 pt-4 text-center">
            <Button color="primary" type="submit">
              Agree & Continue
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default withPageAuthRequired(Agreement);
