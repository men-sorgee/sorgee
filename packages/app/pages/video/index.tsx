import { ListItem, UnorderedList } from '@chakra-ui/react'
import Page from 'components/Page'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const getServerSideProps = async () => {
  const key = process.env.WHEREBY_API_KEY
  const response = await fetch(`https://api.whereby.dev/v1/meetings`, {
    headers: {
      Authorization: `Bearer ${key}`,
    },
  })

  const { results: meetings } = await response.json()

  return {
    props: {
      meetings,
    },
  }
}

export default function VideoChats({ meetings = [] }: { meetings: any[] }) {
  const router = useRouter()
  if (meetings?.length == 1) {
    router.push(`/video/${meetings[0].meetingId}`)
    return null
  }
  return (
    <Page title="Video Chats" requireAuth={true}>
      <UnorderedList>
        {meetings?.map((meeting) => (
          <ListItem key={meeting.meetingId}>
            <Link href={`/video/${meeting.meetingId}`}>{meeting.meetingId}</Link>
          </ListItem>
        ))}
      </UnorderedList>
    </Page>
  )
}
