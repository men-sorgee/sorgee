import { Member, Question, SurveyAnswer, UserSurvey } from "lib/models";
import { JsonFetcher } from "lib/utils";
import { ReactNode } from "react";
import swr from "swr";

import { Avatar, Box, Heading, HStack, Tag, Text } from "@chakra-ui/react";

import { MemberAvatar } from "./";

export type MemberSurveyAnswersProps = {
  surveyId: string
  member: Pick<Member, 'picture' | 'id' | 'nickname'>
  headingSize?: string
}

export function MemberSurveyAnswers({
  surveyId,
  member,
  headingSize = 'md',
}: MemberSurveyAnswersProps) {
  const { data: survey, isLoading } = swr<UserSurvey>(
    `/api/survey/${surveyId}/results/${member?.id}`,
    JsonFetcher
  )

  if (isLoading) return <Text p={2}>Loading...</Text>

  let badgeProps = {
    rounded: 'lg',
    px: 2,
    py: 1,
    size: ['sm', 'md'],
    color: 'white',
    my: 1,
  }

  const Answer = ({
    question,
    answer,
    children,
  }: {
    question: Question
    answer: SurveyAnswer
    children?: ReactNode
  }) => {
    if (!answer) return <>(No answer)</>
    switch (question.answer_type) {
      case 'number':
        return (
          <>
            {children}
            <Tag bg="primary.400" {...badgeProps}>
              <pre>{answer.answer_number}</pre>
            </Tag>
          </>
        )
      case 'number_array':
      case 'string_array':
        return (
          <>
            {children}
            {answer.answer_choose.map((a: string) => (
              <Tag key={a} bg="primary.400" {...badgeProps}>
                {a}
              </Tag>
            ))}
          </>
        )
      case 'boolean':
        return (
          <>
            {children}
            <Tag bg="primary.400" {...badgeProps}>
              {answer.answer_boolean ? 'Yes' : 'No'}
            </Tag>
          </>
        )
      default:
        if (answer.answer_text == undefined) return <>(no answer)</>
        return (
          (question.answer_type == 'color' && (
            <>
              {children}
              <Tag bg="primary.400" {...badgeProps}>
                This color: &nbsp;
                <Box bg={answer.answer_text} rounded="full" p={2}></Box>
              </Tag>
            </>
          )) || (
            <>
              {children}
              <Tag bg="primary.400" {...badgeProps}>
                {answer.answer_text}
              </Tag>
            </>
          )
        )
    }
  }

  return (
    <>
      <Heading as="h3" size={headingSize} mt={0} mb={4}>
        {survey?.name} Results
      </Heading>

      {survey?.questions.map(
        (question: Question & { sort: number; answer: SurveyAnswer }, index: number) => (
          <Box key={index} mb={2}>
            <Box textAlign="right">
              <HStack display="inline-flex">
                <Tag bg="accent.400" {...badgeProps}>
                  {question.question}
                </Tag>
                <Avatar
                  size="xs"
                  name="Admin"
                  bg="accent.500"
                  color="white"
                  border={`1px solid white`}
                />
              </HStack>
            </Box>

            <Box textAlign="left">
              <HStack>
                <Answer question={question} answer={question.answer}>
                  <MemberAvatar member={member} size="xs" />
                </Answer>
              </HStack>
            </Box>
          </Box>
        )
      )}
    </>
  )
}
