import Head from 'next/head';
import React from 'react';
import { tw } from 'twind';
import styles from 'styles';
import Fire from '../components/icons/fire';

export default function HomePage() {
  const { h2page, h3section, p, sectionWhite, sectionDark } = styles;
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <section className={tw(sectionWhite)}>
        <div
          className={tw`flex flex-col items-center max-w-6xl mx-auto md:flex-row`}
        >
          <div className={tw`w-full sm:w-1/2`}>
            <Fire />
          </div>
          <div className={tw`flex flex-col md:w-1/2 md:mt-0`}>
            <h2 className={tw(h2page)}>Too Hot for the Public</h2>
            <p className={tw(p)}>
              A hot new social club for bisexual and married men who value
              discretion. We facilitate discrete events, in safe environments to
              express, explore and discover.
            </p>
            <p className={tw`${p} italic !text-sm`}>
              (Accepting applications through invites only.)
            </p>
          </div>
        </div>
      </section>
      <section className={tw(sectionDark)}>
        <div className={tw`max-w-6xl mx-auto`}>
          <div
            className={tw`flex flex-col items-center md:flex-row flex-col-reverse`}
          >
            <div className={tw`w-full md:w-1/2 md:pr-8 mt-8`}>
              <p className={tw(p)}>
                We use guests&apos; preferences to craft the events with
                compatible men to make things easy for you!
              </p>
              <p className={tw(p)}>
                All guests are pre-screened and vetted to weed-out weirdos, bots
                and scammers.
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
                  <button className={tw(styles.button)}>
                    Get Notifications
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
          <h3 className={tw`${h3section} sm:w-1/2`}>
            Men, <br />
            not Numbers
          </h3>

          <p className={tw`${p} w-full md:w-1/2`}>
            Don&rsquo;t waste time staring at screens, searching through profile
            after profile, just to end up alone.
          </p>
        </div>
      </section>
    </>
  );
}
