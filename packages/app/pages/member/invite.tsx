import { useMember } from 'lib/hooks/use-member'
import { FormProvider, useForm } from 'react-hook-form'
import { MouseEventHandler, useEffect, useState } from 'react'
import { copyTextToClipboard, postJSON } from '@/lib/utils'
import { MemberLevel, UserInvite } from 'lib/models'
import { getFieldOptions } from 'lib/services/directus/server'
import { FormOptions, InviteLink } from 'lib/models'
import { Button } from 'react-daisyui'
import { FieldInput, FieldSelect } from 'components/forms'
import Page from 'components/Page'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userTypeOptions = await getFieldOptions('user_type')
  const exclude = ['subscriber', 'user', 'reject', 'staff', 'big_brother']
  return {
    props: {
      userTypeOptions: userTypeOptions.filter((o: { value: string }) => !exclude.includes(o.value)),
    },
  }
}

type PageProps = {
  userTypeOptions: FormOptions
}

function Invite({ userTypeOptions }: PageProps) {
  const { loading, member } = useMember()
  return (
    <Page title="Invite Someone" loading={loading} sectionClass="" requireAuth={true}>
      <p>
        {member?.first_name || 'Brother'}, enter your friend&apos;s email address and we will create
        a special link for you to share.
      </p>
      <Form userTypeOptions={userTypeOptions} />
    </Page>
  )
}

function Form({ userTypeOptions }: PageProps) {
  const { loading, member } = useMember()
  const [link, setLink] = useState<string>()
  const [sent, setSent] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const methods = useForm<InviteLink & { t: MemberLevel }>({
    mode: 'onBlur',
  })
  const { handleSubmit, setError, reset, getFieldState, formState } = methods

  useEffect(() => {
    if (sent) {
      setTimeout(() => {
        setSent(false)
        reset()
      }, 5000)
    }
    if (copied) {
      setTimeout(() => {
        setCopied(false)
        reset()
      }, 5000)
    }
  }, [loading, member, sent, copied])

  const getLink = ({ e, t }: UserInvite) => {
    if (!member) return
    const data = Buffer.from(JSON.stringify({ e, t, v: member?.id })).toString('base64')
    const invite = `${location.protocol}//${location.host}/apply/${data}`
    setLink(invite)
    return invite
  }

  const onCopyClick = (e: any) => {
    e.preventDefault()
    const invite = getLink(e.target.dataset)
    if (!invite) return
    copyTextToClipboard(invite)
    setCopied(true)
    setSent(false)
  }

  const onSubmit = async (data: InviteLink & { t: MemberLevel }) => {
    if (!member) {
      setError('email', { message: 'Member not found' })
    }
    const inviteLink = getLink({
      e: data.email,
      t: data.t,
      v: member?.id,
    })
    setLink(inviteLink)
    const [ok, response] = await postJSON('/api/member/invite', {
      ...data,
      link: inviteLink,
    })

    if (ok) {
      setSent(true)
      setCopied(false)
    } else {
      const { error } = response
      setError('email', { message: error?.message })
    }
  }
  const email = getFieldState('email', formState)

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="gradient max-w-md p-4">
          <div className="grid grid-cols-1 gap-4 ">
            <FieldInput
              field="email"
              type="email"
              autoComplete="email"
              registerOptions={{
                required: {
                  value: true,
                  message: 'Please enter an email address',
                },
              }}
              placeholder="Email address"
            />

            {member?.user_type == 'staff' && (
              <FieldSelect
                field="t"
                formOptions={userTypeOptions}
                registerOptions={{
                  required: {
                    value: true,
                    message: 'Please enter an email address',
                  },
                }}
              />
            )}
            <input type="hidden" name="link" value={link} />
            <input type="hidden" name="id" value={member?.id} />
            <Button color="accent" type="submit" disabled={!member}>
              Send Invite
            </Button>
            {email.isTouched && <Button onClick={onCopyClick}>Copy Link</Button>}
          </div>
        </form>
      </FormProvider>

      {copied && (
        <div className="toast-center toast-middle toast">
          <div className="alert-ghost alert whitespace-nowrap opacity-75">
            <div>
              <h4>
                The invite &nbsp;
                <a title={link} target={'_blank'} href={link} className="link" rel="noreferrer">
                  link
                </a>
                &nbsp; has been copied to your clipboard.
              </h4>
            </div>
          </div>
        </div>
      )}
      {sent && (
        <div className="toast-center toast-middle toast">
          <div className="alert-ghost alert whitespace-nowrap opacity-75">
            <div>
              <h4>
                The invite{' '}
                <a title={link} target={'_blank'} href={link} className="link" rel="noreferrer">
                  link
                </a>
                &nbsp; was sent.
              </h4>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Invite
