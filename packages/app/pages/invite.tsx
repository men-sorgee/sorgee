import Head from 'next/head';
import styles from 'styles';
import { tw } from 'twind';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMember } from '../lib/hooks/use-member';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { copyTextToClipboard } from '../lib/utils';
import {
  getFieldOptions,
  FormOptions,
  UserInvite
} from 'lib/services/directus';
import Toast from '../components/layout/Toast';

type PageProps = {
  userTypeOptions: FormOptions;
};

export async function getServerSideProps(context) {
  const userTypeOptions = await getFieldOptions('user_type');
  const exclude = ['subscriber', 'reject'];
  return {
    props: {
      userTypeOptions: userTypeOptions.filter((o) => !exclude.includes(o.value))
    }
  };
}

function Invite({ userTypeOptions }: PageProps) {
  const { member, loading } = useMember();
  const [link, setLink] = useState<string>();
  const { handleSubmit, register } = useForm<UserInvite>({
    defaultValues: {
      t: 'pledge'
    }
  });

  if (loading) return <div>Loading...</div>;

  if (member?.status !== 'active')
    return <div>You aren&apos;t allowed here.</div>;

  const getLink = ({ e, t }) => {
    const data = Buffer.from(JSON.stringify({ e, t, v: member.id })).toString(
      'base64'
    );
    setLink(`${location.protocol}//${location.host}/apply/${data}`);
    copyTextToClipboard(link!);
  };
  const copy = () => {};

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
          <p className={tw(styles.pLg)}>
            {member?.first_name || 'Brother'}, enter your friend&apos;s email
            address and we will create a special link for you to share.
          </p>
          <div className={tw`grid grid-cols-1 gap-4 `}>
            <input
              type="email"
              {...register('e', { required: true })}
              className={tw(styles.input)}
              placeholder="Email address"
            />
            {member?.privileged && (
              <select
                {...register('t', { required: true })}
                className={tw(styles.select)}
              >
                {userTypeOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.text}
                  </option>
                ))}
              </select>
            )}
            <button className={tw(styles.buttonPrimary)}>Copy Link</button>
          </div>
        </form>

        {link && (
          <p className={tw` mt-8`}>
            The &nbsp;
            <a
              title={link}
              target={'_blank'}
              href={link}
              className={tw(styles.link)}
              rel="noreferrer"
            >
              link
            </a>
            &nbsp; has been copied to your clipboard.
          </p>
        )}
      </section>
    </>
  );
}

export default withPageAuthRequired(Invite);
