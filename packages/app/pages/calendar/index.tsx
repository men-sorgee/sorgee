import { addDays, isSameDay } from 'date-fns'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import Page from 'components/Page'
import { Box, Flex, Text, Show, Hide, Heading, useColorModeValue } from '@chakra-ui/react'
import { useEvents, useMeta, useUser } from 'hooks'
import { GroupEvent, Member } from 'lib/models'
import { brand } from 'lib/config/brand'
import { EventRSVPCard, ModalPopup, EventBadge, EventCard } from 'components/controls'
import { useRouter } from 'next/router'

function CalendarPage() {
  const today = new Date()
  const minDate = addDays(today, -14)
  const maxDate = addDays(today, 120)
  const { setMeta } = useMeta()
  const router = useRouter()
  const { id } = router.query
  const [eventId, setEventId] = useState<string>()
  const [value, setValue] = useState(new Date())
  const { member, loading } = useUser()
  const { events = [], loading: eventsLoading } = useEvents()

  const onChange = useCallback((nextValue: SetStateAction<Date>) => {
    setValue(nextValue)
  }, [])

  useEffect(() => {
    if (id && !eventId) {
      setEventId(String(id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (eventId) {
      window.history.pushState({}, null, `/calendar/${eventId}`)
    } else {
      window.history.pushState(null, 'Events', `/calendar`)
      setMeta('Calendar', 'All Events')
    }
  }, [eventId, setMeta])

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
          size="lg"
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

  const line = useColorModeValue(brand.colors.primary[700], '#000000')
  const bg = useColorModeValue('white', brand.colors.gray[300])
  return (
    <Page
      title="Calendar"
      description="All Events"
      loading={loading}
      css={{
        '.react-calendar ': {
          width: '100%',
          minH: '50vh',

          margin: '2rem auto 0 auto',
        },
        '.react-calendar__navigation': {
          backgroundColor: line,
          color: 'white',
          padding: '0 .5em',
          display: 'flex',
          borderRadius: '15px 15px 0 0',
          fontWeight: 'bold',
          fontSize: '2.5em',
          gap: '1rem',
        },
        '.react-calendar__tile': {
          minHeight: '100px',
          borderColor: line,
          border: '1px solid',
          margin: '0',
          color: line,
          backgroundColor: bg,
        },
        '.react-calendar__month-view': {
          borderColor: line,
          borderStyle: 'solid',
          borderWidth: '1px 1px 20px 1px',
          borderRadius: '0 0 15px 15px',
          backgroundColor: line,
        },
        '.react-calendar__month-view__weekdays': {
          backgroundColor: line,
          color: 'white',
          textTransform: 'uppercase',
        },
        '.react-calendar__month-view__weekdays__weekday': {
          padding: '0.5em',
          textAlign: 'center',
        },
        'react-calendar__month-view__days': {
          justifyContent: 'end',
        },
      }}
    >
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
        {(events?.length > 0 && <Heading textAlign="center">{events.length} Events</Heading>) || (
          <Heading textAlign="center">No Events</Heading>
        )}
        <Flex direction="column" width="100%">
          {events?.map((event) => (
            <EventView key={event.id} event={event} full />
          ))}
        </Flex>
      </Hide>
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

CalendarPage.authLevel = 'member'

export default CalendarPage
