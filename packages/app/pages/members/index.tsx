import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { useMember } from 'hooks/use-member'
import { JsonFetcher, getSearchParams } from 'lib/utils'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { UserCard } from 'components/ui'
import { ArrowRightIcon, ArrowLeftIcon, ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import {
  Divider,
  Flex,
  HStack,
  Stat,
  StatGroup,
  Select,
  Checkbox,
  StatLabel,
  StatNumber,
  SimpleGrid,
  Tooltip,
  IconButton,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  Link,
  useColorModeValue,
  Badge,
  Wrap,
  CardFooter,
} from '@chakra-ui/react'
import { User, FormOptions, SearchableMember, searchableMemberFields } from 'lib/models'
import { useRouter } from 'next/router'
import { Rating } from 'components/ui'
import useMemberSearch from 'hooks/use-members'
import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldCheckboxes } from '../../components/forms'

type PageProps = {
  spectrumOptions: FormOptions
  relationshipOptions: FormOptions
  positionsOptions: FormOptions
  skinToneOptions: FormOptions
  hairColorOptions: FormOptions
  hairStyleOptions: FormOptions
  eyeColorOptions: FormOptions
  mannerismsOptions: FormOptions
  bodyHairOptions: FormOptions
  bodyAttributesOptions: FormOptions
  facialHairOptions: FormOptions
  scenesOptions: FormOptions
  cockGirthOptions: FormOptions
  cockAttributesOptions: FormOptions
  ballSizeOptions: FormOptions
  ballGravityOptions: FormOptions
  cumAttributesOptions: FormOptions
  loadPolicyOptions: FormOptions
  hivStatusOptions: FormOptions
  vaccinationStatusOptions: FormOptions
  myRolesOptions: FormOptions
  theirRolesOptions: FormOptions
  theirSpectrumOptions: FormOptions
  theirPositionsOptions: FormOptions
  buildOptions: FormOptions
}

/*
export async function getServerSideProps(context: NextPageContext) {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const props: PageProps = {
    spectrumOptions: await getFieldOptions<User>('spectrum'),
    relationshipOptions: await getFieldOptions<User>('relationship_status'),
    positionsOptions: await getFieldOptions<User>('my_positions'),
    skinToneOptions: await getFieldOptions<User>('skin_tone'),
    hairColorOptions: await getFieldOptions<User>('hair_color'),
    hairStyleOptions: await getFieldOptions<User>('hair_style'),
    eyeColorOptions: await getFieldOptions<User>('eye_color'),
    mannerismsOptions: await getFieldOptions<User>('mannerisms'),
    bodyHairOptions: await getFieldOptions<User>('body_hair'),
    bodyAttributesOptions: await getFieldOptions<User>('body_attributes'),
    facialHairOptions: await getFieldOptions<User>('facial_hair'),
    scenesOptions: await getFieldOptions<User>('sexual_scenes'),
    cockGirthOptions: await getFieldOptions<User>('cock_girth'),
    cockAttributesOptions: await getFieldOptions<User>('cock_attributes'),
    ballSizeOptions: await getFieldOptions<User>('ball_size'),
    ballGravityOptions: await getFieldOptions<User>('ball_gravity'),
    cumAttributesOptions: await getFieldOptions<User>('cum_attributes'),
    loadPolicyOptions: await getFieldOptions<User>('load_policy'),
    hivStatusOptions: await getFieldOptions<User>('hiv_status'),
    vaccinationStatusOptions: await getFieldOptions<User>('vaccinations'),
    myRolesOptions: await getFieldOptions<User>('my_roles'),
    theirRolesOptions: await getFieldOptions<User>('their_roles'),
    theirSpectrumOptions: await getFieldOptions<User>('their_spectrum'),
    theirPositionsOptions: await getFieldOptions<User>('their_positions'),
    buildOptions: await getFieldOptions<User>('build'),
  }
  return { props }
}
*/

