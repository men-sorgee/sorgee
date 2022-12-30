import Link from 'next/link'
import { setMeta } from 'hooks'

export default function Custom404() {
  setMeta('Not Found')
  return (
    <section className="bg-gray-900">
      <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="gradient:text-purple-500 mb-4 text-7xl font-extrabold tracking-tight text-purple-600 lg:text-9xl">
            404
          </h1>
          <p className="gradient:text-white mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Something&rsquo;s missing.
          </p>
          <p className="gradient:text-gray-400 mb-4 text-lg font-light text-gray-500">
            Sorry, we can&rsquo;t find that page. You&rsquo;ll find lots to explore on the home
            page.
          </p>
          <Link
            href="/"
            className="gradient:focus:ring-purple-900 my-4 inline-flex rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  )
}
