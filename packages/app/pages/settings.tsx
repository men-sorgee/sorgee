import { GetServerSideProps } from 'next';
//import Profile from '@/components/profile';
import  defaultMetaProps from '@/components/layout/meta';
//import { getUser, getAllUsers, UserProps, getUserCount } from 'lib/hooks/use-user';
import { getSession } from '@auth0/nextjs-auth0'
//import { getSession } from 'next-auth/react';

export default function Settings({ user }: { user: any }) {
  return null;//<Profile settings={true} user={user} />;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession( req, res);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }

  //const results = await getAllUsers();
  //const totalUsers = await getUserCount();
//
  //const user = await getUser(session.username as string);

  const meta = {
    ...defaultMetaProps,
    title: `Settings | MongoDB Starter Kit`
  };

  return {
    props: {
      meta,
      //results,
      //totalUsers,
      //user
    }
  };
};
