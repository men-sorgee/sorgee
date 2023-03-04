import { useUser } from 'hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { JsonFetcher, postJSON, pruneUndefined } from 'lib/utils'
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

export const getServerSideProps = (context) => {
  const { id, step = 1 } = context.params
  return {
    props: pruneUndefined({
      id,
      step: Number(step),
    }),
  }
}

export default function SurveyPage({ id, step = 1 }: { id: string; step: number }) {
  const router = useRouter()
  const { id: i } = router.query
  const [surveyId, setSurveyId] = useState<string>('')

  useEffect(() => {
    if (surveyId != '' && step > 0) {
      window.history.replaceState(null, '', `/survey/${surveyId}/${step}`)
    } else if (i || id) {
      setSurveyId(id || (i as string))
    }
  }, [i, id, step, surveyId])

  const next = () => {
    router.push(`/survey/${surveyId}/${step + 1}`)
  }

  const key = `/api/survey/${surveyId}`
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
          <Heading textAlign="center">
            Thank you
            <br /> for completing the survey!
          </Heading>
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
              <Heading as="h5" size="h5" py={2}>
                {question.question}
              </Heading>

              <QuestionField question={question} />
              <Text>{question.context}</Text>
              <FieldText
                mt={4}
                placeholder={question.context ? '' : 'Anything to add?'}
                field="question_context"
              />
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
          options={question.options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'string':
      return <FieldInput field="answer_text" />
    case 'text':
      return <FieldText field="answer_text" />
    case 'choose':
      return (
        <FieldCheckboxes
          field="answer_choose"
          help={'Select all that apply.'}
          options={question.options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'number':
      return <FieldNumber label={question.question} field="answer_number" />
    case 'boolean':
      return (
        <FieldCheckbox
          label={question.question}
          field="answer_boolean"
          help={'Leave blank for no.'}
        />
      )

    default:
  }
}
