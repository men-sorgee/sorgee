import { useMember } from 'hooks/use-member'
import { useRouter } from 'next/router'
import { useState, ChangeEvent } from 'react'
import ApplicationSteps from './_steps'
import { Button } from '@chakra-ui/react'
import Page from 'components/Page'
import FieldCheckbox from 'components/forms/FieldCheckbox'
import { FormProvider, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResponse } from 'lib/models'
import { getAssetUrl } from 'lib/utils'

function Verification() {
  const { member, loading } = useMember()
  const [completed, setCompleted] = useState(false)
  const router = useRouter()

  return (
    <Page
      title="Identification"
      loading={loading || completed}
      requireAuth={true}
      header={<ApplicationSteps status={'verify'} />}
    >
      {member?.id && (
        <Form
          code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
          {...{ member, router, setCompleted }}
        />
      )}
    </Page>
  )
}

function Form({ code, router, setCompleted }): JSX.Element {
  const { member, reload } = useMember()
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    member?.photo ? getAssetUrl(member.photo) : null
  )
  const [file, setFile] = useState<File | null>(null)

  const methods = useForm<{ file: File; verify: boolean }>({
    defaultValues: { verify: false },
    mode: 'onChange',
  })
  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = methods

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target

    const file = fileInput.files ? (fileInput.files?.length ? fileInput.files[0] : null) : null
    if (!file || !file.type.startsWith('image')) {
      setError('file', { message: 'Please select a valid image' })
      return
    }
    clearErrors()
    setFile(file)
    setPreviewUrl(URL.createObjectURL(file))

    e.currentTarget.type = 'text'
    e.currentTarget.type = 'file'
  }

  const onCancelFile = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!previewUrl && !file) {
      return
    }
    reset({ file: null, verify: false })
    clearErrors()
    setFile(null)
    setPreviewUrl(null)
  }

  function skip() {
    router.push('/apply/review')
  }

  async function onSubmit({ verify }: { verify: boolean }) {
    if (!file || !verify) return

    try {
      let formData = new FormData()
      formData.append('media', file)

      const res = await fetch('/api/member/verify', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        reload()
        setCompleted(true)
        router.push('/apply/review')
      } else {
        const body = (await res.json()) as ApiResponse
        if (body.error?.field) {
          setError(body.error!.field as any, body.error.message as any)
        } else {
          setError('file', { message: 'Something went wrong' })
        }
      }
    } catch (error) {
      setError('file', { message: error.message })
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-xl">
          To verify you are who you say you are, please take a selfie while holding a piece of paper
          with the following verification-code written on it.
        </p>

        <div className="flex flex-col gap-1.5 text-center md:py-4">
          <h2 className="my-0 font-sans text-6xl">{code}</h2>
          {previewUrl ? (
            <div className="w-full">
              <img
                alt="file uploader preview"
                src={previewUrl}
                width={300}
                height={350}
                className="mx-auto"
              />
            </div>
          ) : (
            <label className="flex h-full cursor-pointer flex-col items-center justify-center py-3 transition-colors duration-150 hover:text-gray-600">
              <input
                className="file-input-bordered file-input-primary file-input w-full max-w-xs"
                onChange={onFileUploadChange}
                type="file"
              />
            </label>
          )}
          {member?.photo_denial_reason && (
            <p className="text-lg text-red-500">
              Your verification photo was denied.
              {member.photo_denial_reason}
            </p>
          )}
          <p className="text-xl">
            <strong>
              Be sure your face and code is clearly visible, with no sunglasses or hats.
            </strong>
            <br />
            This photo will not be shared with anyone and will not be used for your profile.
          </p>
          <div className="flex justify-center">
            <FieldCheckbox
              field="verify"
              label="I certify that the photo I am submitting is me."
              registerOptions={{ required: 'Certification is Required' }}
            />
          </div>
          <ErrorMessage
            render={(m) => <p className="text-red-500">{m.message}</p>}
            errors={errors}
            name={'file'}
          />

          <div className="mx-auto mt-8 flex justify-between gap-4">
            <Button color="info" disabled={!previewUrl} onClick={onCancelFile}>
              Clear
            </Button>
            {member?.photo && !member?.photo_denial_reason && (
              <Button type="submit" onClick={handleSubmit(skip)} color="info">
                Use Existing
              </Button>
            )}
            {file && (
              <Button type="submit" disabled={!previewUrl} color="accent">
                Upload
              </Button>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default Verification
