import { GetServerSideProps } from 'next';
import { getSession } from '@auth0/nextjs-auth0';

export default function Profile() {
  return (
  <>
  <div>Profile</div>
  
  </>)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/'
      }
    };
  }
  return {
    redirect: {
      permanent: false,
      destination: `/${session.username}`
    }
  };
};
