import { useUser } from 'hooks'
import { FormProvider, useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import { getJSON, postJSON, pruneUndefined } from 'lib/utils'
import { SurveyAnswer, Survey, Question, GroupEvent } from 'lib/models'
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
import { LinkButton } from 'components/controls'

type Props = {
  survey: Survey
  step: number
  question: Question
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
  const question = survey.questions[step - 1].survey_questions_id

  return {
    props: pruneUndefined({
      survey,
      question,
      step,
    }),
  }
}

export default function SurveyPage({ survey, question, step }: Props) {
  const { loading: userLoading, member } = useUser()
  const event = survey?.event as GroupEvent
  const router = useRouter()
  const [answer, setAnswer] = useState<SurveyAnswer>()

  const [working, setWorking] = useState<boolean>(false)
  const toast = useToast()
  const methods = useForm({
    defaultValues: {
      ...answer,
    },
  })

  const { handleSubmit, reset } = methods

  useEffect(() => {
    if (question.id != answer?.question) {
      getJSON<SurveyAnswer>(`/api/survey/${survey.id}/${question.id}`)
        .then((result) => {
          if (result.success) {
            setAnswer(result.data)
            reset({
              ...result.data,
            })
          } else {
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [survey.id, question.id, answer?.question, answer, router.asPath, reset])

  const next = useCallback(() => {
    router.push(`/survey/${survey.id}/${step + 1}`)
  }, [survey.id, step, router])

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
    [survey.id, question.id, next, reset, toast]
  )

  return (
    <Page title={survey.name} loading={userLoading} requireAuth={true}>
      {member && survey && (
        <>
          <Steps activeStep={step} my={8} colorScheme="primary" color="white" responsive={false}>
            {survey.questions.map((q, index) => (
              <Step color="white" key={index} />
            ))}
          </Steps>
          {(step < survey.questions.length && (
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
                      <FieldText
                        mt={4}
                        placeholder={question.context ? '' : 'Anything to add?'}
                        field="answer_context"
                      />
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
              {event && (
                <LinkButton href={`/events/${event.id}`} mt={4}>
                  Rate Event Attendees
                </LinkButton>
              )}
            </Box>
          )}
        </>
      )}
    </Page>
  )
}

const InnerField = ({ question }: { question: Question }) => {
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
