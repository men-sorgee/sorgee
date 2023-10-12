
import {
  ButtonLink,
  FieldCheckbox,
  FieldCheckboxes,
  FieldDate,
  FieldImage,
  FieldInput,
  FieldNumber,
  FieldRadioButtons,
  FieldRange,
  FieldRating,
  FieldSelect,
  FieldSwitch,
  FieldText,
  Markdown,
  Page
} from "components";
import { useUser } from "hooks";
import {
  AnswerType,
  GroupEvent,
  MemberLevel,
  Question,
  Survey,
  SurveyAnswer
} from "lib/models";
import { getJSON, postJSON, pruneUndefined } from "lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  Text,
  useBreakpointValue,
  useToast
} from "@chakra-ui/react";

type Props = {
  survey: Survey
  step: number
  question?: Question
}

export const getServerSideProps = async (context) => {
  const { id: i, step: s } = context.params

  if (s == undefined) {
    return {
      redirect: {
        destination: `/survey/${i}/1`,
        permanent: false,
      },
    }
  }
  const id = String(i)
  const step = Number(s)
  const { getSurvey } = await import('lib/services/directus/server/surveys')
  const survey = await getSurvey(id)

  const question = survey.questions[step - 1]?.survey_questions_id

  return {
    props: pruneUndefined({
      survey,
      question,
      step,
    }),
  }
}

export default function SurveyPage({ survey, question, step }: Props) {
  const { loading: userLoading, member } = useUser({
    minLevel: MemberLevel.pledge,
    redirectsEnabled: true,
  })
  const event = survey?.event as GroupEvent

  const [answer, setAnswer] = useState<SurveyAnswer>(undefined)
  const index = step - 1
  const [working, setWorking] = useState<boolean>(false)
  const toast = useToast()
  const methods = useForm({
    defaultValues: {
      ...answer,
    },
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (question && question.id != answer?.question) {
      getJSON<SurveyAnswer>(`/api/survey/${survey.id}/${question.id}`)
        .then((result) => {
          if (result.success) {
            setAnswer(result.data)
            reset({
              ...result.data,
            })
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey, question])

  const next = useCallback(
    (i?: number) => {
      location.href = `/survey/${survey.id}/${i || step + 1}`
    },
    [survey.id, step]
  )

  const onSubmit = useCallback(
    async (data: any) => {
      setWorking(true)
      const { success, error } = await postJSON(`/api/survey/${survey.id}/${question.id}`, data)
      setWorking(false)
      if (success) {
        next()
        reset({
          answer_boolean: false,
          answer_number: 0,
          answer_text: '',
          answer_choose: [],
          answer_context: '',
        })
      } else {
        toast({
          title: 'Error',
          status: 'error',
          description: error.message,
          isClosable: true,
        })
        setWorking(false)
      }
    },
    [survey.id, question?.id, next, reset, toast]
  )
  const orientation = useBreakpointValue<any>(['vertical', 'vertical', 'horizontal'])
  return (
    <Page title={survey.name} loading={userLoading}>
      {member && survey && (
        <Flex gap={4} w='full' direction={['row', 'row', 'column']} align="start" justify="stretch">
          <Stepper
            orientation={orientation}
            index={index}
            my={8}
            colorScheme="primary"
            color="white"
            w='full'
          >
            {survey.questions.map((q, i) => (
              <Step
                key={i}
                onClick={() => {
                  next(i + 1)
                }}
              >
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>


                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Box flex="shrink" w="full">
            <Markdown content={survey.description} />
            {(question && (
              <Box mt={4}>
                {answer && (
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Flex direction="column" gap={4} key={question.id}>
                        <Heading as="h5" size="h5" py={2} title={`Question.id: ${question.id}`}>
                          {question.question}
                        </Heading>
                        <InnerField question={question} />
                        <Text>{question.context}</Text>
                        {question.control != 'textarea' && (
                          <FieldText
                            mt={4}
                            placeholder={question.context ? '' : 'Anything to add?'}
                            field="answer_context"
                          />
                        )}
                      </Flex>
                      <HStack spacing={4} mt={4}>
                        <Spacer />
                        <Button colorScheme="accent" type="submit" disabled={working}>
                          {working ? <Spinner /> : 'Next'}
                        </Button>
                      </HStack>
                    </form>
                  </FormProvider>
                )}
              </Box>
            )) || (
                <Box textAlign="center">
                  <Heading textAlign="center">
                    Thank you
                    <br /> for completing the survey!
                  </Heading>
                  <Markdown content={survey.closing?.replaceAll('$NAME$', member.nickname)} />
                  {event && (
                    <ButtonLink href={`/events/${event.id}`} mt={4}>
                      Rate Event Attendees
                    </ButtonLink>
                  )}
                </Box>
              )}
          </Box>
        </Flex>
      )}
    </Page>
  )
}

const getFieldName = (type: AnswerType) => {
  switch (type) {
    case 'string':
    case 'date':
    case 'email':
    case 'url':
    case 'tel':
    case 'password':
    case 'time':
    case 'datetime-local':
    case 'month':
    case 'week':
    case 'color':
    case 'text':
      return 'answer_text'
    case 'number':
      return 'answer_number'
    case 'boolean':
      return 'answer_boolean'
    case 'string_array':
    case 'number_array':
      return 'answer_choose'
    case 'image':
      return 'answer_image'
    case 'file':
      return 'answer_file'
    default:
      return 'answer_text'
  }
}

const InnerField = ({ question }: { question: Question }) => {
  const { options, answer_type: type, control } = question
  const field = getFieldName(type)

  switch (control) {
    case 'input':
      return (
        (type == 'number' && (
          <FieldNumber field={field} min={question.number_minimum} max={question.number_maximum} />
        )) || <FieldInput field={field} type={type} />
      )
    case 'select':
      return (
        <FieldSelect
          field={field}
          options={options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'radio':
      return (
        <FieldRadioButtons
          field={field}
          options={options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'checkbox':
      return <FieldCheckbox field={field} help={'Leave blank for no.'} />
    case 'checkboxes':
      return (
        <FieldCheckboxes
          field={field}
          help={'Select all that apply.'}
          options={question.options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'rating':
      return <FieldRating field={field} aria-label={''} />
    case 'range':
      return (
        <FieldRange
          min={question.number_minimum}
          max={question.number_maximum}
          field={field}
          step={1}
        />
      )
    case 'textarea':
      return <FieldText field={field} />
    case 'switch':
      return <FieldSwitch field={field} label="Yes" />
    case 'date':
      return <FieldDate field={field} />
    case 'image':
      return (
        <FieldImage
          label={question.question}
          field={field}
          description={question.context}
          name={field}
          postUrl={''}
        />
      )
  }
}
