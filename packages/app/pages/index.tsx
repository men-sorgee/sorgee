import Head from 'next/head';
import React from 'react';
import { tw } from 'twind';
import styles from 'styles';
import Fire from '../components/icons/fire';

export default function HomePage() {
  const { h2page, h3section, pLg, sectionWhite, sectionDark } = styles;
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <section className={tw(sectionWhite)}>
        <div
          className={tw`flex flex-col items-center max-w-6xl mx-auto md:flex-row`}
        >
          <div className={tw` hidden md:block w-1/2 flex`}>
            <Fire />
          </div>
          <div className={tw`flex flex-col md:w-1/2 md:mt-0`}>
            <h2 className={tw(h2page)}>Too Hot for the Public</h2>
            <p className={tw`${pLg} !md:text-left`}>
              A hot new social club for bisexual and married men who value
              discretion. We facilitate discrete events, in safe environments to
              express, explore and discover.
            </p>
            <p className={tw`${pLg} italic !text-sm !text-left`}>
              (Accepting applications through invites only.)
            </p>
          </div>
        </div>
      </section>
      <section className={tw(sectionDark)}>
        <div className={tw`max-w-6xl mx-auto`}>
          <div className={tw`flex flex-col items-center md:flex-row `}>
            <div className={tw`w-full md:w-1/2 md:pr-8 mt-8`}>
              <h3 className={tw`${h3section}] `}>Want to experiment?</h3>
              <p className={tw`${pLg} !md:text-right`}>
                When send invites to our newsletter subscribers first. Learn
                more and get important updates and milestones as we build
                something brand new for men who have sex with men in Denver
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
          <h3 className={tw`${h3section} sm:w-1/2 !md:text-6xl mt-8`}>
            Men, <br />
            not Numbers
          </h3>
          <div className={tw` w-full md:w-1/2`}>
            <p className={tw`${pLg} !md:text-left`}>
              We use guests&apos; preferences to craft the events with
              compatible men to make things easy for you!
            </p>
            <p className={tw`${pLg} !md:text-left`}>
              All guests are pre-screened and vetted to weed-out weirdos, bots
              and scammers.
            </p>
          </div>
        </div>
      </section>
      <section className={tw(sectionDark)}>
        <div
          className={tw`flex flex-col items-start max-w-6xl mx-auto md:flex-row flex-col-reverse`}
        >
          <div className={tw`w-full md:w-1/2 `}>
            <p className={tw`${pLg}  `}>
              Tired of wasting your time staring at screens, searching through
              profile after profile, just to end up alone?
            </p>
            <p className={tw`${pLg}  !md:text-right`}>
              Tell what you like and let big data do the rest!
            </p>
          </div>
          <div className={tw`w-full md:w-1/2 !md:text-right`}>
            <svg
              className={tw`w-20 h-20 text-yellow-500 mx-none md:mx-auto`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              ></path>
            </svg>
            <h3 className={tw`${h3section}] !text-green`}>
              Now Testing in Denver
            </h3>
          </div>
        </div>
      </section>
    </>
  );
}
