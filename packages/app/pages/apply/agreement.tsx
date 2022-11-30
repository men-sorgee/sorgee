import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import ApplicationSteps from './_steps';
import { useAppUser } from 'lib/hooks/use-member';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AgreementData } from '../../lib/types';
import { Button } from 'react-daisyui';
import FieldCheckbox from '../../components/forms/FieldCheckbox';
import { postJSON } from '../../lib/utils';

function Agreement() {
  const router = useRouter();
  const { loading, member } = useAppUser();
  const [agreed, setAgreed] = useState(false);
  const methods = useForm<AgreementData>();
  const { handleSubmit, setError } = methods;
  useEffect(() => {
    if (!loading && member && member?.application_status !== 'agreement') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  async function onSubmit(data: AgreementData) {
    const [success, response] = await postJSON('/api/admin/agree', data);

    if (success) {
      setAgreed(true);
      router.push('/apply/approved');
    } else if (Array.isArray(response.errors)) {
      response.errors.forEach((e) => {
        setError(e.extensions.field as any, { message: e.message });
      });
    } else {
      setError('agree', { message: 'Something went wrong' });
    }
  }

  return (
    <>
      <Head>
        <title>Indemnification</title>
      </Head>
      <section className="dark ">
        <h1>Indemnification Agreement</h1>
        <ApplicationSteps status={'agreement'} />
        {!agreed && (
          <FormProvider {...methods}>
            <form
              action="#"
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
                ></FieldCheckbox>

                <div className="mt-2 flex space-x-4 pt-4 text-center">
                  <Button color="primary" type="submit">
                    Agree & Continue
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        )}
      </section>
    </>
  );
}

export default withPageAuthRequired(Agreement);
