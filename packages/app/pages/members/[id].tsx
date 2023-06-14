import { pruneUndefined } from 'lib/utils'
import { NextPageContext } from 'next'

import MemberList, { QueryParams } from './index'

export async function getServerSideProps(ctx: NextPageContext) {
  const { getFields } = await import('lib/services/directus/server')
  const fieldMap = await getFields('users')

  const params = (ctx.query as unknown as QueryParams) || ({} as QueryParams)

  const props: any = {
    fieldMap,
    params
  }

  const { id } = ctx.query
  if (id) {
    props.id = String(id)
  }

  return {
    props: pruneUndefined(props)
  }
}

export default MemberList
