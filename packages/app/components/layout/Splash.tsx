import React, { useEffect, useState } from 'react'
import {
  Flex,
  Box,
  Slide,
  useDisclosure,
  Modal,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  Button,
  ModalContent,
  Text,
  Heading,
} from '@chakra-ui/react'

export default function Splash() {
  const [displayPopUp, setDisplayPopUp] = useState(true)

  const closeAsAdult = () => {
    localStorage.setItem('seenPopUp', 'true')
    setDisplayPopUp(false)
  }

  const closePopUp = () => {
    localStorage.setItem('seenPopUp', 'true')
    setDisplayPopUp(false)
  }

  useEffect(() => {
    let returningUser = localStorage.getItem('seenPopUp')
    setDisplayPopUp(!returningUser)
  }, [])

  return (
    <>
      <Modal
        size="full"
        isCentered
        closeOnOverlayClick={false}
        isOpen={displayPopUp}
        onClose={closePopUp}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent
          bg="black"
          opacity={0.7}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundImage={`url(/images/guys-bw.jpg)`}
          backgroundSize="cover"
        >
          <ModalBody p={10}>
            <Flex
              direction="column"
              justify="start-end"
              align="center"
              alignContent="center"
              gap={10}
            >
              <Heading
                color="white"
                as="h1"
                size="2xl"
                mt="50%"
                maxW="80%"
                textAlign="center"
                fontWeight="bold"
              >
                This site contains sexually explicit material.
              </Heading>

              <Text fontSize="2xl" color="white" mt={10}>
                Enter ONLY if you are over 18
              </Text>

              <Flex gap={10}>
                <Button onClick={closeAsAdult} bg="accent.500" color="white">
                  I am over 18
                </Button>
                <Button
                  onClick={() => {
                    location.href = 'https://www.minecraft.net/en-us'
                  }}
                  bg="transparent"
                  border="1px solid white"
                  color="white"
                >
                  I am under 18
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
