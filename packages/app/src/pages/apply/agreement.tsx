import { ButtonBusy, FieldCheckbox, Form, Markdown, Page } from "components";
import { useUser } from "hooks/use-user";
import { pages } from "lib/config";
import { AgreementData, ApplicationStatus, MemberLevel } from "lib/models";
import { postJSON } from "lib/utils/apis";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Alert, Box, Heading, Link, Text } from "@chakra-ui/react";

import ApplicationSteps from "./_steps";

interface Props {
  markdown: string
}

export const getStaticProps = async () => {
  const { getPageById } = await import('lib/services/directus/static/pages')
  const page = await getPageById(pages.rulesPage)
  const { markdown } = page
  return {
    props: {
      markdown,
    },
  }
}

export default function Agreement({ markdown }: Props) {
  const { loading, reload } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.agreement,
    redirectsEnabled: true,
  })
  const [complete, setComplete] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    if (complete) {
      router.push('/apply/approved')
    }
  }, [complete, router])
  return (
    <Page title="Agreement" loading={loading} header={<ApplicationSteps status={'agreement'} />}>
      {!complete && (
        <Form
          onSubmit={(data: AgreementData) => {
            return postJSON<AgreementData>('/api/apply/agree', data)
          }}
          successMessage="Agreement accepted"
          onSuccess={() => {
            reload().then(() => {
              setComplete(true)
            })
          }}
        >
          {({ watch }) => (
            <>
              <Box
                css={{
                  img: { display: 'none' },
                }}
                mt={4}
              >
                <Alert flexDirection="column" rounded='lg' shadow='xl'>
                  <Heading as="h2" size="xl" mt={0}>
                    Please Read Our Site Rules
                  </Heading>
                  <Text fontSize="xl">
                    We have a few rules that we need you to follow. Please read them carefully and
                    check the agree box, then click the Agree button when you are done.
                  </Text>
                </Alert>

                <Markdown content={markdown} size="lg" />
                <Heading as="h2" size="xl">
                  Legal Agreement
                </Heading>
                <Text fontSize="xl">
                  Please read and agree to our rules,{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                    className="link"
                  >
                    terms
                  </Link>
                  &nbsp;and&nbsp;
                  <Link
                    href="/terms"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                    className="link"
                  >
                    privacy policy
                  </Link>.&nbsp;
                  By entering this site, you are agreeing to respect the privacy of all members.
                  You also agree to not use this site for any illegal purposes.
                </Text>
              </Box>
              <Box mt={4}>
                <FieldCheckbox
                  textAlign="center"
                  field="agree"
                  registerOptions={{
                    required: {
                      value: true,
                      message: 'You must agree to the terms and conditions',
                    },
                  }}
                >
                  I agree
                </FieldCheckbox>
              </Box>

              <ButtonBusy colorScheme="primary" type="submit" mt={8} disabled={!watch('agree')}>
                Agree & Continue
              </ButtonBusy>
            </>
          )}
        </Form>
      )}
    </Page>
  )
}
