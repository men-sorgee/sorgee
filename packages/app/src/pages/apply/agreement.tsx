import { BusyButton, Markdown } from "components/controls";
import { ConnectForm, FieldCheckbox, Form } from "components/forms";
import Page from "components/Page";
import { useUser } from "hooks/use-user";
import { pages } from "lib/config";
import {
  AgreementData,
  ApplicationStatus,
  Member,
  MemberLevel
} from "lib/models";
import { postJSON } from "lib/utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Box, Button, Heading, Text } from "@chakra-ui/react";

import ApplicationSteps from "./_steps";

interface Props {
  markdown: string
}

export const getStaticProps = async () => {
  const { getPageById } = await import('lib/services/directus/static')
  const page = await getPageById(pages.rulesPage)
  const { markdown } = page
  return {
    props: {
      markdown
    }
  }
}

export default function Agreement({ markdown }: Props) {
  const { loading, reload } = useUser({
    minLevel: MemberLevel.applicant,
    minAppStatus: ApplicationStatus.agreement,
    redirectsEnabled: true
  })
  const [complete, setComplete] = useState<boolean>(false)
  const router = useRouter()
  useEffect(() => {
    if (complete) {
      router.push('/apply/approved')
    }
  }, [complete, router])
  return (
    <Page
      title="Agreement"
      loading={loading}
      header={<ApplicationSteps status={'agreement'} />}
    >
      {!complete && (
        <Form<AgreementData>
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
                  img: { display: 'none' }
                }}
                mt={4}
              >
                <Heading as="h2" size="xl">
                  Site Rules
                </Heading>
                <Markdown content={markdown} size="lg" />
                <Heading as="h2" size="xl">
                  Legal Agreement
                </Heading>
                <Text fontSize="xl">
                  Please read and agree to our rules,{' '}
                  <a
                    href="/terms"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                    className="link"
                  >
                    terms
                  </a>
                  &nbsp;and&nbsp;
                  <a
                    href="/terms"
                    target="_blank"
                    style={{ textDecoration: 'underline' }}
                    className="link"
                  >
                    privacy policy.
                  </a>
                  By entering this site, you commit to keep all user information
                  confidential and not to share it with any third parties. You
                  also agree to not use this site for any illegal purposes.
                </Text>
              </Box>
              <Box mt={4}>
                <FieldCheckbox
                  textAlign="center"
                  field="agree"
                  registerOptions={{
                    required: {
                      value: true,
                      message: 'You must agree to the terms and conditions'
                    }
                  }}
                >
                  I agree
                </FieldCheckbox>
              </Box>

              <BusyButton
                colorScheme="primary"
                type="submit"
                mt={8}
                disabled={!watch('agree')}
              >
                Agree & Continue
              </BusyButton>
            </>
          )}
        </Form>
      )}
    </Page>
  )
}
