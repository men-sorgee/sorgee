import { MemberSpotlight, Page } from "components";
import { useFields, useMember, useUser } from "hooks";

import { MemberLevel } from "../../lib/models";

export function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  }
}

export default function MemberPage({ id }: { id: string }) {
  const { member, loading: memberLoading } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true
  })
  const { name, loading } = useMember(id)
  const { fields, loading: fieldsLoading } = useFields('users')

  if (!member) return null

  return (
    <Page hideHeader title={name} pt={10} loading={loading || fieldsLoading || memberLoading}>
      <MemberSpotlight memberId={id} fields={fields} full size="2xl" />
    </Page>
  )
}
