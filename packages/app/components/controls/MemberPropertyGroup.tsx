import { LockIcon } from '@chakra-ui/icons'
import { SimpleGrid, GridItem, Wrap, Badge, Square, Flex } from '@chakra-ui/react'
import { capitalCase } from 'change-case'
import { Member, DirectusField } from 'lib/models'

type Props = {
  k: string
  member: Member
  show: boolean
  fieldList: string[]
  fields: Record<string, DirectusField>
  color: string
  maxCols?: number
  minCols?: number
}

export const MemberPropertyGroup = ({
  k,
  member,
  show,
  fieldList,
  fields,
  color,
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
                    <h5>{capitalCase(fields[field].field)}:</h5>
                    <Wrap gap={2}>
                      {member[field]?.map((item: any, d: number) => (
                        <Badge colorScheme={color} key={`badge-${item}-${d}`}>
                          {getValue(field, item)}
                        </Badge>
                      ))}
                    </Wrap>
                  </>
                ) : (
                  <>
                    <h5>{capitalCase(fields[field].field)}:</h5>
                    <h4 style={{ textTransform: 'capitalize' }}>
                      {getValue(field, member[field])}
                    </h4>
                  </>
                )}
              </GridItem>
            )
        )}
    </SimpleGrid>
  )
}
