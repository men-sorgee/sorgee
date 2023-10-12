'use client'
import "client-only";

import { BarcodeScanner, Page } from "components";
import { useUser } from "hooks";
import { MemberLevel } from "lib/models";
import { useRouter } from "next/router";
import { useState } from "react";

import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton
} from "@chakra-ui/react";
import {
  ArrowPathRoundedSquareIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { BoltIcon as LightningBoltIconSolid } from "@heroicons/react/24/solid";

export default function Scanner() {
  const router = useRouter()
  const [facing, setFacing] = useState<'user' | 'environment'>('environment')
  const [light, setLight] = useState(false)
  const [show, setShow] = useState(true)
  const [url, setUrl] = useState<string>()
  const [stopStream, setStopStream] = useState(false)
  const { member, loading } = useUser({
    minLevel: MemberLevel.staff,
    redirectsEnabled: true,
  })


  const onScan = (err: string, result: { getText: () => any }) => {
    if (!err && result) {
      let data = result.getText()
      if (data) {
        setUrl(data)
        dismiss()
        setTimeout(() => {
          location.href = data
        }, 1000)
      }
    }
  }

  const dismiss = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(true)
    setTimeout(() => setShow(false), 0)
  }

  if (loading || !member) return null

  return (
    <Page title="Scan">
      <Flex direction="column">
        <>
          {url && (
            <Badge
              maxW={['sm', 'lg', 'xl']}
              whiteSpace="pre-wrap"
              as="div"
              my={2}
              colorScheme="primary"
            >
              {url}
            </Badge>
          )}
          <HStack spacing={4}>
            {url && (
              <Button
                size="lg"
                title={url}
                colorScheme="primary"
                onClick={() => {
                  router.push(url)
                }}
              >
                Go Now
              </Button>
            )}
            {!show && (
              <Button
                size="lg"
                onClick={() => {
                  setUrl(null)
                  setShow(true)
                }}
              >
                Scan Code
              </Button>
            )}
          </HStack>
        </>
      </Flex>

      {show && (
        <>
          <Box
            bgGradient="linear(to-r, accent.500, primary.400)"
            p={2}
            rounded="lg"
            position="relative"
          >
            <AspectRatio ratio={1}>
              <BarcodeScanner
                constraints={{ video: { facingMode: facing } }}
                onResult={(result) => {
                  onScan(null, result)
                }}
              />
            </AspectRatio>
            <HStack align="center" position="absolute" zIndex="1" spacing={4} mt={-12} mx={'45%'}>
              <IconButton
                bg="white"
                icon={<ArrowPathRoundedSquareIcon />}
                color="accent.500"
                onClick={() => {
                  setFacing(facing == 'user' ? 'environment' : 'user')
                }}
                aria-label={''}
              />
              <IconButton
                bg="white"
                color="accent.500"
                icon={light ? <LightningBoltIconSolid /> : <BoltIcon />}
                onClick={() => {
                  setLight(!light)
                }}
                aria-label={''}
              />
            </HStack>
          </Box>
        </>
      )}
    </Page>
  )
}
