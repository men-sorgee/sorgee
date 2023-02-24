import { Box, Spinner } from '@chakra-ui/react'
import { useState, useRef, ReactNode } from 'react'

export const PullToRefresh = ({
  onRefresh = () => {},
  children,
}: {
  onRefresh: () => void
  children: ReactNode
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef(null)
  const [startY, setStartY] = useState(null)

  const handleTouchStart = (event) => {
    setStartY(event.touches[0].clientY)
  }

  const handleTouchMove = (event) => {
    if (startY !== null && event.touches[0].clientY > startY) {
      containerRef.current.style.transform = `translateY(${event.touches[0].clientY - startY}px)`
    }
  }

  const wrapRefresh = () => {
    return new Promise((resolve) => {
      onRefresh()
      setTimeout(() => {
        resolve(0)
      }, 1000)
    })
  }

  const handleTouchEnd = () => {
    if (startY !== null) {
      containerRef.current.style.transform = ''
      if (containerRef.current.getBoundingClientRect().top > 100) {
        setIsRefreshing(true)
        wrapRefresh().then(() => setIsRefreshing(false))
      }
      setStartY(null)
    }
  }
  return (
    <Box
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      overflow="hidden"
      position="relative"
    >
      {isRefreshing && <Spinner position="absolute" top="10" left="50%" />}
      {children}
    </Box>
  )
}
