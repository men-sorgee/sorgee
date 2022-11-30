import { useEffect, useState, createContext, useContext } from 'react';
import { useUser, UserProfile } from '@auth0/nextjs-auth0';
import { Member } from 'lib/services/directus';
import { getJSON } from 'lib/utils';
import { useRouter } from 'next/router';

export type Context = {
  user?: UserProfile;
  member?: Member;
  loading: boolean;
  reload: () => Promise<void>;
};

export const MemberContext = createContext<Context | undefined>(undefined);

export interface Props {
  [propName: string]: any;
}

export const AppUserContextProvider = (props: Props) => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member>();
  const [subscribed, setSubscribed] = useState(false);
  const router = useRouter();

  function getMember(): Promise<void> {
    if (!loading) setLoading(true);
    return getJSON<Member>('/api/admin/me')
      .then(([m]) => {
        setMember(m as Member);
      })
      .catch((e) => {
        console.debug(e);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isLoading && user && !member) {
      getMember();
    }
    if (!subscribed && user && member) {
      router.events.on('routeChangeStart', async () => {
        await getMember();
        return true;
      });
      setSubscribed(true);
    }
  }, [user, isLoading, subscribed, loading, member]);

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

export const useAppUser = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error(`useMember must be used within a UserContextProvider.`);
  }
  return context;
};
