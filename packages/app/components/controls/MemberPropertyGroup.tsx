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
  if (!show)
    return (
      <Flex direction="column" textAlign="center" align="center">
        <LockIcon color="primary.500" h={30} w={30} mt={4} />
        <h3>Private</h3>
      </Flex>
    )
  const getValue = (field: string, value: string) => {
    if (fields[field]?.meta?.options?.choices) {
      const option = fields[field].meta.options.choices.find(
        (choice: any) => choice.value?.toLowerCase() == value?.toLowerCase()
      )
      return option?.text || value
    }
    return value
  }
  return (
    <SimpleGrid key={k} columns={[minCols, 2, maxCols]} spacing={1} alignItems="start">
      {fieldList
        ?.filter((f) => member[f] != undefined)
        ?.map(
          (field, i: number) =>
            member[field] != undefined && (
              <GridItem
                key={`${field}-${i}`}
                colSpan={Array.isArray(member[field]) ? [minCols, 2, maxCols] : minCols}
              >
                {Array.isArray(member[field]) ? (
                  <>
                    <Heading as="h4" size="sm">
                      {capitalCase(fields[field].field)}:
                    </Heading>
                    <Wrap gap={2} my={4}>
                      {member[field]?.map((item: any, d: number) => (
                        <Text
                          lineHeight={1}
                          color="primary.400"
                          key={`badge-${item}-${d}`}
                          size="2xl"
                          fontWeight="bold"
                        >
                          {getValue(field, item)}
                          {d < member[field].length - 1 && ','}
                        </Text>
                      ))}
                    </Wrap>
                  </>
                ) : (
                  <Box my={2}>
                    <Heading as="h4" size="sm" m={0}>
                      {capitalCase(fields[field].field)}:
                    </Heading>
                    <Heading as="h5" size="md" color="primary.400" textTransform="capitalize">
                      {getValue(field, member[field])}
                    </Heading>
                  </Box>
                )}
              </GridItem>
            )
        )}
    </SimpleGrid>
  )
}
