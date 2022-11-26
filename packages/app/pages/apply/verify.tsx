import { tw } from 'twind';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useMember } from 'lib/hooks/use-member';
import styles from 'styles';
import { NextRouter, useRouter } from 'next/router'
import { useState, ChangeEvent, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

function Verification() {
  const { member, loading } = useMember();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !member) {
      router.push('/apply');
      return 
    } 
    if (member?.application_status && member!.application_status !== 'verify') {
      router.push('/apply/' +  member!.application_status);
      return
    }
  }, [loading, member, router])

  return (

      <section className={tw(styles.sectionDark)}>
        <h2 className={tw(styles.h2page)}>Application: Verification</h2>
        {member?.id && <Form code={`${member.id.slice(0, 4)} ${member.id.slice(4, 8)}`} router={router} />}
      </section>
    
  );
}

function Form ({code, router }: { code: string, router: NextRouter }) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;

    if (!fileInput.files) {
      setError("No file was chosen");
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      setError("Files list is empty");
      return;
    }

    const file = fileInput.files[0];

    if (!file.type.startsWith("image")) {
      setError("Please select a valid image");
      return;
    }

    setError(null);
    setFile(file);
    setPreviewUrl(URL.createObjectURL(file)); 

    e.currentTarget.type = "text";
    e.currentTarget.type = "file";
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

  const onUploadFile = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError(null);
    if (!file) {
      return;
    }

    try {
      let formData = new FormData();
      formData.append("media", file);

      const res = await fetch("/api/admin/verify", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setComplete(true);
        router.push('/apply/agree');
        return;
      }

      const { error } = await res.json();

      if (error) {
        setError(error.message || "Sorry! something went wrong.");
        return;
      }
    } catch (error) {
      console.error(error);
      setError("Sorry! something went wrong.");
    }
  };

  if (complete) return (<>
    <p>Verification photo submitted.</p>

    <div className={tw`mt-8`}>
      <Link href="/apply/agree">
        <a className={tw(styles.buttonPrimary)}>Continue to Agreement</a>
      </Link>
    </div>
    </>
    )

  return (   
     
        <form
          className={tw`w-full py-3 md:mx-auto max-w-md`}
          onSubmit={(e) => e.preventDefault()}
        >
          <p className={tw(styles.pLg)}>
            To complete your application, take a selfie while holding a piece of
            paper with the following verification written on it.
          </p>
          <h2 className={tw`font-sans !text-6xl`}>
            { code }
          </h2>
          <div className={tw`flex flex-col  gap-1.5 md:py-4`}>
            <div className={tw`flex-grow border border-1 border-dashed`}>
              {previewUrl ? (
                <div className={tw`w-full`}>
                  <Image
                    alt="file uploader preview"
                    objectFit="cover"
                    src={previewUrl}
                    width={300}
                    height={350}
                    layout="fixed"
                    className={tw`w-full`}
                  />
                </div>
              ) : (
                <label className={tw`flex flex-col items-center justify-center h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600`}>
                  
                  <strong className={tw`text-sm font-medium`}>
                    Select an image
                  </strong>
                  <input
                    className={tw`block w-0 h-0`}
                    name="file"
                    type="file"
                    onChange={onFileUploadChange}
                  />
                </label>
                
              )}
            </div>
            <p className={tw`text-red-500`}>
              {error}
            </p>
            <div className={tw`grid grid-cols-2 gap-1`}>
              <button
                disabled={!previewUrl}
                onClick={onCancelFile}
                className={tw`${styles.button}`}
              >
                Cancel
              </button>
              <button
                disabled={!previewUrl}
                onClick={onUploadFile}
                className={tw`${styles.buttonPrimary}`}
              >
                Upload
              </button>
            </div>
          </div>
          <p className={tw`${styles.pLg} mt-8`}>
            <strong>
              Be sure your face and code is clearly visible, with no sunglasses or
              hats.
            </strong>
            &nbsp; This photo will not be shared with anyone and will not be used
            for your profile.
          </p>
        </form>)
}

export default withPageAuthRequired(Verification);
