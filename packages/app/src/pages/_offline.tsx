import { useMeta } from "hooks/use-meta";
import { useEffect } from "react";

export default function Custom500() {
  const { setMeta } = useMeta()

  useEffect(() => {
    setMeta('Offline')
  })
  return (
    <section className="bg-gray-900">
      <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl ">
            OFFLINE
          </h1>
          <p className="gradient:text-white mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            There seems to be something wrong with the internet. Fuck Comcast.
          </p>
        </div>
      </div>
    </section>
  )
}
