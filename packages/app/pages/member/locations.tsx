import { Avatar, Box, Heading, VStack } from '@chakra-ui/react'
import LocationCoords from 'components/ui/Location'
import { useLocation } from 'hooks/use-location'
import { Map, Marker } from 'pigeon-maps'
import { useMember } from 'hooks/use-member'
import { useSocket } from 'hooks/use-socket'
import { useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

type ChatStatus = 'online' | 'offline' | 'away'
type UserMarker = {
  userId: string
  socketId: string
  coords: [number, number]
  status: ChatStatus
  name?: string
}

function Location() {
  const { socket, connect, disconnect, connected } = useSocket()
  const [initialized, setInitialized] = useState(false)
  const { member, loading } = useMember()
  const watchLocation = useRef<number>()
  const [users, setUsers] = useState<UserMarker[]>([])
  const [currentUser, setCurrentUser] = useState<UserMarker>()
  const [hasAccessLocation, setHasAccessLocation] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (!loading && member && !initialized) {
      connect().then(() => {
        if (socket && connected) {
          socket.on('new-user', (data) => {
            // setUsers(users)
          })

          socket.on('users', (data) => {
            console.log('users', data)
            setUsers(data)
          })

          socket.on('current-user', (user: UserMarker) => {
            console.log('current-user', user)
            setCurrentUser(user)
          })

          socket.on('position-change', (user: UserMarker) => {
            let newUsers = users.map((u) => {
              if (u.socketId === user.socketId) {
                return user
              }
              return user
            })
            setUsers(newUsers)
          })
          console.log('initialized')
          setInitialized(true)
        }
      })
    }
    if (initialized && !currentUser) {
      initUserLocation()

      if (hasAccessLocation) {
        watchLocation.current = navigator.geolocation.watchPosition(
          positionChange,
          locationResolveError
        )
      }
    }

    return () => {
      navigator.geolocation.clearWatch(watchLocation.current)
      //disconnect()
    }
  }, [member, loading, initialized, hasAccessLocation, currentUser])

  function positionChange(data: { coords: { latitude: any; longitude: any } }) {
    const latitude = data.coords.latitude
    const longitude = data.coords.longitude

    socket.emit('position-change', {
      socketId: socket.id,
      userId: member?.id,
      coords: [latitude, longitude],
      status: 'online',
    })
  }

  function initUserLocation() {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocation Unsupported',
        description: 'Your system does not support Geolocation',
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return
    }
    navigator.geolocation.getCurrentPosition(locationResolveSuccessfully, locationResolveError)
  }

  const locationResolveSuccessfully: PositionCallback = (data) => {
    setHasAccessLocation(true)
    const latitude = data.coords.latitude
    const longitude = data.coords.longitude
    socket.emit('join', {
      socketId: socket.id,
      userId: member?.id,
      coords: [latitude, longitude],
      status: 'online',
    })
    toast({
      title: 'Location',
      description: 'Location fetched successfully',
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
  }

  const locationResolveError: PositionErrorCallback = (error) => {
    let errorType = ''
    if (error.code === 1) {
      errorType = 'Permission Denied'
    } else if (error.code === 2) {
      errorType = 'Position Unavailable'
    } else if (error.code === 3) {
      errorType = 'Timeout'
    }
    toast({
      title: errorType,
      description: error.message,
      status: 'error',
      duration: 4000,
      isClosable: true,
    })
  }

  return (
    <Box>
      <Heading size="lg" my="8">
        Active Users
      </Heading>
      <VStack align="flex-start">
        <Map height={600} defaultCenter={[39.7407505, -105.0440635]} defaultZoom={11}>
          {users.map((user: UserMarker) => (
            <Marker key={user.socketId} anchor={user.coords}>
              <Avatar size="sm" name={user.userId} />
            </Marker>
          ))}
        </Map>
      </VStack>
    </Box>
  )
}

export default Location
