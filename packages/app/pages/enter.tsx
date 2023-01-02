import type { NextPage } from 'next'
import { signIn } from 'next-auth/react'
import { Button } from 'react-daisyui'

const Enter: NextPage = () => {
  return (
    <section>
      <h1>Welcome!</h1>
      <p className="my-4 text-lg">
        Access to this site is restricted to members of the community and those that they invite.
      </p>
      <p className="my-4 text-lg">New users must register with the email address in your invite.</p>
      <p className="my-4 text-lg">
        Not sure if you were invited? Try signing in -- if it works, you're in!{' '}
      </p>

      <Button
        color="accent"
        className="mt-4 "
        onClick={(e) => {
          e.preventDefault()
          signIn(null, { callbackUrl: '/apply/resume' })
        }}
      >
        Sign In / Sign Up
      </Button>
    </section>
  )
}

export default Enter
