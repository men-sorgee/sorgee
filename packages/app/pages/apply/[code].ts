import { NextPageContext } from 'next'
import { default as Apply, getServerSideProps as getProps } from './index'
import { parseInvite } from 'lib/utils/server'
import { findPromo } from 'lib/services/directus/server'

export async function getServerSideProps(context: NextPageContext) {
  const { props } = await getProps(context)

  try {
    const { code } = context.query

    const promo = await findPromo(code as string)
    if (promo) {
      props.promo = promo
      return props
    }

    const parsedInvite = parseInvite(code as string)
    const { e } = parsedInvite
    if (e) {
      props.invite = parsedInvite
    }
  } catch (error) {
    console.debug(error)
  }
  return { props }
}

export default Apply
