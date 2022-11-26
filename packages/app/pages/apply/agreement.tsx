import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { tw } from 'twind';
import { useMember } from 'lib/hooks/use-member';
import styles from 'styles';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AgreementData } from '../../lib/types'

function Agreement() {
  const router = useRouter();
  const { loading, member } = useMember();
  const [agreed, setAgreed] = useState(false);
  const { handleSubmit, register, formState: { errors }, setError } = useForm<AgreementData>();
  useEffect(() => {
    if (member && member?.application_status !== 'agreement') {
      router.push(`/apply/${member.application_status}`);
      return;
    }
  }, [member, loading, router]);

  const onSubmit = async (data) => {
    const response = await fetch('/api/admin/agree', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(JSON.stringify(data))
    });

    if (response.ok) {
      setAgreed(true);
      router.push('/apply')
    } else {
      const { error } = await response.json();
      setError('agree', { message: error });
    }
  }

  return (<>
      <Head>
        <title>Application: Agreement</title>
      </Head>
      <section className={tw`${styles.sectionDark}`}>
        <h2 className={tw(styles.h2page)}>Application: Agreement</h2>
        { !agreed &&
        <form
          action="#"
          onSubmit={handleSubmit(onSubmit)}
          className={tw`max-w-3xl mx-auto text-center`}
        >
          <p className={tw(styles.pLg)}>
            Please read and agree to our <a href="/terms" 
            target="_blank" className={tw(styles.link)}> terms
            and conditions</a>.
          </p>
        
          <div className={tw(`flex flex-row items-center align-middle justify-center mx-auto`)}>
            <input
              id="agree"
              type="checkbox"
              {...register('agree', { required: true })}
              className={tw(styles.checkbox)}
            />
            <label
              htmlFor={'agree'}
              className={tw(styles.checkboxLabel)}
            >
              I have read the terms and conditions and herby agree to them.
            </label>
          </div>
          <div className={tw`text-center space-x-4 mt-2 pt-4`}>
            <button
              type="submit"
              className={tw(styles.buttonPrimary)}
            >
              Agree
            </button>
          </div>
        </form>}
      </section>
    </>)
}

export default withPageAuthRequired(Agreement);