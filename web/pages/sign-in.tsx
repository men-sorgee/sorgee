import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, FormEvent } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabaseClient } from '@supabase/auth-helpers-nextjs';

import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import LoadingDots from 'components/ui/LoadingDots';
import Logo from 'components/icons/Logo';
import { Provider } from '@supabase/supabase-js';
import { getURL } from 'lib/utils/helpers';
import { tw } from 'twind';
import React from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: ''
  });
  const router = useRouter();
  const { user } = useUser();

  const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});

    const { error } = await supabaseClient.auth.signIn(
      { email, password },
      { redirectTo: getURL() }
    );
    if (error) {
      setMessage({ type: 'error', content: error.message });
    }
    if (!password) {
      setMessage({
        type: 'note',
        content: 'Check your email for the magic link.'
      });
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: Provider) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signIn({ provider });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user]);

  if (!user)
    return (
      <div className={tw`flex justify-center`}>
        <div
          className={tw`flex flex-col justify-between max-w-lg p-3 m-auto w-80 `}
        >
          <div className={tw`flex justify-center pb-12 `}>
            <Logo width="64px" height="64px" />
          </div>
          <div className={tw`flex flex-col space-y-4`}>
            {message.content && (
              <div
                className={`${
                  message.type === 'error' ? 'text-pink-500' : 'text-green-500'
                } border ${
                  message.type === 'error'
                    ? 'border-pink-500'
                    : 'border-green-500'
                } p-3`}
              >
                {message.content}
              </div>
            )}
            <Link href="/api/auth/login">
              <a className={tw``}>Sign In</a>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className={tw`m-6`}>
      <LoadingDots />
    </div>
  );
};

export default SignIn;
