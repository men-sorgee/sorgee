import { Alert } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Coordinates } from '../../lib/models'
import { postJSON } from '../../lib/utils'

export const LocationCapture = () => {
  const [location, setLocation] = useState(null)

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
        },
        (error) => {
          console.error('Error getting location:', error.message)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  useEffect(() => {
    if (location) {
      postJSON<Partial<Coordinates>>('/api/member/location', {
        coordinates: [location.latitude, location.longitude]
      })
    }
  }, [location])

  useEffect(() => {
    getLocation()
  }, [])

  return (
    <>
      <Alert rounded="lg">
        Please allow location access to use this feature.
      </Alert>
    </>
  )
}
