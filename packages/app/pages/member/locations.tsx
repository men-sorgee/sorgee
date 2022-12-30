import { Box, Heading, VStack } from '@chakra-ui/react'
import LocationCoords from 'components/ui/Location'
import React from 'react'
import { useLocation } from 'hooks/use-location'
function Location() {
  const { users, currentUser } = useLocation()

  return (
    <Box>
      <Heading size="lg" my="8">
        Active Users
      </Heading>
      <VStack align="flex-start">
        {users.map((user) => (
          <LocationCoords
            isCurrentUser={user.socketId === currentUser.socketId}
            text={user.socketId}
            coords={user.coords}
          />
        ))}
      </VStack>
    </Box>
  )
}

export default Location
