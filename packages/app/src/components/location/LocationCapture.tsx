'use client'
import { Coordinates } from "lib/models";
import { gradient } from "lib/utils";
import { postJSON } from "lib/utils/apis";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { Button } from "@chakra-ui/react";

export type LocationCaptureProps = {
  children?: ReactNode
}

export const LocationCapture = ({ children }) => {
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
        console.warn('Error getting location:', error.message)
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
        {children}
      </Button>
    </>
  )
}
