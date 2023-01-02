import { FormProvider, useForm } from 'react-hook-form'
import { SubscriptionData } from 'lib/models'
import { Button, Stack, Heading, Text, Link } from '@chakra-ui/react'
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
        <Heading size={'md'} as="h4">
          Thank you!
        </Heading>
        <Text>Please check your spam folder, just in case we land there.</Text>
      </>
    )
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="gradient">
        <Heading size={'md'} as="h4" mb={4} color={'white'}>
          Stay Updated
        </Heading>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 0, md: 4 }}>
          <FieldInput
            field="name"
            color={'white'}
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
            color={'white'}
            registerOptions={{
              required: {
                value: true,
                message: 'Please enter your email address',
              },
            }}
            type="email"
            placeholder="email@gmail.com"
            autoComplete="email"
          />
        </Stack>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          mt={4}
          alignItems="center"
          justify="middle"
        >
          <Button type="submit" size={'md'} bg="accent.500" color={'white'}>
            Get Notifications
          </Button>
          <Text fontSize="xs" fontStyle={'italic'} color={'white'}>
            Subscribe only if you agree to our <Link href="/terms">Terms</Link> and{' '}
            <Link href="/privacy">Privacy Policy</Link>.
          </Text>
        </Stack>
      </form>
    </FormProvider>
  )
}
