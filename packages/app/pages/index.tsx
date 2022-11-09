import Head from 'next/head'
import Image from 'next/image'
import React, { FormEvent } from 'react';
import { tw } from 'twind';



export default function HomePage() {
  return (
    <>
      <Head>
        <title>Guys-N-Heat: Home</title>
      </Head>
      
      <section
        className={tw`w-full p-8 bg-white text-black`}
      >
        
        <div
          className={tw`flex flex-col items-center max-w-6xl mx-auto md:flex-row`}
        >
          <div className={tw`w-full space-y-5 md:w-1/2 md:pr-16 text-center`}>
          
            <Image src={'/logo.svg'} alt="logo" width={200} height={200} className={tw`p-2`} />
            
          </div>
          <div className={tw`flex flex-col md:w-1/2  md:mt-0`}>
            <h3
              className={tw`tracking-normal font-extrabold text-5xl m-1`}
            >
              Guys N Heat
            </h3>
            <p className={tw`text-black md:text-xl mb-2`}>
              Hot social events for bisexual and married men who value discretion.
              A discrete environment to express, explore and discover without the
              hassle of dating apps.
            </p>
          </div>
        </div>
      </section>
      <section
        className={tw`w-full p-8  bg-gray-800 text-white`}
      >
        <div className={tw`max-w-6xl mx-auto`}>
          <div className={tw`flex flex-col items-center md:flex-row`}>
            <div className={tw`w-full  md:w-1/2 `}>

              <p className={tw`text-xl md:pr-16`}>
                We use your stated preferences to craft
                events that maximize fun for everyone! 
              </p>
             
            </div>
            <div className={tw`w-full md:w-1/2`}>
              
              <form action="https://thebrotherhoodgroup.us13.list-manage.com/subscribe/post?u=402ed825f5ff12c2a4e3e8b94&amp;id=05b4cabc8b&amp;f_id=009608e3f0" 
                method="post" target="_blank">
                  
                <h3 className={tw`mb-6 text-2xl font-medium text-center`}>
                  Learn More
                </h3>
                <input
                  type="text"
                  name="FNAME"
                  id="FNAME"
                  className={tw`block text-black w-full px-4 py-3 mb-4 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none`}
                  placeholder="Name"
                  required
                  autoComplete='first-name'
                />
                <input
                  type="email"
                  name="EMAIL"
                  id="EMAIL"
                  className={tw`block text-black w-full px-4 py-3 mb-4 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none`}
                  placeholder="Email address"
                  required
                  autoComplete='email'
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
      <section
        className={tw`w-full p-8  bg-white text-black`}
      >
        <div
          className={tw`flex flex-col items-start max-w-6xl mx-auto md:flex-row`}
        >
          <h3
            className={tw`tracking-normal font-extrabold text-5xl md:hidden md:w-1/2`}
          >
            Men,<br/> not<br/> Numbers
          </h3>
          <h3
            className={tw`tracking-normal font-extrabold text-5xl hidden md:block  md:w-1/2`}
          >
            Men, not Numbers
          </h3>
          <div className={tw`flex flex-col w-full mt-8 space-y-5 md:w-1/2 md:space-y-10 md:mt-0`}>
            <p
              className={tw`col-span-6 text-base font-normal text-gray-700 lg:leading-8 xl:leading-9 md:text-xl`}
            >
              Hookups suck! Don&rsquo;t waste time staring at screens, searching through profile after profile. 
              Our events are designed to maximize your fun! 
             
            </p>
          </div>
        </div>
      </section>
            
    </>
  );
}
