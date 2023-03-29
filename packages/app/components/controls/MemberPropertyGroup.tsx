import { LockIcon } from '@chakra-ui/icons'
import { SimpleGrid, GridItem, Wrap, Text, Flex, Heading, Box } from '@chakra-ui/react'
import { capitalCase } from 'change-case'
import { Member, DirectusField } from 'lib/models'

type Props = {
  k: string
  member: Member
  show: boolean
  fieldList: string[]
  fields: Record<string, DirectusField>
  maxCols?: number
  minCols?: number
}

export const MemberPropertyGroup = ({
  k,
  member,
  show,
  fieldList,
  fields,
  minCols = 1,
  maxCols = 3,
}: Props) => {
  const populatedFields =
    fieldList?.filter((f) => member[f] != undefined && member[f]?.length > 0) || []

  if (!show)
    return (
      <Flex direction="column" textAlign="center" align="center">
        <LockIcon color="primary.500" h={30} w={30} mt={4} />
        <Heading as="h3" size="sm">
          Private
        </Heading>
      </Flex>
    )

  if (populatedFields.length == 0)
    return (
      <Flex direction="column" textAlign="center" align="center">
        <Heading as="h3" size="sm">
          Nothing Provided
        </Heading>
      </Flex>
    )

  const getValue = (field: string, value: string) => {
    if (fields[field]?.meta?.options?.choices) {
      const option = fields[field].meta.options.choices.find(
        (choice: any) => choice.value?.toLowerCase() == value?.toString()?.toLowerCase()
      )
      return capitalCase(option?.text || value)
    }
    return value
  }

  return (
    <SimpleGrid key={k} columns={[minCols, 2, maxCols]} spacing={1} alignItems="start">
      {populatedFields.map(
        (field, i: number) =>
          member[field] != undefined && (
            <GridItem
              key={`${field}-${i}`}
              colSpan={Array.isArray(member[field]) ? [minCols, 2, maxCols] : minCols}
            >
              {Array.isArray(member[field]) ? (
                <>
                  <Heading as="h4" size="sm" my={2}>
                    {capitalCase(fields[field].field)}:
                  </Heading>
                  <Wrap gap={2} mb={2}>
                    {member[field]?.map((item: any, d: number) => (
                      <Text
                        lineHeight={1}
                        color="primary.400"
                        key={`badge-${item}-${d}`}
                        size="md"
                        m={0}
                      >
                        {getValue(field, item)}
                        {d < member[field].length - 1 && ','}
                      </Text>
                    ))}
                  </Wrap>
                </>
              ) : (
                <Box mb={2}>
                  <Heading as="h4" size="sm" my={2}>
                    {capitalCase(fields[field].field)}:
                  </Heading>
                  <Text m={0} size="md" color="primary.400" textTransform="capitalize">
                    {getValue(field, member[field])}
                  </Text>
                </Box>
              )}
            </GridItem>
          )
      )}
    </SimpleGrid>
  )
}
