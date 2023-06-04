import { css } from '@emotion/react'
import {
  Box,
  useColorModeValue,
  Show,
  Heading,
  Text,
  Icon,
  VStack,
  Hide,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Page from 'components/Page'
import { useSite } from '../hooks/use-site'
import { ButtonLink } from '../components/controls'

const Check = ({ available = false }) => {
  const style = useColorModeValue('gray.500', 'gray.300')
  return <Icon as={CheckCircleIcon} boxSize={6} color={available ? 'green.500' : style} />
}

export default function ThreeTierPricing() {
  const { site } = useSite()
  return (
    <Page title="Pricing" description="Membership due pricing for varying levels.">
      <Heading as="h2" size={['lg', 'xl']}>
        Membership dues that fit your hunger
      </Heading>
      <Text fontSize="lg">
        Billing begins immeditatly. You can choose to be billed monthly or annually. Cancel at anytime.
      </Text>

      <TableContainer>
        <Table
          color={useColorModeValue('primary.300', 'white')}
          css={css`
            --chakra-space-4: 0.75em;
          `}
          variant={['unstyled', 'simple']}
          size={{ base: 'sm', md: 'md', lg: 'lg' }}
        >
          <Thead>
            <Tr>
              <Th></Th>
              <Th>
                <Text
                  fontSize={{ base: 'md', sm: 'lg', md: '3xl' }}
                  color={useColorModeValue('primary.300', 'white')}
                >
                  Free
                </Text>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'md', sm: 'lg', md: '3xl' }}
                  color={useColorModeValue('primary.400', 'white')}
                >
                  Basic
                </Text>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'md', sm: 'lg', md: '3xl' }}
                  color={useColorModeValue('primary.500', 'white')}
                >
                  Pro
                </Text>
              </Th>
            </Tr>
            <Tr>
              <Td>
                <Hide above="md">
                  <em color={useColorModeValue('gray.300', 'white')}>Per month:</em>
                </Hide>
              </Td>
              <Th>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={useColorModeValue('gray.500', 'white')}
                >
                  FREE
                </Text>
                <Show above="md">
                  <Text color={useColorModeValue('gray.500', 'white')}>
                    <em>/ month</em>
                  </Text>
                </Show>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={useColorModeValue('gray.500', 'white')}
                >
                  $10
                </Text>
                <Show above="md">
                  <Text color={useColorModeValue('gray.500', 'white')}>
                    <em>/ month</em>
                  </Text>
                </Show>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={useColorModeValue('gray.500', 'white')}
                >
                  $40
                </Text>
                <Show above="md">
                  <Text color={useColorModeValue('gray.500', 'white')}>
                    <em>/ month</em>
                  </Text>
                </Show>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'white')}>
                  Event Invites
                </Text>
              </Th>
              <Td>
                <Check available />
              </Td>
              <Td>
                <Check available />
              </Td>
              <Td>
                <Check available />
              </Td>
            </Tr>

            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'white')}>
                  <em>Member Cruising</em>
                </Text>
              </Th>
              <Td>
                <Check available />
              </Td>
              <Td>
                <Check available />
              </Td>
              <Td>
                <Check available />
              </Td>
            </Tr>
            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'white')}>
                  <em>Messaging</em>
                </Text>
              </Th>
              <Td>

              </Td>
              <Td>
                <Check available />
              </Td>
              <Td>
                <Check available />
              </Td>
            </Tr>

            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'white')}>
                  <em>Buddy List (w/Online Status)</em>
                </Text>
              </Th>
              <Td></Td>
              <Td>
                <Check available />
              </Td>
              <Td>
                <Check available />
              </Td>
            </Tr>
            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'white')}>
                  <em>Cruise by Location *</em>
                </Text>
              </Th>
              <Td></Td>
              <Td>
                <Check />
              </Td>
              <Td>
                <Check />
              </Td>
            </Tr>
            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'white')}>
                  <em>Host Private Events *</em>
                </Text>
              </Th>
              <Td></Td>
              <Td></Td>
              <Td>
                <Check />
              </Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>
                <Text as="em" color={useColorModeValue('gray.500', 'white')}>
                  * coming soon
                </Text>
              </Th>
              <Th></Th>
              <Th></Th>
              <Th></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
      {(!site.invite_only && (
        <ButtonLink my={8} colorScheme="accent" size="lg" href="/subscribe">
          Get Started
        </ButtonLink>
      )) || (
          <ButtonLink my={8} colorScheme="accent" size="lg" href="/limited">
            Get Started
          </ButtonLink>
        )}
    </Page>
  )
}
