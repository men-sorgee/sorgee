import { capitalCase } from "change-case";
import { DirectusField, Member, QueryFields, User } from "lib/models";

import { LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  GridItem,
  Heading,
  SimpleGrid,
  Text
} from "@chakra-ui/react";

export type MemberPropertyGroupProps = {
  k: string
  member: Partial<Member>
  show: boolean
  fieldList: QueryFields<User>
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
}: MemberPropertyGroupProps) => {
  const populatedFields =
    fieldList?.map(v => v as string).filter(
      (f) => member[f] != undefined && (Array.isArray(member[f]) ? member[f]?.length > 0 : true)
    ) || []
  const color = 'white'
  if (!show)
    return (
      <Flex direction="column" textAlign="center" align="center">
        <LockIcon color={color} h={30} w={30} mt={4} />
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

  const normalize = (text: string | number | boolean) =>
    text?.toString() ? text?.toString()?.toLowerCase() : text
  const getValue = (field: string, value: string) => {
    if (fields[field]?.meta?.options?.choices) {
      const option = fields[field].options.find(
        (choice: any) => normalize(choice.value) == normalize(value)
      )
      return capitalCase(option?.text ? option.text : value)
    }
    return value
  }

  return (
    <SimpleGrid key={k} columns={[minCols, 2, maxCols]} spacing={1} alignItems="start">
      {populatedFields.map(
        (field: string, i: number) =>
          member[field] != undefined && (
            <GridItem
              key={`${field}-${i}`}
              colSpan={Array.isArray(member[field]) ? [minCols, 2, maxCols] : minCols}
            >
              {Array.isArray(member[field]) ? (
                <>
                  <Heading as="h4" color={color} size="sm" my={2} textTransform="capitalize">
                    {capitalCase(fields[field].field)}
                  </Heading>
                  <Box gap={2} mb={2}>
                    {member[field]?.map((item: any, d: number) => (
                      <Text
                        as="span"
                        color={color}
                        key={`${item}-${d}`}
                        fontSize="md"
                        m={0}
                        textTransform="capitalize"
                      >
                        {getValue(field, item)}
                        {d < member[field].length - 1 && ','}{' '}
                      </Text>
                    ))}
                  </Box>
                </>
              ) : (
                <Box mb={2}>
                  <Heading as="h4" color={color} size="sm" my={2} textTransform="capitalize">
                    {capitalCase(fields[field].field)}:
                  </Heading>
                  <Text m={0} fontSize="md" color={color} textTransform="capitalize">
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
