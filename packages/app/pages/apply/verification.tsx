import { tw } from 'twind';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMember } from 'lib/hooks/use-member';
import styles from 'styles';

function Verification() {
  const { user, member, loading } = useMember();

  return (

      <section className={tw(styles.sectionDark)}>
        <h2 className={tw(styles.h2page)}>Photo Verification</h2>
        <p className={tw(styles.pLg)}>
          To complete your application, take a selfie while holding a piece of
          paper the following verification code on it, and email it to&nbsp;
          <a className={tw(styles.link)} href="mailto:support@guysnheat.com">
            support@guysnheat.com
          </a>
          &nbsp; using the email address you registered with.
        </p>
        {member && (
          <h2 className={tw`font-sans !text-6xl`}>
            {member.id.slice(0, 4)} {member.id.slice(4, 8)}
          </h2>
        )}
        <p className={tw`${styles.pLg} mt-8`}>
          <strong>
            Be sure your face and code is clearly visible, with no sunglasses or
            hats.
          </strong>
          &nbsp; This photo will not be shared with anyone and will not be used
          for your profile.
        </p>
      </section>
    
  );
}

export default withPageAuthRequired(Verification);
