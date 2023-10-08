import { ReactNode, useEffect, useRef, useState } from "react";

import { Box, Spinner } from "@chakra-ui/react";

export const Lazy = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState(null)

  useEffect(() => {
    if (ref == null && containerRef.current) {
      setRef(containerRef.current)
    }
  }, [ref, containerRef])

  useEffect(() => {
    if (ref) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        },
        {
          root: null, // Use the viewport as the root
          rootMargin: '0px',
          threshold: 0.1 // Percentage of element visibility required to trigger
        }
      )

      observer.observe(ref)

      return () => {
        if (ref) {
          observer.unobserve(ref)
        }
      }
    }
  }, [ref])

  return (
    <Box ref={containerRef} minH={isVisible ? 'min-content' : '100px'} minW="100%">
      {isVisible ? children : <Spinner />}
    </Box>
  )
}
