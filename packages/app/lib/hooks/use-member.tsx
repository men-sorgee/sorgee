import { useEffect, useState, createContext, useContext } from 'react';
import { useUser, UserProfile } from '@auth0/nextjs-auth0';
import { FormUser, userFields } from 'lib/services/directus';
import { fetcher } from '@/lib/utils';

export type Context = {
  user?: UserProfile;
  member?: FormUser;
  loading: boolean;
  fields: string[];
};

export const MemberContext = createContext<Context | undefined>(undefined);

export interface Props {
  [propName: string]: any;
}

export const MemberContextProvider = (props: Props) => {
  const { user, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<FormUser>();

  useEffect(() => {
    if (user && !member) {
      fetcher<FormUser>('/api/admin/me')
        .then(setMember)
        .catch(console.debug)
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, member]);

  const value: Context = {
    user,
    member,
    loading,
    fields: userFields
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
