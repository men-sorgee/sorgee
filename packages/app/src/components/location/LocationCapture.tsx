'use client'
import { Coordinates } from "lib/models";
import { gradient, postJSON } from "lib/utils";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";

export type LocationCaptureProps = {}

export const LocationCapture = () => {
  const [sharedLocation, setSharedLocation] = useState<boolean>(undefined)

  useEffect(() => {
    // detect if we have permission to access location information
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
        if (permissionStatus.state == 'granted') {
          setSharedLocation(true)
        }
      })
    }
  }, [])

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSharedLocation(true)
        const { latitude, longitude } = position.coords
        postJSON<Partial<Coordinates>>('/api/my/location', {
          coordinates: [longitude, latitude],
        }).catch(console.error)
      },
      (error) => {
        console.error('Error getting location:', error.message)
      }
    )
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      if (sharedLocation) {
        getLocation()
      }
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [getLocation, sharedLocation])

  if (sharedLocation) return null
  return (
    <>
      <Button onClick={getLocation} bgGradient={gradient('gray')}>
        Share Location
      </Button>
    </>
  )
}
