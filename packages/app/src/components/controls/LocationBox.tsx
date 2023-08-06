
import { Member } from "lib/models";
import { ReactNode } from "react";

import { Box, BoxProps, chakra } from "@chakra-ui/react";

import { LocationCapture } from "./";

export type MembersNewProps = BoxProps & {
  member: Member
  children?: ReactNode
}

export const LocationBox = chakra(({
  member,
  children,
  ...props
}: MembersNewProps) => {

  const { show_location, location } = member || {
    show_location: false,
    location: undefined
  }

  return (<>
         {show_location &&  location == undefined && <Box {...props}>
          {children}
          <LocationCapture />
        </Box>}
      </>)
})
