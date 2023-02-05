import { useState, forwardRef } from 'react'
import { Box, Icon, IconButton, Stack, Text, IconButtonProps } from '@chakra-ui/react'
type Props = IconButtonProps & {
  readonly: boolean
  scale: number
  fillColor: string
  strokeColor: string
}
const Rating = forwardRef<HTMLInputElement>(
  ({ readonly, size, icon, scale, fillColor, strokeColor }: Props, ref) => {
    const [rating, setRating] = useState(0)
    const buttons = []

    const onClick = (index: number) => {
      if (readonly) return
      if (!isNaN(index)) {
        // allow user to click first icon and set rating to zero if rating is already 1
        if (rating === 1 && index === 1) {
          setRating(0)
        } else {
          setRating(index)
        }
      }
    }

    const RatingButton = ({ index, fill }: { index: number; fill: any }) => {
      return (
        <IconButton
          as={Icon}
          aria-label={`Rate ${index}`}
          height={`${size}px`}
          width={`${size}px`}
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
        />
      )
    }

    for (let i = 1; i <= scale; i++) {
      buttons.push(<RatingButton key={i} index={i} fill={i <= rating} />)
    }

    return (
      <Stack isInline mt={8} justify="center">
        {!readonly && <input name="rating" type="hidden" value={rating} ref={ref} />}
        {buttons}
        <Box textAlign="center">
          <Text fontSize="sm" textTransform="uppercase">
            Rating
          </Text>
          <Text fontSize="2xl" fontWeight="semibold" lineHeight="1.2em">
            {rating}
          </Text>
        </Box>
      </Stack>
    )
  }
)

Rating.displayName = 'Rating'

export default Rating
