import Page from 'components/Page'
import { useMember } from 'hooks/use-member'
import { JsonFetcher } from 'lib/utils/fetchers'
import useSWR from 'swr'

export default function MemberListPage() {
  const { member, loading } = useMember()
  const { data: members, error } = useSWR('/api/members', JsonFetcher)
  return (
    <Page title="Members" loading={loading}>
      {member && members && members.map((member: any) => {})}
    </Page>
  )
}
