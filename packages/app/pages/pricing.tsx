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
import { CheckCircleIcon } from '@heroicons/react/solid'
import Page from 'components/Page'
import { useSite } from '../hooks/use-site'
import { LinkButton } from '../components/ui'
const Check = ({ available = false }) => (
  <Icon
    as={CheckCircleIcon}
    boxSize={6}
    color={available ? 'green.500' : useColorModeValue('gray.500', 'gray.300')}
  />
)

export default function ThreeTierPricing() {
  const { site, loading } = useSite()
  return (
    <Page title="Pricing" description="Membership due pricing for varying levels.">
      <Heading as="h2" size={['lg', 'xl']}>
        Membership dues that fit your hunger
      </Heading>
      <Text fontSize="lg">
        Start with 30-day free trial. No credit card needed. Cancel at anytime.
      </Text>

      <TableContainer>
        <Table
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
                  Basic
                </Text>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'md', sm: 'lg', md: '3xl' }}
                  color={useColorModeValue('primary.400', 'white')}
                >
                  Plus
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
                  color={useColorModeValue('gray.500', 'gray.200')}
                >
                  $3
                </Text>
                <Show above="md">
                  <Text color={useColorModeValue('gray.500', 'gray.200')}>
                    <em>/ month</em>
                  </Text>
                </Show>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={useColorModeValue('gray.500', 'gray.200')}
                >
                  $9
                </Text>
                <Show above="md">
                  <Text color={useColorModeValue('gray.500', 'gray.200')}>
                    <em>/ month</em>
                  </Text>
                </Show>
              </Th>
              <Th>
                <Text
                  fontSize={{ base: 'lg', md: 'xl' }}
                  color={useColorModeValue('gray.500', 'gray.200')}
                >
                  $19
                </Text>
                <Show above="md">
                  <Text color={useColorModeValue('gray.500', 'gray.200')}>
                    <em>/ month</em>
                  </Text>
                </Show>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th>
                <Text as="strong" color={useColorModeValue('gray.500', 'gray.200')}>
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
              <Th color="gray.200">
                <em>Search *</em>
              </Th>
              <Td>
                <Check />
              </Td>
              <Td>
                <Check />
              </Td>
              <Td>
                <Check />
              </Td>
            </Tr>
            <Tr>
              <Th color={useColorModeValue('gray.500', 'gray.200')}>
                <em>Messaging *</em>
              </Th>
              <Td>
                <Check />
              </Td>
              <Td>
                <Check />
              </Td>
              <Td>
                <Check />
              </Td>
            </Tr>
            <Tr>
              <Th color={useColorModeValue('gray.500', 'gray.200')}>
                <em>Live Location *</em>
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
              <Th color={useColorModeValue('gray.500', 'gray.200')}>
                <em>Live Chat *</em>
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
              <Th color={useColorModeValue('gray.500', 'gray.200')}>
                <em>Create Groups *</em>
              </Th>
              <Td></Td>
              <Td></Td>
              <Td>
                <Check />
              </Td>
            </Tr>
            <Tr>
              <Th color={useColorModeValue('gray.500', 'gray.200')}>
                <em>Host Events *</em>
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
                <Text as="em" color="gray.200">
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
        <LinkButton my={8} colorScheme="accent" size="lg" href="/apply">
          Get Started
        </LinkButton>
      )) || (
        <LinkButton my={8} colorScheme="accent" size="lg" href="/limited">
          Get Started
        </LinkButton>
      )}
    </Page>
  )
}
