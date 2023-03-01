import { useState, forwardRef, useEffect } from 'react'
import { StarIcon } from '@chakra-ui/icons'
import { Box, Icon, IconButton, Stack, Text, IconButtonProps } from '@chakra-ui/react'

type Props = IconButtonProps & {
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
}: Props) => {
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
        mx={1}
        onClick={() => onClick(index)}
        _focus={{ outline: 0 }}
        size={size}
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
    <Stack isInline mt={mt} justify="center">
      {buttons}
      {!simple && (
        <Box textAlign="center">
          <Text fontSize="sm" textTransform="uppercase">
            Rating
          </Text>
          <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2em">
            {rating}
          </Text>
        </Box>
      )}
    </Stack>
  )
}
