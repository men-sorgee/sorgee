import { ButtonConfirm } from "components";
import { useEffect, useState } from "react";

import { HStack, Icon, IconButtonProps, Tooltip } from "@chakra-ui/react";
import { StarIcon as StarOffIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarOnIcon } from "@heroicons/react/24/solid";

export type RatingControlProps = Omit<IconButtonProps, 'aria-label'> & {
  onRateChange?: (rate: number) => void
  itemName?: string
  value?: number
  readonly?: boolean
  scale?: number
  fillColor?: string
  strokeColor?: string
  simple?: boolean
  tooltip?: string
}

export const Rating = ({
  value,
  readonly = true,
  scale = 5,
  fillColor = 'yellow.300',
  strokeColor = 'yellow.200',
  simple = false,
  mt,
  onRateChange,
  tooltip,
  itemName = 'Item',
  onError: _error,
  ...props
}: RatingControlProps) => {
  const [rating, setRating] = useState<number>(undefined)
  const buttons = []

  useEffect(() => {
    if (value != undefined) {
      setRating(value)
    }
  }, [value])

  const onClick = (index: number) => {
    if (readonly) return
    if (!isNaN(index)) {
      // allow user to click first icon and set rating to zero if rating is already 1
      if (rating === 1 && index === 1) {
        setRating(0)
        if (onRateChange) onRateChange(0)
      } else {
        setRating(index)
        if (onRateChange) onRateChange(index)
      }
    }
  }

  const RatingButton = ({ index, fill }: { index: number; fill: boolean }) => {
    const [on, setOn] = useState(fill)
    return (
      <ButtonConfirm<number>
        onMouseOver={() => setOn(true)}
        onMouseOut={() => setOn(fill)}
        as={Icon}
        boxSize={[5, 6, 7, 8, 9]}
        _hover={{ stroke: 'white' }}
        aria-label={`Rate ${index}`}
        variant="ghost"
        alertTitle="Rate this item"
        buttonText="Rate"
        successMessage="Rating sent!"
        confirmedAction={() => {
          onClick(index)
          return index
        }}
        _focus={{ outline: 0 }}
        icon={on ? <StarOnIcon /> : <StarOffIcon />}
        size="xx-small"
        color={fillColor}
        stroke={strokeColor}
        fill={fill ? fillColor : null}
        cursor={readonly ? 'default' : 'pointer'}
        {...props}
      >
        Are you sure you want to rate this item? Members will be sent a notification of your rating.
      </ButtonConfirm>
    )
  }

  for (let i = 1; i <= scale; i++) {
    buttons.push(<RatingButton key={i} index={i} fill={i <= rating} />)
  }

  if (simple)
    return (
      <HStack mt={mt} spacing={1} align="center" justify="center">
        {buttons}
      </HStack>
    )

  return (
    <Tooltip
      label={tooltip}
      aria-label={`Rate this ${itemName}`}
      bg="black"
      rounded="lg"
      shadow="xl"
      p={2}
      color="white"
    >
      <HStack mt={mt} spacing={1} align="center" justify="center">
        {buttons}
      </HStack>
    </Tooltip>
  )
}
