import { SubscriptionData } from "lib/models";
import { postJSON } from "lib/utils";
import { useState } from "react";

import { Box, BoxProps, chakra, Flex, Heading, Text } from "@chakra-ui/react";

import { BusyButton, FieldInput, Form } from "../";

export const SubscribeBox = chakra(({ ...props }: BoxProps) => {
  const [subscribed, setSubscribed] = useState(false)

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
        Drop your email and what to call ya. We&apos;ll reach out when
        we&apos;re opened up.
      </Text>

      <Form<SubscriptionData>
        onSubmit={(data) => postJSON<SubscriptionData>('/api/subscribe', data)}
        onSuccess={() => setSubscribed(true)}
        successMessage="Successfully subscribed to our newsletter"
      >
        {() => (
          <>
            <Flex
              direction={['column', 'column', 'row']}
              justify="space-between"
              gap={4}
              mt={4}
            >
              <FieldInput
                field="name"
                registerOptions={{
                  required: {
                    value: true,
                    message: 'Please enter your name'
                  }
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
                    message: 'Please enter your email address'
                  }
                }}
                type="email"
                placeholder={'email'}
                autoComplete="email"
              />
              <BusyButton type="submit" size="lg" fontSize="sm" color={'white'}>
                Email Me
              </BusyButton>
            </Flex>

            <Text fontSize="xs" fontStyle={'italic'} color={'text'}>
              Add your information here, only if you agree to our Terms of
              Service and Privacy Policy.
            </Text>
          </>
        )}
      </Form>
    </Box>
  )
})
