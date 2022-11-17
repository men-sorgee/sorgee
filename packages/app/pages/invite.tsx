import Head from 'next/head';
import styles from 'index';
import { tw } from 'twind';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useUser } from '../lib/hooks/use-user';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { copyTextToClipboard } from '../lib/utils/helpers';

function Invite() {
  const { userDetails, isLoading } = useUser();
  const [link, setLink] = useState<string>();
  const { handleSubmit, register } = useForm({
    defaultValues: { email: '' }
  });

  if (isLoading) return <div>Loading...</div>;

  if (userDetails?.status !== 'active')
    return <div>You aren&apos;t allowed here.</div>;

  const getLink = (data: { email: string }) => {
    const { email } = data;
    const id = Buffer.from(email).toString('base64');
    setLink(
      `${location.protocol}://${location.host}/apply?id=${id}&vid=${
        userDetails!.id
      }`
    );
  };
  const copy = () => {
    copyTextToClipboard(link!);
  };

  return (
    <>
      <Head>
        <title>Invite Link</title>
      </Head>
      <section className={tw(styles.sectionDark)}>
        <h2 className={tw(styles.h2page)}>Invite Someone</h2>

        <form
          onSubmit={handleSubmit(getLink)}
          className={tw`max-w-3xl mx-auto`}
        >
          <p className={tw(styles.p)}>
            {userDetails!.first_name}, enter your friend&apos;s email address
            and we will create a special link for you to share.
          </p>
          <div className={tw`grid grid-cols-1 gap-4 `}>
            <input
              type="email"
              {...register('email', { required: true })}
              className={tw(styles.input)}
              placeholder="Email address"
            />
            <button className={tw(styles.buttonPrimary)}>Get Link</button>
          </div>
        </form>
        <div className={tw`block`}>
          {link && (
            <pre
              onClick={copy}
              className={tw`mt-8 border rounded bg-gray-800 text-white p-8`}
            >
              {link}
            </pre>
          )}
        </div>
      </section>
    </>
  );
}

export default withPageAuthRequired(Invite);
