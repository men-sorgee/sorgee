import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './navbar';
import Footer from '@/components/ui/Footer';
import { ReactNode } from 'react';
import { PageMeta } from 'lib/types';
import constants from 'lib/constants';
import { tw, css, apply } from 'twind/css';
import React from 'react';

const styles = css({
  '&::before': { boxSizing: 'inherit' },
  '&::after': { boxSizing: 'inherit' },
  '*:focus': apply`outline-none ring-2 ring-pink-500 ring-opacity-50`,
  html: {
    touchAction: 'manipulation',
    fontFeatureSettings: `'case' 1, 'rlig' 1, 'calt' 0'`
  },
  body: {
    textRendering: 'optimizeLegibility',
    MozOsxFontSmoothing: 'grayscale',
    '@apply':
      'text-base min-h-full m-0 relative text-white bg-gray-500 antialiased'
  },
  p: {
    WebkitTapHighlightColor: 'black',
    '@apply': `mt-5 text-xl text-gray-200 sm:text-center sm:text-2xl max-w-2xl m-auto`
  },
  h1: {
    '@apply': `text-4xl font-extrabold text-white sm:text-center sm:text-6xl`
  }
});

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
      <Navbar />
      <div className={tw(styles)}>
        <main id="skip" className={tw`min-h-full`}>
          <section className={tw`bg-black mb-32`}>
            <div
              className={tw`max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8`}
            >
              <div className={tw`sm:flex sm:flex-col sm:text-center`}>
                {children}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
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
