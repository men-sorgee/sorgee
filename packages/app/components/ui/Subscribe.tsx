import { FormProvider, useForm } from 'react-hook-form'
import { SubscriptionData } from 'lib/models'
import { Button } from 'react-daisyui'
import { FieldInput } from '../forms'
import { useState } from 'react'

export default function Subscribe() {
  const [subscribed, setSubscribed] = useState(false)
  const methods = useForm<SubscriptionData>({
    mode: 'onBlur',
  })
  const { handleSubmit, setError } = methods
  const onSubmit = async (data: SubscriptionData) => {
    const response = await fetch('/api/member/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: Buffer.from(JSON.stringify(data)),
    })

    if (response.ok) {
      setSubscribed(true)
    } else {
      const { error } = await response.json()
      setError('email', { message: error })
    }
  }

  if (subscribed)
    return (
      <>
        <h1>Thank you!</h1>
        <p>Please check your spam folder, just in case we land there.</p>
      </>
    )
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4 "
      >
        <FieldInput
          field="name"
          registerOptions={{
            required: {
              value: true,
              message: 'Please enter your name',
            },
          }}
          placeholder="Willy Dicks"
        />
        <FieldInput
          field="email"
          registerOptions={{
            required: {
              value: true,
              message: 'Please enter your email address',
            },
          }}
          type="email"
          placeholder="email@gmail.com"
          autoComplete="false"
        />
        <Button type="submit" color="accent">
          Get Notifications
        </Button>
        <p className="p-2 text-xs">
          Subscribe only if you agree to our <a href="/terms">Terms </a> and{' '}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </form>
    </FormProvider>
  )
}
