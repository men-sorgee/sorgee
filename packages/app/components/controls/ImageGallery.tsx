import React from 'react'
import { Box, Icon, IconButton, useBreakpointValue } from '@chakra-ui/react'
// Here we have used react-icons package for the icons
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
// And react-slick as our Carousel Lib
import Slider from 'react-slick'

export default function Carousel({ images }: { images: string[] }) {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = React.useState<Slider | null>(null)

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: '90%', md: '50%' })
  const side = useBreakpointValue({ base: '30%', md: '10px' })
  const showScroll = images?.length > 0
  const settings = {
    dots: true,
    arrows: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <Box position={'relative'} height="50vh" width={'full'} overflow={'hidden'}>
      {/* Left Icon */}
      {showScroll && (
        <IconButton
          icon={<ArrowLeftIcon />}
          aria-label="left-arrow"
          colorScheme="messenger"
          borderRadius="full"
          position="absolute"
          bg="black"
          color="accent.400"
          left={side}
          top={top}
          transform={'translate(0%, -50%)'}
          zIndex={2}
          onClick={() => slider?.slickPrev()}
        />
      )}
      {/* Right Icon */}
      {showScroll && (
        <IconButton
          icon={<ArrowRightIcon />}
          aria-label="right-arrow"
          colorScheme="messenger"
          borderRadius="full"
          position="absolute"
          right={side}
          top={top}
          bg="black"
          color="accent.400"
          transform={'translate(0%, -50%)'}
          zIndex={2}
          onClick={() => slider?.slickNext()}
        />
      )}
      {/* Slider */}
      <Slider {...settings} ref={(slider: any) => setSlider(slider)}>
        {images.map((url, index) => (
          <Box
            key={index}
            height={'xl'}
            position="relative"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="fit"
            backgroundImage={`url(${url})`}
          />
        ))}
      </Slider>
    </Box>
  )
}
