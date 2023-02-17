import { useUser } from '@/hooks/use-user'
import { FormProvider, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { postJSON } from 'lib/utils'
import { SurveyAnswer, Survey, SurveyQuestion, Question } from 'lib/models'
import {
  HStack,
  Button,
  Box,
  Text,
  VStack,
  Heading,
  useToast,
  SimpleGrid,
  GridItem,
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
import { GetServerSideProps, GetServerSidePropsResult, NextPageContext } from 'next'
import { getServerSession } from 'next-auth'

export async function getServerSideProps(
  context: NextPageContext
): Promise<GetServerSidePropsResult<PageProps>> {
  const { authOptions } = await import('lib/auth/config')
  const { req, res } = context
  const session = await getServerSession(req as any, res, authOptions)
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { getSurvey } = await import('lib/services/directus/server')
  const { id } = context.query

  const survey = await getSurvey(id as string)
  return {
    props: {
      survey,
    },
  }
}

type PageProps = {
  survey: Survey
}

export default function SurveyPage({ survey }: PageProps) {
  const { loading, member } = useUser()
  return (
    <Page title="Survey" loading={loading} requireAuth={true}>
      {member && <Form survey={survey} />}
    </Page>
  )
}

function Form({ survey }: PageProps) {
  const { loading, member } = useUser()
  const toast = useToast()
  const [link, setLink] = useState<string>()
  const methods = useForm<SurveyAnswer[]>({
    mode: 'onBlur',
  })

  const { handleSubmit, reset, formState } = methods

  useEffect(() => {}, [loading, member])

  const onSubmit = async (data: any) => {
    const { success: ok, data: response, error } = await postJSON('/api/survey/' + survey.id, data)

    if (ok) {
      toast({
        title: 'Submitted!',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
      reset()
    } else {
      const { error } = response
      toast({
        title: 'Error',
        status: 'error',
        description: error.message,
        isClosable: true,
      })
    }
  }
  // const email = getFieldState('email', formState)

  const questions: Question[] = survey.questions.map((s: SurveyQuestion) => s.survey_questions_id)

  return (
    <>
      <Text mb={10}>{member?.first_name || 'Brother'}, please let us know how we did!</Text>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {questions &&
            questions.map((question, i) => {
              return (
                <>
                  <Heading as="h5" size="md" p={2}>
                    {question.question}
                  </Heading>
                  <SimpleGrid spacing={2} columns={[1, 1, 2]}>
                    <QuestionField key={i} question={question} />
                    <FieldText
                      placeholder={'Anything to add?'}
                      field={`${i + question.id}-context`}
                    />
                  </SimpleGrid>
                </>
              )
            })}

          <input type="hidden" name="memberId" defaultValue={member?.id} />
          <HStack spacing={4} mt={4}>
            <Button colorScheme="accent" type="submit" disabled={!member}>
              Submit
            </Button>
          </HStack>
        </form>
      </FormProvider>
    </>
  )
}

function QuestionField({ question }: { question: Question }) {
  switch (question.answer_type) {
    case 'select':
      return (
        <FieldSelect
          field={question.id}
          help={question.context}
          options={question.options.map((o) => {
            return { text: o.name, value: o.value }
          })}
        />
      )
    case 'string':
      return <FieldInput field={question.id} help={question.context} />
    case 'text':
      return <FieldText field={question.id} help={question.context} />
    case 'choose':
      return (
        <GridItem colSpan={[1, 1, 2]}>
          <FieldCheckboxes
            field={question.id}
            help={question.context}
            options={question.options.map((o) => {
              return { text: o.name, value: o.value }
            })}
          />
        </GridItem>
      )
    case 'number':
      return <FieldNumber label={question.question} field={question.id} help={question.context} />
    case 'boolean':
      return <FieldCheckbox label={question.question} field={question.id} help={question.context} />

    default:
  }
}
