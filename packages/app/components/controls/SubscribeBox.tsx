import { FormProvider, useForm } from 'react-hook-form'
import { SubscriptionData } from 'lib/models'
import { FieldInput } from '../forms'
import { useState } from 'react'
import { BoxProps, Heading, Text, Flex, Button, Box, chakra } from '@chakra-ui/react'
import { postJSON } from 'lib/utils'

type Props = BoxProps
export const SubscribeBox = chakra(({ ...props }: Props) => {
  const [subscribed, setSubscribed] = useState(false)
  const methods = useForm<SubscriptionData>({
    mode: 'onBlur',
  })
  const { handleSubmit, setError } = methods
  const onSubmit = async (data: SubscriptionData) => {
    const { success, error } = await postJSON('/api/subscribe', data)
    if (success) {
      setSubscribed(true)
    } else {
      setError('email', error)
    }
  }

  if (subscribed)
    return (
      <Box {...props}>
        <Heading as="h4" size="h4">
          You got it.
        </Heading>
        <Text>Peep your spam folder, just in case we landed there.</Text>
      </Box>
    )

  return (
    <Box {...props}>
      <Heading as="h4" size="md">
        Wanna get it in?
      </Heading>
      <Text>
        Drop your email and what to call ya. We&apos;ll reach out when we&apos;re opened up.
      </Text>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex justify="space-between" gap={4}>
            <FieldInput
              field="name"
              registerOptions={{
                required: {
                  value: true,
                  message: 'Please enter your name',
                },
              }}
              placeholder={' name'}
              autoComplete="full-name"
              pattern="^[a-zA-Z]{1,}\w+?$"
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
              placeholder={'email'}
              autoComplete="email"
            />
            <Button flex="grow" type="submit" size="lg" fontSize="sm" color={'white'}>
              Email Me
            </Button>
          </Flex>

          <Text fontSize="xs" fontStyle={'italic'} color={'text'}>
            Add your information here, only if you agree to our Terms of Service and Privacy Policy.
          </Text>
        </form>
      </FormProvider>
    </Box>
  )
})
