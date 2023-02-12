import { SimpleGrid, GridItem, Wrap, Badge } from '@chakra-ui/react'
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
  if (!show) return null
  const getValue = (field: string, value: string) => {
    if (fields[field]?.meta?.options?.choices) {
      const option = fields[field].meta.options.choices.find(
        (choice: any) => choice.value.toLowerCase() == value.toLowerCase()
      )
      return option?.text || value
    }
    return value
  }
  return (
    <SimpleGrid key={k} columns={[minCols, 2, maxCols]} spacing={1} alignItems="start">
      {fieldList?.map((field, i: number) => (
        <GridItem
          key={`${field}-${i}`}
          colSpan={Array.isArray(member[field]) ? [minCols, 2, maxCols] : minCols}
        >
          {member[field] &&
            (Array.isArray(member[field]) ? (
              <>
                <h5>{capitalCase(fields[field].field)}:</h5>
                <Wrap gap={2}>
                  {member[field]?.map((item: any, d: number) => (
                    <Badge colorScheme={color} key={`badge-${item}`}>
                      {getValue(field, item)}
                    </Badge>
                  ))}
                </Wrap>
              </>
            ) : (
              <>
                <h5>{capitalCase(fields[field].field)}:</h5>
                <h4 style={{ textTransform: 'capitalize' }}>{getValue(field, member[field])}</h4>
              </>
            ))}
        </GridItem>
      ))}
    </SimpleGrid>
  )
}
