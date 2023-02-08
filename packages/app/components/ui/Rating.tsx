import { useState, forwardRef, useEffect } from 'react'
import { StarIcon } from '@chakra-ui/icons'
import { Box, Icon, IconButton, Stack, Text, IconButtonProps } from '@chakra-ui/react'
type Props = IconButtonProps & {
  value?: number
  readonly?: boolean
  scale?: number
  fillColor?: string
  strokeColor?: string
  simple?: boolean
}
const rating = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      readonly = true,
      size = 'xs',
      icon = <StarIcon />,
      scale = 5,
      fillColor = 'yellow.100',
      strokeColor = 'gray.200',
      simple = false,
      mt,
    }: Props,
    ref
  ) => {
    const [rating, setRating] = useState(value || 0)
    const [tooltip, setTooltip] = useState('')
    const buttons = []

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

    const help =
      'Ratings are based on the number of stars a member has received from other members and event hosts. ' +
      'No-shows automatically receive 2-star ratings by the event. ' +
      'Members must have an average of 4-stars to be eligible for events. '
    return (
      <Stack isInline mt={mt} justify="center" title={help}>
        {!readonly && <input name="rating" type="hidden" value={rating} ref={ref} />}
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
)

rating.displayName = 'rating'

export default rating
