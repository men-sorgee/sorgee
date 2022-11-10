import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script'
import Navbar from './navbar';
//import Footer from './footer';
import { ReactNode } from 'react';
import { PageMeta } from 'lib/types';
import constants from 'lib/constants';
import { tw, css, apply, Context } from 'twind/css';
import React from 'react';
import Link from 'next/link'
import Logo from '../icons/Logo'


interface Props {
  children: ReactNode | ReactNode[];
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();

  const meta = {
    title: constants.title,
    description: constants.description,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
        <meta property="og:url" content={meta.url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        {meta.cardImage && (
          <meta property="og:image" content={meta.cardImage} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={meta.basePath} />
        <meta property="twitter:url" content={meta.url} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        {meta.cardImage && (
          <meta name="twitter:image" content={meta.cardImage} />
        )}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="theme-color" content="#000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      
      <div> 
        <main id="skip" className={tw`min-h-full bg-black`}>
          
          <div
            className={tw`max-w-6xl mx-auto p-4`}
          >
            <Navbar/>
            <article className={tw`sm:flex sm:flex-col sm:text-center`}>
              {children}
            </article>
          </div>
        </main>
        <Script defer src="https://chimpstatic.com/mcjs-connected/js/users/402ed825f5ff12c2a4e3e8b94/da473e2309b4600081fba1614.js"/>
      </div>
     
    </>
  );
}

//  import { useState, ReactNode } from 'react';
//  import Sidebar from './sidebar';
//  import Navbar from './navbar'; 
//  import Directory from './directory';
//  import { ResultProps } from '@/lib/api/user';
//  import Toast from '@/components/layout/toast';
//  import Meta, { MetaProps } from '@/components/layout/meta';
//  import { useRouter } from 'next/router';
//  import { LoadingDots } from '@/components/icons';
//  
//  export default function Layout({
//    meta,
//    results,
//    totalUsers,
//    username,
//    children
//  }: {
//    meta: MetaProps;
//    results: ResultProps[];
//    totalUsers: number;
//    username?: string;
//    children: ReactNode;
//  }) {
//    const router = useRouter();
//  
//    const [sidebarOpen, setSidebarOpen] = useState(false);
//  
//    if (router.isFallback) {
//      return (
//        <div className="h-screen w-screen flex justify-center items-center bg-black">
//          <LoadingDots color="white" />
//        </div>
//      );
//    }
//  
//    
//  
//    return (
//      
//      <div className="w-full mx-auto h-screen flex overflow-hidden bg-black">
//        <Navbar  />
//        <Meta props={meta} />
//        <Toast username={username} />
//        <Sidebar
//          sidebarOpen={sidebarOpen}
//          setSidebarOpen={setSidebarOpen}
//          results={results}
//          totalUsers={totalUsers}
//        />
//  
//        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
//          <div className="flex-1 relative z-0 flex overflow-hidden">
//            <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
//              {children}
//            </main>
//            <div className="hidden md:order-first h-screen md:flex md:flex-col">
//              <Directory results={results} totalUsers={totalUsers} />
//            </div>
//          </div>
//        </div>
//      </div>
//    );
//  }
//  
