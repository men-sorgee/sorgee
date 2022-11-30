import { NextPageContext } from 'next';
import { UserInvite } from 'lib/services/directus';
import {
  default as Apply,
  getServerSideProps as getProps,
  PageProps
} from 'pages/apply';

export async function getServerSideProps(context: NextPageContext) {
  const { props }: { props: PageProps } = await getProps(context);

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
    console.warn(error);
  }
  return { props };
}

export default Apply;
