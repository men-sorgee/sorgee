import { NextPageContext } from 'next'

import { default as MemberList, getServerSideProps as indexProps } from './index'

export async function getServerSideProps(ctx: NextPageContext) {
  const { id } = ctx.query
  const { props } = await indexProps(ctx)
  if (id) {
    props.id = id as string
  }

  return {
    props,
  }
}

export default MemberList
