import { NextPageContext } from 'next';
import { UserInvite } from 'lib/services/directus';
import { default as Apply, getServerSideProps as getProps } from './index';

export async function getServerSideProps(context: NextPageContext) {
  const { props } = await getProps();

  try {
    const { invite } = context.query;
    const inviteJson = Buffer.from(invite as string, 'base64').toString(
      'utf-8'
    );
    const parsedInvite: UserInvite = JSON.parse(inviteJson);
    const { e } = parsedInvite;
    if (e) {
      props.email = e;
      props.invite = invite as string;
    }
  } catch (error) {
    console.debug(error);
  }
  return { props };
}

export default Apply;
