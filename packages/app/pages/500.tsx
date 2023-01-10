import { useMeta } from 'hooks/use-meta'
import { useEffect } from 'react'

export default function Custom500() {
  const { setMeta } = useMeta()

  useEffect(() => {
    setMeta('Server Error')
  })
  return (
    <section className="bg-gray-900">
      <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl ">500</h1>
          <p className="gradient:text-white mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Internal Server Error.
          </p>
          <p className="gradient:text-gray-400 mb-4 text-lg font-light text-gray-500">
            We are probably already trying to solve the problem.
          </p>
        </div>
      </div>
    </section>
  )
}
