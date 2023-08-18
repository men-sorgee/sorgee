import { useUser } from "hooks";
import { Member } from "lib/models";
import { getDistance, LocationCoordinates } from "lib/utils";
import { useEffect, useState } from "react";

export type MemberDistanceProps = {
  member: Pick<Member, 'location'>
}

export type Distance = {
  miles: number
  feet: number
}
export const MemberDistance = ({
  member
}: MemberDistanceProps) => {
  const { member: viewer } = useUser()
  const [myLocation, setMyLocation] = useState<LocationCoordinates>(undefined)
  const [theirLocation, setTheirLocation] = useState<LocationCoordinates>(undefined)

  const [hasDistance, setHasDistance] = useState<boolean>(false)
  const [distance, setDistance] = useState<Distance>(null)

  useEffect(() => {
    if (viewer?.location && member?.location && myLocation == undefined && theirLocation == undefined) {
      setMyLocation({
        latitude: viewer.location.coordinates[1],
        longitude: viewer.location.coordinates[0]
      })
      setTheirLocation({
        latitude: member.location.coordinates[1],
        longitude: member.location.coordinates[0]
      })
    }
  }, [viewer, member, myLocation, theirLocation])

  useEffect(() => {
    if (myLocation && theirLocation) {
      let distance = getDistance(myLocation, theirLocation)
      setDistance(distance)
      setHasDistance(true)
    }
  }, [myLocation, theirLocation])
  if (!hasDistance) return null
  return (
    <>
      {Math.floor(distance.miles)} miles away
    </>
  )
}
