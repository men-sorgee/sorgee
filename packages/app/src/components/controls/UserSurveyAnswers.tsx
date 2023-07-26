import { JsonFetcher } from 'lib/utils'
import swr from 'swr'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Badge,
  Heading,
  Stack,
  Text
} from '@chakra-ui/react'
import { UserSurvey, Question, SurveyAnswer, AnswerType } from 'lib/models'

export type UserSurveyAnswersProps = {
  surveyId: string
  userId: string
  children?: React.ReactNode
}

export function UserSurveyAnswers({
  surveyId,
  userId,
  children
}: UserSurveyAnswersProps) {
  const { data: survey, isLoading } = swr<UserSurvey>(
    `/api/survey/${surveyId}/results/${userId}`,
    JsonFetcher
  )

  if (isLoading) return <Text>Loading...</Text>

  const Answer = ({
    question,
    answer
  }: {
    question: Question
    answer: SurveyAnswer
  }) => {
    if (!answer) return <Text>No answer</Text>
    switch (question.answer_type) {
      case 'number':
        return (
          <Text>
            <pre>{answer.answer_number}</pre>
          </Text>
        )
      case 'number_array':
      case 'string_array':
        return (
          <Stack direction="row" gap={2}>
            {answer.answer_choose.map((a: string) => (
              <Badge key={a} mr={1}>
                {a}
              </Badge>
            ))}
          </Stack>
        )
      case 'boolean':
        return <Text>{answer.answer_boolean ? 'Yes' : 'No'}</Text>
      default:
        return (
          (question.answer_type == 'color' && (
            <Badge fontSize="lg" bgColor={answer.answer_text} color="white">
              {answer.answer_text}
            </Badge>
          )) || <Text size="sm">{answer.answer_text}</Text>
        )
    }
  }

  return (
    <>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left" color="text">
              {survey?.name} Results {children}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {survey?.questions.map(
              (
                question: Question & { sort: number; answer: SurveyAnswer },
                index: number
              ) => (
                <Box key={index} mb={2}>
                  <Heading as="h4" size="sm" my={2} textTransform="capitalize">
                    {question.question}
                  </Heading>
                  <Answer question={question} answer={question.answer} />
                </Box>
              )
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}
