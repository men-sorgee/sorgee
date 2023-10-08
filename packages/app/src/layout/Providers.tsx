'use client'

import {
  AlertsProvider,
  MessagesProvider,
  MetaContextProvider,
  NotificationsProvider,
  UserProvider
} from "hooks";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

import { SWRProvider } from "../hooks/use-swr";

export type ProviderProps = {
  children: React.ReactNode
  session: Session
}

export default function Providers({ children, session }: ProviderProps) {

  return (
    <SWRProvider>
      <MetaContextProvider>
        <SessionProvider session={session}>
          <UserProvider>
            <NotificationsProvider>
              <AlertsProvider>
                <MessagesProvider>
                  {children}
                </MessagesProvider>
              </AlertsProvider>
            </NotificationsProvider>
          </UserProvider>
        </SessionProvider>
      </MetaContextProvider>
    </SWRProvider >


  )
}


