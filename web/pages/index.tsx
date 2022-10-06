import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { tw } from 'twind';

export default function HomePage() {
  return (
    <>
      <Head>
        <title></title>
      </Head>
      <section className={tw`w-full py-16 mx-8`}>
        <div
          className={tw`mx-auto py-8 text-white max-w-6xl flex flex-col items-center md:justify-between md:flex-row`}
        >
          <h1></h1>
          <div
            className={tw`flex text-right flex-col justify-between items-stretch md:flex-row`}
          >
            <Link href="/apply">
              <a
                className={tw`block w-full px-8 py-5 mb-6 text-2xl bg-indigo-700 sm:mb-0 sm:w-auto hover:bg-indigo-600 rounded-xl`}
              >
                Apply to Join
              </a>
            </Link>

            <Link href="/learn">
              <a
                className={tw`block w-full px-8 py-5 text-2xl bg-gray-800 sm:w-auto sm:ml-4 hover:bg-gray-700 rounded-xl`}
              >
                Learn More
              </a>
            </Link>
          </div>
        </div>
        <div className={tw`w-full max-w-2xl mx-auto md:max-w-3xl lg:max-w-6xl`}>
          <img
            src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
            className={tw` w-full transform`}
          />
        </div>
      </section>
      <section
        className={tw`w-full px-8 pt-20 pb-16 bg-white text-black xl:px-0`}
      >
        <div
          className={tw`flex flex-col items-start max-w-6xl mx-auto md:flex-row`}
        >
          <h2
            className={tw`tracking-normal text-black md:pr-10 lg:pr-16 xl:pr-20 md:-mt-2 md:w-1/2`}
          >
            Men helping men
          </h2>
          <div className="flex flex-col w-full mt-8 space-y-5 md:w-1/2 md:space-y-10 md:mt-0">
            <p className={tw`text-gray-700 leading-8 md:text-xl`}>
              The Brotherhood Group is an organization for men who are looking
              for a place to belong and make friends. We are not a religious
              group or work-related, we simply seek to improve the health and
              happiness of underserved communities.
            </p>
            <p
              className={tw`text-base font-normal text-gray-700 lg:leading-8 xl:leading-9 md:text-xl`}
            >
              Our foundation provides free resources to our members via support
              groups, events, workshops and referrals to local health care
              providers.
            </p>
          </div>
        </div>
      </section>
      <section
        className={tw`w-full px-8 py-16 bg-gray-800 text-white xl:px-8 `}
      >
        <div className={tw`max-w-6xl mx-auto`}>
          <div className={tw`flex flex-col items-center md:flex-row`}>
            <div className="w-full space-y-5 md:w-3/5 md:pr-16">
              <p className={tw`font-medium text-blue-500 uppercase`}>
                Building Friendships
              </p>

              <p className={tw`text-xl md:pr-16`}>
                The purpose of our club is to foster the development of healthy
                relationships among men through friendly companionship in a
                relaxed atmosphere conducive to meeting people and socializing
                with others.
              </p>
            </div>
            <div className="w-full mt-16 md:mt-0 md:w-2/5">
              <div className={tw` h-auto p-8 py-10  px-7`}>
                <h3 className={tw`mb-6 text-2xl font-medium text-center`}>
                  Get Notified
                </h3>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={tw`block w-full px-4 py-3 mb-4 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none`}
                  placeholder="Email address"
                />

                <div className={tw`block`}>
                  <button
                    className={tw`w-full px-3 py-4 font-medium text-white bg-blue-500 rounded-lg`}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className={tw`w-full px-8 pt-20 pb-16 bg-white text-black xl:px-0`}
      >
        <div
          className={tw`flex flex-col items-start max-w-6xl mx-auto md:flex-row`}
        >
          <h2
            className={tw`tracking-normal text-black md:pr-10 lg:pr-16 xl:pr-20 md:leading-none md:-mt-2 md:w-1/2`}
          >
            Friends IRL
          </h2>
          <div className="flex flex-col w-full mt-8 space-y-5 md:w-1/2 md:space-y-10 md:mt-0">
            <p
              className={tw`col-span-6 text-base font-normal text-gray-700 lg:leading-8 xl:leading-8 md:text-xl`}
            >
              Do you feel like your social circle can be more inclusive?
              Brotherhood Group was created by a group of men who felt that
              there is value in every perspective, every person and every skill.
            </p>
            <p
              className={tw`col-span-6 text-base font-normal text-gray-700 lg:leading-8 xl:leading-9 md:text-xl`}
            >
              We provide an environment where men of all races, ethnicities,
              faiths and experiences can find healthy companionship.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
