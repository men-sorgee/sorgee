import { MemberSpotlight, Page } from "components";
import { useFields, useMember } from "hooks";

export function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  }
}

export default function MemberPage({ id }: { id: string }) {
  const { name, loading } = useMember(id)
  const { fields, loading: fieldsLoading } = useFields('users')

  return (
    <Page hideHeader title={name} pt={10} loading={loading || fieldsLoading}>
      <MemberSpotlight memberId={id} fields={fields} full size="2xl" />
    </Page>
  )
}
