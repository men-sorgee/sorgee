import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Navbar from './NavBar';
import Footer from './Footer';
import { ReactNode } from 'react';
import getConfig from 'next/config';
import { tw, css, apply, Context } from 'twind/css';
import React from 'react';
import Link from 'next/link';
import Logo from '../ui/Logo';
import Meta, { MetaProps } from './Meta';

interface Props {
  children: ReactNode | ReactNode[];
  meta?: MetaProps;
}
const { publicRuntimeConfig } = getConfig();

export default function Layout({ children, meta: pageMeta }: Props) {
  const router = useRouter();

  const meta: MetaProps = {
    title: publicRuntimeConfig.title,
    description: publicRuntimeConfig.description,
    basePath: router.basePath,
    url: `${router.basePath}${router.asPath}`,
    ...pageMeta
  };

  return (
    <>
      <Meta props={meta} />
      <Script
        defer
        type="text/javascript"
        src="https://app.termly.io/embed.min.js"
        data-auto-block="on"
        data-website-uuid="8fbb3f3c-9fc6-4256-ad1f-7c061dabb965"
      />
      <div className={tw`max-w-6xl mx-auto p-4`}>
        <main id="skip" className={tw`min-h-full bg-black`}>
          <Navbar />
          <article className={tw`sm:flex sm:flex-col sm:text-center`}>
            {children}
          </article>
        </main>
        <Footer />
      </div>
      <Script
        defer
        src="https://chimpstatic.com/mcjs-connected/js/users/402ed825f5ff12c2a4e3e8b94/da473e2309b4600081fba1614.js"
      />

      <Script src="https://unpkg.com/flowbite@1.5.4/dist/flowbite.js" />
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