export default function MemberListPage(props: PageProps) {
  /*const {
    spectrumOptions,
    positionsOptions,
    relationshipOptions,
    skinToneOptions,
    hairColorOptions,
    hairStyleOptions,
    eyeColorOptions,
    mannerismsOptions,
    bodyHairOptions,
    bodyAttributesOptions,
    facialHairOptions,
    scenesOptions,
    cockGirthOptions,
    cockAttributesOptions,
    ballSizeOptions,
    ballGravityOptions,
    cumAttributesOptions,
    loadPolicyOptions,
    hivStatusOptions,
    vaccinationStatusOptions,
    myRolesOptions,
    theirRolesOptions,
    theirSpectrumOptions,
    theirPositionsOptions,
    buildOptions,
  } = props*/

  const [init, setInit] = useState<boolean>(false)
  const [sort, setSort] = useState<string>('-presence')
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const [filters, setFilters] = useState<Partial<SearchableMember>>(undefined)
  const cardBg = useColorModeValue('white', 'black')
  const router = useRouter()
  const { page: rawPage, size: rawSize, sort: rawSort, ...rawFilters } = router.query
  const { member, loading } = useMember()

  useEffect(() => {
    if (!loading && member && !init) {
      if (rawPage) {
        setPage(Number(rawPage))
      }
      if (rawSize) {
        setSize(Number(rawSize))
      }
      if (rawSort) {
        setSort(rawSort as string)
      }
      if (rawFilters) {
        setFilters(rawFilters as any)
      }
      setInit(true)
    } else {
      let url =
        `/members?page=${page}` + `&size=${size}&sort=${sort}` + `${getSearchParams(filters)}`
      if (url != router.asPath) {
        router.push(url)
      }
    }
  }, [loading, member, rawPage, rawSize, rawSort, init, filters])

  const { members, meta, pageCount, error } = useMemberSearch(page - 1, size, sort, filters)

  const methods = useForm<SearchableMember>({
    mode: 'onBlur',
    defaultValues: filters as any,
  })

  const { handleSubmit } = methods

  return (
    <Page title="Members" loading={loading} w="full">
      {meta && (
        <Flex gap={2} align="center" justify="space-between" my={2}>
          <Select
            w={32}
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </Select>
          <Select
            w={40}
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as any)
            }}
          >
            <option value="-presence">Online</option>
            <option value="-last_login">Recently Online</option>

            <option value="nickname">By Username</option>
            <option value="-user_type">By Level</option>
            <option value="-rating">Highest Rated</option>
          </Select>
        </Flex>
      )}
      {/**<Accordion allowToggle w="full">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Filter Members
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          
          <AccordionPanel>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit((data) => {
                  setFilters(data)
                })}
              >
                <FieldCheckboxes
                  field="spectrum"
                  label="Orientation"
                  formOptions={spectrumOptions}
                />
                <FieldCheckboxes
                  field="mannerisms"
                  label="Mannerisms"
                  formOptions={mannerismsOptions}
                />
                <FieldCheckboxes
                  field="relationship_status"
                  label="Relationship Status"
                  formOptions={relationshipOptions}
                />
                <FieldCheckboxes
                  field="skin_tone"
                  label="Skin Tone"
                  formOptions={skinToneOptions}
                />
                <FieldCheckboxes
                  field="hair_color"
                  label="Hair Color"
                  formOptions={hairColorOptions}
                />
                <FieldCheckboxes
                  field="hair_style"
                  label="Hair Style"
                  formOptions={hairStyleOptions}
                />
                <FieldCheckboxes
                  field="body_hair"
                  label="Body Hair"
                  formOptions={bodyHairOptions}
                />
                <FieldCheckboxes
                  field="facial_hair"
                  label="Facial Hair"
                  formOptions={facialHairOptions}
                />
                <FieldCheckboxes
                  field="eye_color"
                  label="Eye Color"
                  formOptions={eyeColorOptions}
                />

                <FieldCheckboxes
                  field="body_attributes"
                  label="Other Attributes"
                  formOptions={bodyAttributesOptions}
                />

                <FieldCheckboxes
                  field="cock_girth"
                  label="Cock Girth"
                  formOptions={cockGirthOptions}
                />
                <FieldCheckboxes
                  field="cock_attributes"
                  label="Cock Attributes"
                  className="sm:col-span-2"
                  formOptions={cockAttributesOptions}
                />
                <FieldCheckboxes
                  field="ball_size"
                  label="Ball Size"
                  formOptions={ballSizeOptions}
                />
                <FieldCheckboxes
                  field="ball_gravity"
                  label="Ball Sack"
                  formOptions={ballGravityOptions}
                />
                <FieldCheckboxes
                  field="cum_attributes"
                  label="Cum Attributes"
                  className="sm:col-span-2"
                  formOptions={cumAttributesOptions}
                />
              </form>
            </FormProvider>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
              **/}
      <StatGroup as={HStack} spacing={4}>
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>{meta.total}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Filtered</StatLabel>
          <StatNumber>{meta.filtered}</StatNumber>
        </Stat>
      </StatGroup>
      <SimpleGrid my={5} columns={[1, 1, 2]} spacing={4} w="full" justifyItems="stretch">
        {members &&
          members.map((member: SearchableMember) => {
            return (
              <Link key={member.id} _hover={{ textDecoration: 'none' }}>
                <Card
                  w="full"
                  h="full"
                  bg={cardBg}
                  p={4}
                  border="1px solid transparent"
                  _hover={{ shadow: 'xl', borderColor: 'accent.500' }}
                >
                  <Flex direction="row" justify="stretch" gap={2} justifyContent="space-between">
                    <Flex direction="column" align="start" justify="space-between">
                      <UserCard user={member} />
                      <Rating
                        value={member.rating || 0}
                        mt={2}
                        aria-label="User Rating"
                        size="xxs"
                        simple
                      />
                    </Flex>
                    <Flex
                      direction="column"
                      align="end"
                      justify="space-between"
                      alignItems="flex-end"
                    >
                      <Flex mb={2} align="flex-end" justify="space-between" gap={2}>
                        {member?.spectrum && (
                          <Badge colorScheme="primary">{member?.spectrum}</Badge>
                        )}
                        {member?.relationship_status && (
                          <Badge colorScheme="accent">{member?.relationship_status}</Badge>
                        )}
                      </Flex>
                      <Flex wrap="wrap" gap={2} align="end" justify="end" direction="row-reverse">
                        {member?.my_positions?.map((position, i) => (
                          <Badge key={i} colorScheme="secondary">
                            {position}
                          </Badge>
                        ))}
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </Link>
            )
          })}
      </SimpleGrid>
      <Flex justifyContent="space-between" m={4} alignItems="center">
        <Flex>
          <Tooltip label="First Page">
            <IconButton
              onClick={() => setPage(1)}
              isDisabled={page == 1}
              icon={<ArrowLeftIcon h={3} w={3} />}
              mr={4}
              aria-label="First Page"
            />
          </Tooltip>
          <Tooltip label="Previous Page">
            <IconButton
              onClick={() => setPage(page - 1)}
              isDisabled={page == 1}
              icon={<ChevronLeftIcon h={6} w={6} />}
              aria-label="Previous Page"
            />
          </Tooltip>
        </Flex>

        <Flex alignItems="center">
          <Text flexShrink="0" mx={8}>
            Page{' '}
            <Text fontWeight="bold" as="span">
              {page}
            </Text>{' '}
            of{' '}
            <Text fontWeight="bold" as="span">
              {pageCount}
            </Text>
          </Text>

          <Tooltip label="Next Page">
            <IconButton
              onClick={() => setPage(page + 1)}
              isDisabled={pageCount == 0 || page + 1 >= pageCount}
              icon={<ChevronRightIcon h={6} w={6} />}
              aria-label="Next Page"
            />
          </Tooltip>
          <Tooltip label="Last Page">
            <IconButton
              onClick={() => setPage(pageCount)}
              isDisabled={page >= pageCount}
              icon={<ArrowRightIcon h={3} w={3} />}
              ml={4}
              aria-label="Last Page"
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Page>
  )
}
