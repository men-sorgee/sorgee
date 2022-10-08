import { useEffect, useState, createContext, useContext } from 'react';
//import { useUser as useSupaUser, User } from '@supabase/auth-helpers-react';
import { useUser as useAuthUser, UserProfile } from '@auth0/nextjs-auth0';
import { DirectusModels, Subscriber, User } from 'types';
import { Subscription } from 'types';
import { Directus, ID, QueryOne } from '@directus/sdk';
// import {  } from '@supabase/auth-helpers-nextjs';

type UserContextType = {
  accessToken: string | null;
  user?: UserProfile | null;
  userDetails: Subscriber | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  directusClient: Directus<DirectusModels> | null;
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const { directusClient: directus } = props;
  const { user, isLoading: isLoadingUser } = useAuthUser();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  const getUserDetails = (id: ID) => directus!.items('users').readOne(id);

  useEffect(() => {
    if (user && !isLoadingData && !userDetails) {
      setIsLoadingData(true);
      getUserDetails(user.email!).then((userDetails) => {
        if (userDetails != null) {
          setUserDetails(userDetails as User);
        }
        setIsLoadingData(false);
      });
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    accessToken: null,
    user,
    userDetails: null, // fix
    isLoading: isLoadingUser || isLoadingData,
    subscription: null // fix
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};
