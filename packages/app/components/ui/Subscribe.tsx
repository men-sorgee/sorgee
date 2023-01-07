import { FormProvider, useForm } from 'react-hook-form'
import { SubscriptionData } from 'lib/models'
import { FieldInput } from '../forms'
import { useState } from 'react'
import { Stack, Heading, Text, Button, Icon, useColorModeValue, createIcon } from '@chakra-ui/react'
import { postJSON } from '../../lib/utils'

export default function SubscribeBox() {
  const [subscribed, setSubscribed] = useState(false)
  const methods = useForm<SubscriptionData>({
    mode: 'onBlur',
  })
  const { handleSubmit, setError } = methods
  const onSubmit = async (data: SubscriptionData) => {
    const [ok, response] = await postJSON('/api/member/subscribe', data)

    if (ok) {
      setSubscribed(true)
    } else {
      const { error } = response
      setError('email', error)
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
    <>
      <Stack
        direction={{ base: 'column', sm: 'row', lg: 'column' }}
        boxShadow={'2xl'}
        rounded={'xl'}
        p={3}
        bgGradient={useColorModeValue(
          'linear(to-r, primary.200, primary.400)',
          'linear(to-r, primary.500, primary.700)'
        )}
        color="white"
        align="center"
      >
        <Stack align="center" spacing={2} px={10}>
          <Icon as={NotificationIcon} w={24} h={24} />
        </Stack>
        <Stack align="center">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction="column" spacing="0" w="100%" justifyItems="stretch">
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
              </Stack>
              <Stack
                direction={{ base: 'column', md: 'row', lg: 'column' }}
                mt={4}
                alignItems="center"
                justify="middle"
                w="full"
              >
                <Button
                  type="submit"
                  size={'md'}
                  w={{ base: 'full', sm: '50%', lg: 'full' }}
                  bg="accent.500"
                  color={'white'}
                >
                  Subscribe
                </Button>
                <Text fontSize="xs" fontStyle={'italic'} color={'white'}>
                  Subscribe only if you agree to our Terms of Service and Privacy Policy .
                </Text>
              </Stack>
            </form>
          </FormProvider>
        </Stack>
      </Stack>
    </>
  )
}

const NotificationIcon = createIcon({
  displayName: 'Notification',
  viewBox: '0 0 128 128',
  path: (
    <g id="Notification">
      <rect className="cls-1" x="1" y="45" fill={'#fbcc88'} width="108" height="82" />
      <circle className="cls-2" fill={'#8cdd79'} cx="105" cy="86" r="22" />
      <rect className="cls-3" fill={'#f6b756'} x="1" y="122" width="108" height="5" />
      <path
        className="cls-4"
        fill={'#7ece67'}
        d="M105,108A22,22,0,0,1,83.09,84a22,22,0,0,0,43.82,0A22,22,0,0,1,105,108Z"
      />
      <path
        fill={'#f6b756'}
        className="cls-3"
        d="M109,107.63v4A22,22,0,0,1,83.09,88,22,22,0,0,0,109,107.63Z"
      />
      <path
        className="cls-5"
        fill={'#d6ac90'}
        d="M93,30l16,15L65.91,84.9a16,16,0,0,1-21.82,0L1,45,17,30Z"
      />
      <path
        className="cls-6"
        fill={'#cba07a'}
        d="M109,45,65.91,84.9a16,16,0,0,1-21.82,0L1,45l2.68-2.52c43.4,40.19,41.54,39.08,45.46,40.6A16,16,0,0,0,65.91,79.9l40.41-37.42Z"
      />
      <path
        className="cls-7"
        fill={'#dde1e8'}
        d="M93,1V59.82L65.91,84.9a16,16,0,0,1-16.77,3.18C45.42,86.64,47,87.6,17,59.82V1Z"
      />
      <path
        className="cls-8"
        fill={'#c7cdd8'}
        d="M74,56c-3.56-5.94-3-10.65-3-17.55a16.43,16.43,0,0,0-12.34-16,5,5,0,1,0-7.32,0A16,16,0,0,0,39,38c0,7.13.59,12-3,18a3,3,0,0,0,0,6H50.41a5,5,0,1,0,9.18,0H74a3,3,0,0,0,0-6ZM53.2,21.37a3,3,0,1,1,3.6,0,1,1,0,0,0-.42.7,11.48,11.48,0,0,0-2.77,0A1,1,0,0,0,53.2,21.37Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M46.09,86.73,3,127H1v-1c6-5.62-1.26,1.17,43.7-40.78A1,1,0,0,1,46.09,86.73Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M109,126v1h-2L63.91,86.73a1,1,0,0,1,1.39-1.49C111,127.85,103.11,120.51,109,126Z"
      />
      <path
        className="cls-8"
        fill={'#c7cdd8'}
        d="M93,54.81v5L65.91,84.9a16,16,0,0,1-16.77,3.18C45.42,86.64,47,87.6,17,59.82v-5L44.09,79.9a16,16,0,0,0,21.82,0Z"
      />
      <path
        className="cls-9"
        fill={'#fff'}
        d="M101,95c-.59,0-.08.34-8.72-8.3a1,1,0,0,1,1.44-1.44L101,92.56l15.28-15.28a1,1,0,0,1,1.44,1.44C100.21,96.23,101.6,95,101,95Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M56.8,18.38a3,3,0,1,0-3.6,0A1,1,0,0,1,52,20,5,5,0,1,1,58,20,1,1,0,0,1,56.8,18.38Z"
      />
      <path
        className="cls-1"
        fill={'#fbcc88'}
        d="M71,42.17V35.45c0-8.61-6.62-16-15.23-16.43A16,16,0,0,0,39,35c0,7.33.58,12-3,18H74A21.06,21.06,0,0,1,71,42.17Z"
      />
      <path
        className="cls-3"
        fill={'#f6b756'}
        d="M74,53H36a21.36,21.36,0,0,0,1.86-4H72.14A21.36,21.36,0,0,0,74,53Z"
      />
      <path className="cls-3" fill={'#f6b756'} d="M59.59,59a5,5,0,1,1-9.18,0" />
      <path className="cls-1" fill={'#fbcc88'} d="M74,59H36a3,3,0,0,1,0-6H74a3,3,0,0,1,0,6Z" />
    </g>
  ),
})
