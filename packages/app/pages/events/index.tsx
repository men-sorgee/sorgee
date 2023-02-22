import { addDays, isSameDay } from 'date-fns'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import Page from 'components/Page'
import { Box, Flex, Text, Show, Hide, Heading } from '@chakra-ui/react'
import { useEvents, useMeta, useUser } from 'hooks'
import { GroupEvent, Member } from 'lib/models'

import brand from '../../theme'
import { EventRSVPCard, ModalPopup, EventBadge, EventCard } from 'components/controls'
import { useRouter } from 'next/router'
import { pruneUndefined } from 'lib/utils'
import { NextPageContext } from 'next'

export type PageProps = {
  id?: string
}

export async function getServerSideProps(context: NextPageContext): Promise<{ props: PageProps }> {
  return {
    props: pruneUndefined({
      id: String(context.query.id),
    }),
  }
}

export default function CalendarPage({ id }: PageProps) {
  const today = new Date()
  const minDate = addDays(today, -14)
  const maxDate = addDays(today, 120)
  const { setMeta } = useMeta()
  const router = useRouter()
  const { id: i } = router.query
  const [value, setValue] = useState(new Date())
  const { member, authenticated, loading } = useUser()
  const { events } = useEvents(authenticated)
  const [eventId, setEventId] = useState<string>(id || i ? String(i) : undefined)

  const onChange = useCallback((nextValue: SetStateAction<Date>) => {
    setValue(nextValue)
  }, [])

  useEffect(() => {
    if (eventId && eventId !== 'undefined') {
      window.history.pushState({}, null, `/events/${eventId}`)
    } else if (!loading) {
      window.history.pushState(null, 'Events', `/events`)
      setMeta('Events', 'All Events')
    }
  }, [eventId, loading, setMeta])

  const EventView = ({ event, full = false }: { event: GroupEvent; full?: boolean }) => {
    return (
      <>
        <Box
          m={1}
          p={full ? 2 : 0}
          color="primary.500"
          onClick={() => {
            setEventId(event.id)
          }}
          cursor="pointer"
        >
          {(full && <EventCard event={event} />) || (
            <Box>
              <EventBadge type={event.type} status={event.status} />
              <Text p={0} m={0}>
                {event.name}
              </Text>
            </Box>
          )}
        </Box>

        <ModalPopup
          isOpen={eventId === event.id}
          onClose={() => {
            setEventId(null)
          }}
        >
          <CalendarPageItem event={event} member={member} />
        </ModalPopup>
      </>
    )
  }

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (loading || !events?.length) return <Flex height="full" width="full"></Flex>
    // Add class to tiles in month view only
    if (view === 'month') {
      const event: GroupEvent = events
        ? events?.find((e, i) => isSameDay(new Date(e.datetime), date))
        : null
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (!event) return <Flex height="full" width="full"></Flex>
      return <EventView event={event} />
    }
  }

  return (
    <Page
      title="Events"
      description="All Events"
      loading={loading}
      css={{
        '.react-calendar ': {
          width: '100%',
          minH: '50vh',
          borderColor: brand.colors.primary[300],
          border: '1px solid',
          margin: '2rem 0 0 0',
        },
        '.react-calendar__navigation': {
          backgroundColor: brand.colors.secondary[500],
          color: 'white',
          padding: '0 .5em',
          display: 'flex',

          fontWeight: 'bold',
          fontSize: '2.5em',
          gap: '1rem',
        },
        '.react-calendar__tile': {
          minHeight: '100px',
          borderColor: brand.colors.primary[500],
          border: '1px solid',
          margin: '0',
          color: brand.colors.primary[300],
        },
        '.react-calendar__month-view__weekdays': {
          backgroundColor: brand.colors.primary[600],
          color: 'white',
          textTransform: 'uppercase',
        },
        '.react-calendar__month-view__weekdays__weekday': {
          padding: '0.5em',
          textAlign: 'center',
        },
      }}
    >
      {(events?.length > 0 && (
        <>
          <Show above="md">
            <Calendar
              className="calendar"
              onChange={onChange}
              value={value}
              tileContent={tileContent}
              minDate={minDate}
              maxDate={maxDate}
            />
          </Show>
          <Hide above="md">
            <Flex direction="column" width="100%">
              {events?.map((event) => (
                <EventView key={event.id} event={event} full />
              ))}
            </Flex>
          </Hide>
        </>
      )) || <Heading textAlign="center">No Events</Heading>}
    </Page>
  )
}

type CalendarPageItemProps = {
  event: GroupEvent
  member: Member
}
const CalendarPageItem = ({ event, member }: CalendarPageItemProps) => {
  const { setMeta } = useMeta()

  useEffect(() => {
    setMeta(event.name, event.description)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <EventRSVPCard event={event} member={member} />
}
