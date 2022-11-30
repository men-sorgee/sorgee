import Link from 'next/link';

export default function Custom404() {
  return (
    <section className="bg-gray-900">
      <div className="mx-auto max-w-screen-xl py-8 px-4 lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-purple-600 dark:text-purple-500 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            Something&rsquo;s missing.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can&rsquo;t find that page. You&rsquo;ll find lots to
            explore on the home page.
          </p>
          <Link href="/">
            <a className="my-4 inline-flex rounded-lg bg-purple-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-900">
              Back to Homepage
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
