import { NextPageContext } from 'next'
import { default as Apply, getServerSideProps as getProps } from './index'
import { parseInvite } from 'lib/utils/server'

export async function getServerSideProps(context: NextPageContext) {
  const { props } = await getProps()

  try {
    const { invite } = context.query
    const parsedInvite = parseInvite(invite as string)

    const { e } = parsedInvite
    if (e) {
      props.email = e
      props.invite = invite as string
    }
  } catch (error) {
    console.debug(error)
  }
  return { props }
}

export default Apply
