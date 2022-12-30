import { useBoolean, useToast } from '@chakra-ui/react'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { useSocket } from './use-socket'

type UserLocation = {
  coords: {
    longitude: string
    latitude: string
  }
  socketId: string
}
type Context = {
  initUserLocation: () => void
  users: UserLocation[]
  currentUser: UserLocation
}
const LocationContext = createContext<Context>(undefined)
export function LocationProvider({ children }) {
  const watchLocation = useRef<number>()
  const [connected, setConnected] = useState(false)
  const { socket, disconnect } = useSocket()
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState()
  const [hasAccessLocation, setHasAccessLocation] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (socket && !connected) {
      socket.on('new-user', (data) => {
        setUsers((users) => [...users, data])
      })

      socket.on('users', (data) => {
        setUsers(data)
      })

      socket.on('current-user', (data) => {
        setCurrentUser(data)
      })

      socket.on('position-change', (data) => {
        let newUsers = users.map((user) => {
          if (user.socketId === data.socketId) {
            return data
          }
          return user
        })
        setUsers(newUsers)
      })
      setConnected(true)
    }

    if (hasAccessLocation) {
      watchLocation.current = navigator.geolocation.watchPosition(
        positionChange,
        locationResolveError
      )
    }

    return () => {
      navigator.geolocation.clearWatch(watchLocation.current)
      disconnect()
    }
  }, [])

  function positionChange(data: { coords: { latitude: any; longitude: any } }) {
    const latitude = data.coords.latitude
    const longitude = data.coords.longitude
    const { socketId } = currentUser || { socketId: null }
    socket.emit('position-change', {
      socketId,
      coords: {
        latitude,
        longitude,
      },
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
      latitude,
      longitude,
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

  const context = {
    initUserLocation,
    users,
    currentUser,
  }

  return <LocationContext.Provider value={context}>{children}</LocationContext.Provider>
}

export const useLocation = () => useContext(LocationContext)
export default LocationProvider
