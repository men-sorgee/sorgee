import { AspectRatio, HStack, Button, Box, IconButton, Badge, Flex } from '@chakra-ui/react'
import { useState } from 'react'
import { RefreshIcon, LightningBoltIcon } from '@heroicons/react/outline'
import { LightningBoltIcon as LightningBoltIconSolid } from '@heroicons/react/solid'
import { useMember } from 'hooks'
import Page from 'components/Page'
import dynamic from 'next/dynamic'

const BarcodeScannerComponent = dynamic(() => import('react-qr-barcode-scanner'), { ssr: false })

export default function Scanner() {
  const [facing, setFacing] = useState<'user' | 'environment'>('environment')
  const [light, setLight] = useState(false)
  const [show, setShow] = useState(true)
  const [url, setUrl] = useState<string>()
  const [stopStream, setStopStream] = useState(false)
  const { member, loading } = useMember()
  const onScan = (err: string, result: { getText: () => any }) => {
    if (!err && result) {
      let data = result.getText()
      if (data) {
        setUrl(data)
        dismiss()
        window?.open(data, '_blank')
      }
    }
  }
  const dismiss = () => {
    // Stop the QR Reader stream (fixes issue where the browser freezes when closing the modal) and then dismiss the modal one tick later
    setStopStream(true)
    setTimeout(() => setShow(false), 0)
  }
  if (typeof window == 'undefined' || !member) return null
  return (
    <Page title="Scan" requireAuth={true}>
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
                  window?.open(url, '_blank')
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
            w="full"
            maxW="560px"
            position="relative"
          >
            <AspectRatio mx="auto" ratio={1}>
              <BarcodeScannerComponent
                width="100%"
                onUpdate={onScan}
                stopStream={stopStream}
                facingMode={facing}
                torch={light}
              />
            </AspectRatio>
            <HStack align="center" position="absolute" zIndex="1" spacing={4} mt={-12}>
              <IconButton
                colorScheme="ghost"
                icon={<RefreshIcon />}
                onClick={() => {
                  setFacing(facing == 'user' ? 'environment' : 'user')
                }}
                aria-label={''}
              />
              <IconButton
                colorScheme="ghost"
                icon={light ? <LightningBoltIconSolid /> : <LightningBoltIcon />}
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
