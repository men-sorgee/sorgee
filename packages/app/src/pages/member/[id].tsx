import { MemberSpotlight, Page } from "components";
import { useMember } from "hooks";

export function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  }
}

export default function MemberPage({ id }: { id: string }) {
  const { name, loading } = useMember(id)

  return (
    <Page hideHeader title={name} pt={10} loading={loading}>
      <MemberSpotlight memberId={id} full size="2xl" />
    </Page>
  )
}
