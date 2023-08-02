import { useEffect, useState } from 'react'

import {
  Box,
  Icon,
  IconButton,
  IconButtonProps,
  HStack,
  Tooltip
} from '@chakra-ui/react'
import { StarIcon } from '@heroicons/react/24/solid'

export type RatingControlProps = IconButtonProps & {
  onRateChange?: (rate: number) => void
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
  icon = <StarIcon />,
  scale = 5,
  fillColor = 'yellow.300',
  strokeColor = 'yellow.200',
  simple = false,
  mt,
  onRateChange,
  'aria-label': ariaLabel,
  tooltip = 'Rate this item',
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

  const RatingButton = ({ index, fill }: { index: number; fill: any }) => {
    return (
      <IconButton
        as={Icon}
        boxSize={[5, 6, 7, 8, 9]}
        _hover={{ bg: 'transparent', stroke: 'white' }}
        aria-label={`Rate ${index}`}
        variant="ghost"
        onClick={() => onClick(index)}
        _focus={{ outline: 0 }}
        icon={icon}
        size="xx-small"
        color={fillColor}
        stroke={strokeColor}
        fill={fill}
        fillOpacity={fill ? '100%' : '0'}
        cursor={readonly ? 'default' : 'pointer'}
        {...props}
      />
    )
  }

  for (let i = 1; i <= scale; i++) {
    buttons.push(<RatingButton key={i} index={i} fill={i <= rating} />)
  }

  if (simple)
    return (
      <HStack mt={mt} spacing={1}>
        {buttons}
      </HStack>
    )

  return (
    <Tooltip
      label={tooltip}
      aria-label={ariaLabel}
      bg="black"
      rounded="lg"
      shadow="xl"
      p={2}
      color="white"
    >
      <HStack mt={mt} spacing={1}>
        {buttons}
      </HStack>
    </Tooltip>
  )
}
