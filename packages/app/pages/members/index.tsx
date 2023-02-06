import { ManyItems } from '@directus/sdk'
import Page from 'components/Page'
import { useMember } from 'hooks/use-member'
import { UserAddIcon, StarIcon, ChatIcon } from '@heroicons/react/solid'
import { JsonFetcher, getSearchParams } from 'lib/utils'
import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { Loading, UserCard } from 'components/ui'
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
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Card,
  CardFooter,
  CardHeader,
  CardBody,
  Link,
  useColorModeValue,
  Badge,
  Wrap,
  useDisclosure,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react'
import {
  User,
  FormOptions,
  SearchableMember,
  searchableMemberFields,
  UserType,
  MemberLevel,
} from 'lib/models'
import { useRouter } from 'next/router'
import { Rating } from 'components/ui'
import useMemberSearch from 'hooks/use-members'
import { FormProvider, useForm } from 'react-hook-form'
import { NextPageContext } from 'next'
import { FieldCheckboxes } from '../../components/forms'

type PageProps = Partial<SearchableMember> &
  (Record<string, any> & {
    page: number
    size: number
    sort: keyof SearchableMember | string
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
  })

export async function getServerSideProps(context: NextPageContext) {
  const { getFieldOptions } = await import('lib/services/directus/server')
  const { page, size, sort = '-presence', ...filters } = context.query

  const props: PageProps = {
    page: Number(page) || 1,
    size: Number(size) || 10,
    sort: sort as string,
    ...filters,
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

export default function MemberListPage(props: PageProps) {
  const {
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
    page: rawPage,
    size: rawSize,
    sort: rawSort,
    user_type = '*',
    ...rawFilters
  } = props
  const router = useRouter()

  const [filters, setFilters] = useState<Partial<SearchableMember>>({ ...rawFilters } || {})
  const [level, setLevel] = useState<(string & UserType) | '*'>(user_type)
  const [sort, setSort] = useState<string>((rawSort as string) || '-presence')
  const [page, setPage] = useState<number>(Number(rawPage || '1'))
  const [size, setSize] = useState<number>(Number(rawSize || '20'))

  const { member, loading } = useMember()
  const memberLevel = MemberLevel[member?.user_type || 'subscriber']

  useEffect(() => {
    router.replace({
      pathname: '/members',
      query: { size, page, sort, user_type: level, ...filters },
    })
  }, [router, loading, member, page, size, sort, level, filters?.user_type, filters])

  const { members, meta, pageCount, error } = useMemberSearch(page - 1, size, sort, {
    user_type: level as any,
    ...filters,
  })

  const methods = useForm<SearchableMember>({
    mode: 'onBlur',
    defaultValues: filters as any,
  })

  // const { handleSubmit } = methods

  return (
    <Page title="Members" loading={loading} w="full" requireAuth={true}>
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
            {level == '*' && <option value="-user_type">By Level</option>}
            <option value="-rating">Highest Rated</option>
          </Select>
          <Select
            w={40}
            value={level}
            onChange={(e) => {
              setLevel(e.target.value as any)
            }}
          >
            <option value="*">All</option>
            {memberLevel >= MemberLevel.staff && <option value="applicant">Applicants</option>}
            {memberLevel >= MemberLevel.big_brother && <option value="pledge">Pledges</option>}
            {memberLevel >= MemberLevel.brother && <option value="inductee">Inductees</option>}
            <option value="brother">Brothers</option>
            <option value="big_brother">Big Brothers</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
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
        {members?.map((member: SearchableMember) => (
          <MemberCard key={member.id} member={member} />
        ))}
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

function MemberSpotlight({ member: { id } }: { member: Partial<SearchableMember> }) {
  const { member, loading } = useMember(id)
  if (loading || !member) return <Loading />

  return (
    <Flex direction="column" mb={2} align="center" justify="start" gap={2}>
      <Text>{member?.biography}</Text>
      {member?.cock_length && (
        <Badge size="lg" colorScheme="peach">
          {member?.cock_length}&ldquo; cock
        </Badge>
      )}
      {member?.cock_girth && (
        <Badge size="lg" colorScheme="peach">
          {member?.cock_girth}
        </Badge>
      )}
      <Flex gap={2}>
        {member?.cock_attributes?.map((a, i) => (
          <Badge size="lg" key={i} colorScheme="peach">
            {a}
          </Badge>
        ))}
      </Flex>
      <Flex gap={2}>
        {member?.cum_attributes?.map((a, i) => (
          <Badge size="lg" key={i} colorScheme="accent">
            {a}
          </Badge>
        ))}
      </Flex>
      <Wrap gap={2}>
        {member?.my_positions?.map((position, i) => (
          <Badge key={i} colorScheme="secondary">
            {position}
          </Badge>
        ))}
      </Wrap>
      <Wrap gap={2}>
        {member?.my_roles?.map((role, i) => (
          <Badge key={i} colorScheme="red">
            {role}
          </Badge>
        ))}
      </Wrap>
      <Wrap gap={2}>
        {member?.sexual_scenes?.map((scene, i) => (
          <Badge key={i} colorScheme="purple">
            {scene}
          </Badge>
        ))}
      </Wrap>
    </Flex>
  )
}

function MemberCard({ member }: { member: Partial<SearchableMember> }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cardBg = useColorModeValue('white', 'black')

  return (
    <>
      <LinkBox as="article" key={member?.id} onClick={onOpen}>
        <Card
          w="full"
          h="full"
          bg={cardBg}
          border="1px solid transparent"
          borderColor="accent.700"
          _hover={{ shadow: '2xl', borderColor: 'accent.500' }}
        >
          <CardHeader>
            <Flex direction="row" justify="stretch" justifyContent="space-between">
              <LinkOverlay href="#">
                <UserCard user={member} />
                <Flex align="stretch" justify="stretch" mt={4}>
                  {member?.spectrum && (
                    <Badge size={'lg'} colorScheme="blue">
                      {member.spectrum}
                    </Badge>
                  )}
                  {member?.relationship_status && (
                    <Badge size={'lg'} colorScheme="secondary">
                      {member.relationship_status}
                    </Badge>
                  )}
                </Flex>
              </LinkOverlay>
              <Flex direction="column">
                <Rating
                  value={member.rating || 0}
                  mt={2}
                  aria-label="User Rating"
                  size="xs"
                  simple
                />
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Divider />
            <Text noOfLines={2}>{member?.biography}</Text>
          </CardBody>
          <CardFooter></CardFooter>
        </Card>
      </LinkBox>
      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent>
          <ModalHeader>
            <Flex direction="column" justify="flex-start" align="top">
              <UserCard user={member} size="xl" />
              <Flex align="stretch" justify="stretch" mt={4}>
                {member?.spectrum && (
                  <Badge size={'lg'} colorScheme="blue">
                    {member.spectrum}
                  </Badge>
                )}
                {member?.relationship_status && (
                  <Badge size={'lg'} colorScheme="secondary">
                    {member.relationship_status}
                  </Badge>
                )}
              </Flex>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MemberSpotlight member={member} />
          </ModalBody>
          <ModalFooter>
            <Flex justify="space-between" align="center">
              <IconButton
                aria-label="Add Buddy"
                disabled={true}
                icon={<UserAddIcon fill="primary.300" />}
                variant="ghost"
              />
              <IconButton
                aria-label="Favorite"
                disabled={true}
                icon={<StarIcon fill="yellow.300" />}
                variant="ghost"
              />
              <IconButton
                aria-label="Message"
                disabled={true}
                icon={<ChatIcon fill="blue.300" />}
                variant="ghost"
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
