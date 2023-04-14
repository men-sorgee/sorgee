import { NextPageContext } from 'next'
import { default as Apply, getServerSideProps as getProps } from './apply'
import { parseInvite } from 'lib/utils/server'

export async function getServerSideProps(context: NextPageContext) {
  const { props } = await getProps(context)

  try {
    const { invite } = context.query
    if (!invite) {
      return { props }
    }
    const parsedInvite = parseInvite(invite as string)
    const { e } = parsedInvite
    if (e) {
      props.invite = parsedInvite
    }
  } catch (error) {
    console.error(error)
  }
  return { props }
}

export default Apply
