import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useAppUser } from 'lib/hooks/use-member';
import { NextRouter, useRouter } from 'next/router';
import { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import ApplicationSteps from './_steps';
import { Button } from 'react-daisyui';
import Loading from 'components/ui/Loading';
import { Applicant } from 'lib/services/directus';
import Page from 'components/layout/Page';

function Verification() {
  const { member, loading } = useAppUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !member) {
      router.push('/apply');
      return;
    }
  }, [loading, member, router]);

  return (
    <Page
      title="Identification"
      loading={loading}
      header={<ApplicationSteps status={'verify'} />}
    >
      {member?.id && (
        <Form
          code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`}
          member={member}
          router={router}
        />
      )}
    </Page>
  );
}

function Form({
  code,
  member,
  router
}: {
  code: string;
  member: Applicant;
  router: NextRouter;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (member && member.photo) {
      setPreviewUrl(member.photo as string);
    }
  }, [member, member.photo, previewUrl, setPreviewUrl]);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      setError('No file was chosen');
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      setError('Files list is empty');
      return;
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith('image')) {
      setError('Please select a valid image');
      return;
    }

    setError(null);
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    e.currentTarget.type = 'text';
    e.currentTarget.type = 'file';
  };

  const onCancelFile = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!previewUrl && !file) {
      return;
    }
    setFile(null);
    setError(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      if (member.photo) {
        setComplete(true);
        router.push('/apply/review');
      }
      return;
    }

    try {
      let formData = new FormData();
      formData.append('media', file);

      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        setComplete(true);
        router.push('/apply/review');
        return;
      }

      const { error } = await res.json();

      if (error) {
        setError(error.message || 'Sorry! something went wrong.');
        return;
      }
    } catch (error) {
      console.error(error);
      setError('Sorry! something went wrong.');
    }
  };

  if (complete)
    return (
      <>
        <p className="text-center text-xl">
          Thank you for submitting your application and verification photo.
        </p>
        <Loading>
          <h3>Uploading</h3>
        </Loading>
      </>
    );

  return (
    <form onSubmit={onSubmit}>
      <p className="text-xl">
        To verify you are who you say you are, please take a selfie while
        holding a piece of paper with the following verification-code written on
        it.
      </p>

      <div className="flex flex-col gap-1.5 text-center md:py-4">
        <h2 className="font-sans text-6xl">{code}</h2>
        {previewUrl ? (
          <div className="w-full">
            <Image
              alt="file uploader preview"
              objectFit="cover"
              src={previewUrl}
              width={300}
              height={350}
              layout="fixed"
              className="w-full"
            />
          </div>
        ) : (
          <label className="flex h-full cursor-pointer flex-col items-center justify-center py-3 transition-colors duration-150 hover:text-gray-600">
            <input
              className="file-input-bordered file-input-primary file-input w-full max-w-xs"
              name="file"
              type="file"
              onChange={onFileUploadChange}
              required={true}
            />
          </label>
        )}

        {error && <p className="text-red-500">{error}</p>}
        <p className="text-xl">
          <strong>
            Be sure your face and code is clearly visible, with no sunglasses or
            hats.
          </strong>
          <br />
          This photo will not be shared with anyone and will not be used for
          your profile.
        </p>
        <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-4">
          <Button disabled={!previewUrl} onClick={onCancelFile}>
            Clear
          </Button>
          <Button type="submit" disabled={!previewUrl} color="primary">
            {file && 'Upload &'} Continue
          </Button>
        </div>
      </div>
    </form>
  );
}

export default withPageAuthRequired(Verification);
