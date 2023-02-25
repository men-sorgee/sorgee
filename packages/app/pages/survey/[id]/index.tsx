import { useUser } from 'hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { JsonFetcher, postJSON } from 'lib/utils'
import useSWR from 'swr'
import { SurveyAnswer, Survey, SurveyQuestion, Question, Member } from 'lib/models'
import {
  HStack,
  Button,
  Flex,
  Box,
  Heading,
  useToast,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { LinkButton } from 'components/controls'
import {
  FieldInput,
  FieldSelect,
  FieldText,
  FieldCheckboxes,
  FieldCheckbox,
  FieldNumber,
} from 'components/forms'
import Page from 'components/Page'
import { useRouter } from 'next/router'
import { Steps, Step } from 'chakra-ui-steps'

export default function SurveyPage({ step = 1 }: { step: number }) {
  const router = useRouter()
  const { id: i } = router.query
  const [id] = useState<string>(String(i))

  useEffect(() => {
    if (id && step) {
      window.history.replaceState(null, '', `/survey/${id}/${step}`)
    }
  }, [id, step])

  const next = () => {
    router.push(`/survey/${id}/${step + 1}`)
  }

  const key = `/api/survey/${id || ''}`
  const [survey, setSurvey] = useState<Survey>(undefined)
  const { loading, member } = useUser()

  const { data, isLoading } = useSWR<Survey, Error>(key, JsonFetcher, {
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    isPaused: () => loading || id == undefined,
  })

  useEffect(() => {
    if (id && member && data && !survey) {
      setSurvey(data)
    }
  }, [data, survey, member, id, loading, isLoading])

  return (
    <Page title={survey?.name || 'Survey'} loading={loading || isLoading} requireAuth={true}>
      {member && survey && (
        <Survey member={member} survey={survey} activeStep={step - 1} next={next} />
      )}
    </Page>
  )
}

function Survey({
  member,
  survey,
  activeStep,
  next,
}: {
  member: Member
  survey: Survey
  activeStep: number
  next: () => void
}) {
  useEffect(() => {}, [activeStep])
  return (
    <>
      <Steps activeStep={activeStep} my={8} colorScheme="primary" color="white" responsive={false}>
        {survey.questions.map((q, index) => (
          <Step color="white" key={index} />
        ))}
      </Steps>
      {(activeStep < survey.questions.length && (
        <Form
          member={member}
          survey={survey}
          surveyQuestion={survey.questions[activeStep]}
          next={next}
        />
      )) || (
        <Box>
          <Heading>Thank you for completing the survey!</Heading>
          <Flex gap={4} my={10}>
            <LinkButton href="/member/events">Rate More Events</LinkButton>
            <LinkButton href="/calendar">Find Events</LinkButton>
            <LinkButton href="/members">Find Men</LinkButton>
          </Flex>
        </Box>
      )}
    </>
  )
}

function Form({
  member,
  survey,
  surveyQuestion,
  next,
}: {
  member: Member
  survey: Survey
  surveyQuestion: SurveyQuestion
  next: () => void
}) {
  const question = surveyQuestion.survey_questions_id as Question
  const key = `/api/survey/${survey.id}/answer/${question.id}`
  const toast = useToast()
  const [working, setWorking] = useState<boolean>(false)

  const { data: answer, mutate } = useSWR<SurveyAnswer, Error>(key, JsonFetcher, {
    revalidateOnMount: true,
    fallbackData: {
      question: question.id,
      survey: survey.id,
      user: member.id,
    },
  })

  const methods = useForm<Partial<SurveyAnswer>>({
    mode: 'onBlur',
    defaultValues: answer,
  })

  const { handleSubmit, reset, register } = methods

  const onSubmit = async (data: any) => {
    setWorking(true)
    const { success, data: response, error } = await postJSON(key, data)

    if (success) {
      mutate(response).then(() => {
        reset()
        next()
        setWorking(false)
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
  }

  return (
    <Box mt={4}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {question && answer && (
            <Flex direction="column" gap={4} key={question.id}>
              <Heading as="h5" size="md" py={2}>
                {question.question}
              </Heading>
              <Text>{question.context}</Text>
              <QuestionField question={question} />
              <FieldText mt={4} placeholder={'Anything to add?'} field="question_context" />
            </Flex>
          )}
          <HStack spacing={4} mt={4}>
            <Spacer />
            <Button colorScheme="accent" type="submit" disabled={working}>
              {working ? <Spinner /> : 'Next'}
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </Box>
  )
}

function QuestionField({ question }: { question: Question }) {
  switch (question.answer_type) {
    case 'select':
      return (
        <FieldSelect
          field="answer_text"
          help={question.context}
          options={question.options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'string':
      return <FieldInput field="answer_text" help={question.context} />
    case 'text':
      return <FieldText field="answer_text" help={question.context} />
    case 'choose':
      return (
        <FieldCheckboxes
          field="answer_choose"
          help={question.context}
          options={question.options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'number':
      return <FieldNumber label={question.question} field="answer_number" help={question.context} />
    case 'boolean':
      return (
        <FieldCheckbox label={question.question} field="answer_boolean" help={question.context} />
      )

    default:
  }
}
