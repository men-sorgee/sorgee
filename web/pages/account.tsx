import Link from 'next/link';
import { useState, ReactNode } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'lib/hooks/useUser';
import { postData } from 'lib/utils/helpers';

import { withPageAuth, User } from '@supabase/auth-helpers-nextjs';
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

export const getServerSideProps = withPageAuth({ redirectTo: '/sign-in' });

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails } = useUser();

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

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
            We partner with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className={tw`p-4`}>
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
          footer={
            <div
              className={tw`flex items-start justify-between flex-col sm:flex-row sm:items-center`}
            >
              <p className={tw`pb-4 sm:pb-0`}>
                Manage your subscription on Stripe.
              </p>
              <Button
                variant="slim"
                loading={loading}
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
            </div>
          }
        >
          <div className={tw`text-xl mt-8 mb-4 font-semibold`}>
            {isLoading ? (
              <div className={tw`h-12 mb-6`}>
                <LoadingDots />
              </div>
            ) : subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">
                <a>Choose your plan</a>
              </Link>
            )}
          </div>
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className={tw`text-xl mt-8 mb-4 font-semibold`}>
            {userDetails ? (
              `${
                userDetails.full_name ??
                `${userDetails.first_name} ${userDetails.last_name}`
              }`
            ) : (
              <div className={tw`h-8 mb-6`}>
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className={tw`text-xl mt-8 mb-4 font-semibold`}>
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}
