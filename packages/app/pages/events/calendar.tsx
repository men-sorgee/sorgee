import { addDays, isSameDay } from 'date-fns'
import { SetStateAction, useCallback, useState } from 'react'
import Calendar from 'react-calendar'
import Page from 'components/Page'
import {
  Box,
  Flex,
  Text,
  Show,
  Hide,
  Heading,
  useColorModeValue,
  LinkOverlay,
  LinkBox,
} from '@chakra-ui/react'
import { useUser, useUserEvents } from 'hooks'
import { GroupEvent, MemberLevel } from 'lib/models'
import { brand } from 'lib/config/brand'
import { EventBadge, EventCard } from 'components/controls'

function CalendarPage() {
  const today = new Date()
  const minDate = addDays(today, -14)
  const maxDate = addDays(today, 120)
  const [value, setValue] = useState(new Date())
  const { member, loading } = useUser(MemberLevel.pledge)
  const { upcoming } = useUserEvents()

  const events = upcoming.map((i) => i.event)
  const onChange = useCallback((nextValue: SetStateAction<Date>) => {
    setValue(nextValue)
  }, [])
  const EventView = ({ event, full = false }: { event: GroupEvent; full?: boolean }) => {
    return (
      <>
        <Box m={1} p={full ? 2 : 0} color="primary.500" cursor="pointer">
          {(full && <EventCard href={`/events/${event.id}`} event={event} />) || (
            <Box>
              <LinkBox>
                <EventBadge type={event.type} status={event.status} />
                <Text p={0} m={0}>
                  {event.name}
                  <LinkOverlay href={`/events/${event.id}`} />
                </Text>
              </LinkBox>
            </Box>
          )}
        </Box>
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
      description="Your Event Calendar"
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
          value={value}
          onChange={onChange}
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

export default CalendarPage
