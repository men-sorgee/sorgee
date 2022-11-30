import Head from 'next/head';

import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from '../../lib/hooks/use-member';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { copyTextToClipboard } from '../../lib/utils';
import { UserInvite } from 'lib/services/directus';
import { getFieldOptions } from 'lib/services/directus/server';
import { FormOptions } from '../../lib/types';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from 'react-daisyui';

type PageProps = {
  userTypeOptions: FormOptions;
};

export async function getServerSideProps(context) {
  const userTypeOptions = await getFieldOptions('user_type');
  const exclude = ['subscriber', 'user', 'reject', 'staff', 'big_brother'];
  return {
    props: {
      userTypeOptions: userTypeOptions.filter((o) => !exclude.includes(o.value))
    }
  };
}

function Invite({ userTypeOptions }: PageProps) {
  const { member, loading } = useAppUser();
  const [link, setLink] = useState<string>();
  const [sent, setSent] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<UserInvite>({
    defaultValues: {
      t: 'pledge'
    }
  });

  useEffect(() => {
    if (sent) {
      setTimeout(() => {
        setSent(false);
        reset();
      }, 5000);
    }
    if (copied) {
      setTimeout(() => {
        setCopied(false);
        reset();
      }, 5000);
    }
  });

  if (loading) return <div>Loading...</div>;

  if (member?.status !== 'active')
    return <div>You aren&apos;t allowed here.</div>;

  const getLink = ({ e, t }: UserInvite) => {
    const data = Buffer.from(JSON.stringify({ e, t, v: member.id })).toString(
      'base64'
    );
    const invite = `${location.protocol}//${location.host}/apply/${data}`;
    setLink(invite);
    return invite;
  };

  const onCopyClick = (e) => {
    e.preventDefault();
    const invite = getLink(e.target.dataset);
    copyTextToClipboard(invite);
    setCopied(true);
    setSent(false);
  };

  const onSubmit = async (data: UserInvite) => {
    const invite = getLink(data);
    const response = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: Buffer.from(
        JSON.stringify({
          email: data.e,
          link: invite
        })
      )
    });

    if (response.ok) {
      setSent(true);
      setCopied(false);
    } else {
      const { error } = await response.json();
      setError('e', { message: error });
    }
  };

  return (
    <>
      <Head>
        <title>Invite Link</title>
      </Head>
      <section className="dark">
        <h2 className="">Invite Someone</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
          <p className="text-xl">
            {member?.first_name || 'Brother'}, enter your friend&apos;s email
            address and we will create a special link for you to share.
          </p>
          <div className="grid grid-cols-1 gap-4 ">
            <div>
              <input
                type="email"
                autoComplete="email"
                {...register('e', { required: true })}
                className="input"
                placeholder="Email address"
              />
              <ErrorMessage errors={errors} name="e" />
            </div>
            {member?.user_type == 'staff' && (
              <div>
                <select
                  {...register('t', { required: true })}
                  className="select"
                >
                  {userTypeOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Button onClick={onCopyClick}>Copy Link</Button>
            <Button color="primary" type="submit">
              Send Invite
            </Button>
          </div>
        </form>

        {copied && (
          <p className=" mt-8">
            Your &nbsp;
            <a
              title={link}
              target={'_blank'}
              href={link}
              className="link"
              rel="noreferrer"
            >
              link
            </a>
            &nbsp; has been copied to your clipboard.
          </p>
        )}
        {sent && (
          <p className=" mt-8">
            Your &nbsp;
            <a
              title={link}
              target={'_blank'}
              href={link}
              className="link"
              rel="noreferrer"
            >
              link
            </a>
            &nbsp; was sent.
          </p>
        )}
      </section>
    </>
  );
}

export default withPageAuthRequired(Invite);
