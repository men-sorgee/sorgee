
import { useState, ReactNode } from 'react';
import { useUser } from 'lib/hooks/use-user';
import { withPageAuthRequired, UserProfile } from '@auth0/nextjs-auth0';
import { tw } from 'twind';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-gray-700	max-w-3xl w-full rounded-md m-auto my-8">
      <div className={tw`px-5 py-4`}>
        <h3 className={tw`text-2xl mb-1 font-medium`}>{title}</h3>
        <p className={tw`text-gray-300`}>{description}</p>
        {children}
      </div>
      <div
        className={tw`border-t border-gray-700 bg-gray-900 p-4 text-gray-500 rounded-b-md`}
      >
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/api/auth/login'
});

export default function Account({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className={tw`bg-black mb-32`}>
      <div
        className={tw`max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8`}
      >
        <div className={tw`sm:flex sm:flex-col sm:text-center`}>
          <h1
            className={tw`text-4xl font-extrabold text-white sm:text-center sm:text-6xl`}
          >
            Account
          </h1>
          <p
            className={tw`mt-5 text-xl text-gray-200 sm:text-center sm:text-2xl max-w-2xl m-auto`}
          >
            Manage your account details and subscription here.
          </p>
        </div>
      </div>
    </section>
  );
}
