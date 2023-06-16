import { parseInvite } from 'lib/utils/server'
import { NextPageContext } from 'next'

import Apply, { getServerSideProps as getProps } from './apply'

export async function getServerSideProps(context: NextPageContext) {
  const { props } = await getProps(context)

  try {
    const { invite } = context.query
    if (invite == undefined) {
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
