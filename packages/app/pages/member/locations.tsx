import { Box, Heading, VStack } from '@chakra-ui/react'
import LocationCoords from 'components/ui/Location'
import { useLocation } from 'hooks/use-location'
import { Map, Marker } from 'pigeon-maps'
import { useEffect } from 'react'

function Location() {
  const { initUserLocation, users, currentUser } = useLocation()

  useEffect(() => {
    initUserLocation()
  }, [])
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
        <Map height={600} defaultCenter={[39.7407505, -105.0440635]} defaultZoom={11}>
          <Marker width={50} anchor={[39.7407505, -105.0440635]} />
        </Map>
      </VStack>
    </Box>
  )
}

export default Location
