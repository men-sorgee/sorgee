import { NextPageContext } from 'next';
import { UserInvite } from 'lib/models';
import { default as Apply, getServerSideProps as getProps } from './index';

export function parseInvite(invite: string): UserInvite {
  const inviteJson = Buffer.from(invite, 'base64').toString('utf-8');
  return JSON.parse(inviteJson);
}

export async function getServerSideProps(context: NextPageContext) {
  const { props } = await getProps();

  try {
    const { invite } = context.query;
    const parsedInvite = parseInvite(invite as string);

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
