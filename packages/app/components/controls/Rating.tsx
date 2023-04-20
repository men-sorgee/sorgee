import { useState, forwardRef, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import {
  Box,
  Icon,
  Button,
  IconButton,
  Stack,
  Text,
  IconButtonProps,
  Tooltip,
} from '@chakra-ui/react'

export type RatingControlProps = IconButtonProps & {
  onRateChange?: (rate: number) => void
  value?: number
  readonly?: boolean
  scale?: number
  fillColor?: string
  strokeColor?: string
  simple?: boolean
}

export const Rating = ({
  value,
  readonly = true,
  size = 'xs',
  icon = <StarIcon />,
  scale = 5,
  fillColor = 'yellow.300',
  strokeColor = 'yellow.700',
  simple = false,
  mt,
  onRateChange,
  ...props
}: RatingControlProps) => {
  const [rating, setRating] = useState<number>(undefined)
  const [tooltip, setTooltip] = useState('')
  const buttons = []

  useEffect(() => {
    if (value != undefined) {
      setRating(value)
    }
  }, [value])

  useEffect(() => {
    if (!tooltip) {
      if (rating == 0) setTooltip('No rating')
      else setTooltip(`${rating} / ${scale}`)
    }
  }, [rating, tooltip, scale])

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
        _hover={{ bg: 'transparent', stroke: 'primary.500' }}
        aria-label={`Rate ${index}`}
        variant="ghost"
        size={size}
        onClick={() => onClick(index)}
        _focus={{ outline: 0 }}
        icon={icon}
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

  return (
    <Tooltip
      label="Ratings are based on the number of stars a member has received from other members and event hosts. No-shows automatically receive -1 star ratings by the event."
      aria-label="User Rating"
    >
      <Stack isInline mt={mt} spacing={1}>
        {buttons}
        {!simple && <Box textAlign="center">{rating} stars</Box>}
      </Stack>
    </Tooltip>
  )
}
