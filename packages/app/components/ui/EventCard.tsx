import moment, { Moment } from 'moment'
import { ReactNode, useState } from 'react'
import { Card, Alert } from 'react-daisyui'
import Markdown from './Markdown'
import { Invite } from 'lib/models'

export default function EventCard({
  invite,
  children,
}: {
  invite: Invite
  children?: ReactNode | ReactNode[]
}) {
  const [eventDate] = useState<Moment>(moment(invite.datetime))
  return (
    <Card className="gradient not-prose mx-auto max-w-lg text-center">
      <div className="flex items-center justify-between self-stretch  align-middle">
        <h2 className="m-0 w-3/4 text-center text-xl !text-white">
          {invite.name}
          <br />@ {eventDate.format('h:mm A')}
        </h2>

        <h3 className="m-0 bg-primary-900 px-8 py-2 text-center">
          {eventDate.format('MMM')}
          <br />
          {eventDate.format('D')}
        </h3>
      </div>
      <Card.Body className="border-y-2 border-primary-900">
        <Markdown content={invite.description} />
        <Alert className="italics mt-2 text-sm">
          Location announced on the day of the event and is sent to confirmed attendees only. Events
          are subject to change or cancellation, depending upon member interest. We will communicate
          any changes to the event 24 hours in advance.
        </Alert>
      </Card.Body>

      <Card.Actions className="border-t-1 border-primary-700 bg-primary-900">
        {children}
      </Card.Actions>
    </Card>
  )
}
