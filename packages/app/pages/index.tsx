import Head from 'next/head';
import React from 'react';
import { tw } from 'twind';
import Logo from 'components/ui/Logo';
import styles from '_styles';

export default function HomePage() {
  const { h2page, h3section, p, sectionWhite, sectionDark } = styles;
  return (
    <>
      <Head>
        <title>Guys-N-Heat: Home</title>
      </Head>

      <section className={tw(sectionWhite)}>
        <div
          className={tw`flex flex-col items-center max-w-6xl mx-auto md:flex-row`}
        >
          <div className={tw`w-full md:w-1/2`}>
            <Logo width={200} height={200} className={tw`p-2 mx-auto`} />
          </div>
          <div className={tw`flex flex-col md:w-1/2  md:mt-0`}>
            <h2 className={tw(h2page)}>Guys N Heat</h2>
            <p className={tw(p)}>
              Hot social events for bisexual and married men who value
              discretion. A discrete environment to express, explore and
              discover.
            </p>
          </div>
        </div>
      </section>
      <section className={tw(sectionDark)}>
        <div className={tw`max-w-6xl mx-auto`}>
          <div className={tw`flex flex-col items-center md:flex-row`}>
            <div className={tw`w-full md:w-1/2 md:pr-8`}>
              <p className={tw(p)}>
                We use your stated preferences to craft events that maximize fun
                for everyone!
              </p>
              <p className={tw(p)}>
                Our events are designed to maximize your fun!
              </p>
            </div>
            <div className={tw`w-full md:w-1/2`}>
              <form
                action="https://thebrotherhoodgroup.us13.list-manage.com/subscribe/post?u=402ed825f5ff12c2a4e3e8b94&amp;id=05b4cabc8b&amp;f_id=009608e3f0"
                method="post"
                target="_blank"
              >
                <h3 className={tw(h3section)}>Receive Updates</h3>
                <input
                  type="text"
                  name="FNAME"
                  id="FNAME"
                  className={tw`block text-black w-full px-4 py-3 mb-4 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none`}
                  placeholder="Name"
                  required
                  autoComplete="first-name"
                />
                <input
                  type="email"
                  name="EMAIL"
                  id="EMAIL"
                  className={tw`block text-black w-full px-4 py-3 mb-4 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none`}
                  placeholder="Email address"
                  required
                  autoComplete="email"
                />

                <div className={tw`block`}>
                  <button
                    className={tw`w-full px-3 py-4 font-medium text-white bg-blue-500 rounded-lg`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className={tw(sectionWhite)}>
        <div
          className={tw`flex flex-col items-start max-w-6xl mx-auto md:flex-row`}
        >
          <h3 className={tw`${h3section} sm:w-1/2`}>Men, not Numbers</h3>

          <p className={tw`${p} w-full md:w-1/2`}>
            Don&rsquo;t waste time staring at screens, searching through profile
            after profile.
          </p>
        </div>
      </section>
    </>
  );
}
