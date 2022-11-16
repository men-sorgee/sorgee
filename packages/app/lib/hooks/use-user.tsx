import { useEffect, useState, createContext, useContext } from 'react';
import { useUser as useAuthUser, UserProfile } from '@auth0/nextjs-auth0';
import { User } from 'lib/services/directus';
import { fetcher } from 'lib/utils/helpers';

export type UserContext = {
  accessToken: string | null;
  user: UserProfile | null;
  userDetails: User | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContext | undefined>(undefined);

export interface Props {
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const { user, isLoading: isLoadingUser } = useAuthUser();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const getUserDetails = async () => {
    try {
      const result = await fetcher<User | null>('/api/admin/me');
      if (result != null) {
        setUserDetails(result);
      }
    } catch (error) {
      // ignore
    }
  };

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsLoadingData(true);
      getUserDetails().finally(() => setIsLoadingData(false));
    }
  }, [user, isLoadingUser, isLoadingData, userDetails]);

  const value: UserContext = {
    accessToken: null,
    user: user || null,
    userDetails: userDetails || null,
    isLoading: isLoadingUser || isLoadingData
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
