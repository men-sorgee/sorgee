import { useEffect, useState, createContext, useContext } from 'react';
import { useUser, UserProfile } from '@auth0/nextjs-auth0';

import { useRouter } from 'next/router';
import { Member, Props } from 'models';
import { getJSON } from '../utils/client';

export type Context = {
  user?: UserProfile;
  member?: Member;
  loading: boolean;
  reload: () => Promise<void>;
};

export const MemberContext = createContext<Context | undefined>(undefined);

export const AppUserContextProvider = (props: Props) => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<Member>();
  const [checked, setChecked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const router = useRouter();

  function getMember(): Promise<void> {
    return getJSON<Member>('/api/member/me')
      .then(([ok, res]) => {
        if (ok) setMember(res.data);
        setChecked(true);
      })
      .catch()
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!loading && !checked && user && !member) {
      setLoading(true);
      getMember();
    }
    if (!isLoading && !loading && !subscribed && user && checked) {
      router.events.on('routeChangeStart', async () => {
        return getMember();
      });
      setSubscribed(true);
    }
  }, [user, isLoading, subscribed, loading, member, checked]);

  const value: Context = {
    user,
    member,
    loading,
    reload: () => {
      setLoading(true);
      return getMember();
    }
  };

  return <MemberContext.Provider value={value} {...props} />;
};

export const useMember = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error(`useMember must be used within a UserContextProvider.`);
  }
  return context;
};
