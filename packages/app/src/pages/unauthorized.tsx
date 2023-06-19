import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Text } from '@chakra-ui/react'

import { Page } from 'components'

export default function UnauthorizedPage() {
  const router = useRouter()
  const { level } = router.query
  return (
    <Page title="Unauthorized">
      <Text align="center">
        Unfortunately, the page you tried to access is only available to{' '}
        {level || 'member'}s. Learn how to advance your level in our{' '}
        <Link href="/brothers">brotherhood guide</Link>.
      </Text>

      <Image
        src="/images/sad-panda.png"
        width={200}
        height={200}
        alt="sad panda"
        style={{ margin: '10rem auto' }}
      />
    </Page>
  )
}
