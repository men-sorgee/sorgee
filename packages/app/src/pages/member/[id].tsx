import { MemberSpotlight, Page } from 'components'
import { useMember } from 'hooks'

export function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id
    }
  }
}

export default function MemberPage({ id }: { id: string }) {
  const { name, level, loading } = useMember(id)

  return (
    <Page hideHeader title={name} pt={10}>
      <MemberSpotlight memberId={id} full />
    </Page>
  )
}
