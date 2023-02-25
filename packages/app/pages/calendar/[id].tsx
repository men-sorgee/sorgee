import { NextPageContext } from 'next'
import { pruneUndefined } from 'lib/utils'
import { default as EventList, PageProps } from './index'

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  return {
    props: pruneUndefined({
      id: String(context.query.id),
    }),
  }
}

export default EventList
