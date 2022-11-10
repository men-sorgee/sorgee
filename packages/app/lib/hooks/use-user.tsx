import { useEffect, useState, createContext, useContext } from 'react';
import { useUser as useAuthUser, UserProfile } from '@auth0/nextjs-auth0';
import { Directus, ID, QueryOne } from '@directus/sdk';
import { DataSchema, User } from '../directus/types'

type UserContext = {
  accessToken: string | null;
  user: UserProfile | null;
  userDetails: User | null;
  isLoading: boolean;
};

export const UserContext = createContext<UserContext | undefined>(
  undefined
);

export interface Props {
  directusClient: Directus<DataSchema> | null;
  [propName: string]: any;
}

export const UserContextProvider = (props: Props) => {
  const { directusClient: directus } = props;
  const { user, isLoading: isLoadingUser } = useAuthUser();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    
    const getUserDetails = async (email: string) => {
      
    }
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
  }, [user, isLoadingUser, isLoadingData, userDetails, directus]);

  const value = {
    accessToken: null,
    user: user || null,
    userDetails: null,
    isLoading: isLoadingUser || isLoadingData,
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
