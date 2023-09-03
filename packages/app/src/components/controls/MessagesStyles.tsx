'use client'
import { brand } from "lib/config/brand";

import { useColorModeValue } from "@chakra-ui/react";

import { useDeviceDetect } from "../../hooks";

export default function MessagesStyles() {
  const { isIos } = useDeviceDetect()
  const bg = useColorModeValue('white', brand.colors.gray[500])
  const color = useColorModeValue(brand.colors.gray[800], 'white')
  const colorInverse = useColorModeValue('white', brand.colors.gray[800])
  const borderColor = useColorModeValue(brand.colors.gray[200], brand.colors.gray[300])
  const primary = useColorModeValue(brand.colors.primary[400], brand.colors.primary[400])
  const secondary = useColorModeValue(brand.colors.secondary[400], brand.colors.secondary[400])
  const accent = useColorModeValue(brand.colors.accent[400], brand.colors.accent[400])
  const gray = useColorModeValue(brand.colors.gray[400], brand.colors.gray[400])



  return (
    <style>
      {`
      body {
        background-color: ${bg};
      }
      .cs-main-container {
        position: relative;
        display: flex;
        bottom: 0;
        
        flex-direction: row;
        height: 80dvh;
        height: 80vh;
        overflow: auto;
        box-sizing: border-box;
        color: ${color};
        background-color: transparent;
        font-size: 1rem;
      }
      .cs-main-container > .cs-conversation-list {
        order: 0;
        height: 100%;
        flex-basis: 300px;
        border-top: solid 0px ${borderColor};
        border-right: solid 1px ${borderColor};
        border-bottom: solid 0px ${borderColor};
        border-left: solid 0px ${borderColor};
        /* Hmm without this, box shadow is cut at bottom */
        
        background-color: ${bg};
      }
      .cs-main-container > .cs-sidebar.cs-sidebar--left {
        order: 0;
        height: 100%;
        max-width: 320px;
        flex-basis: 35%;
        border-right: solid 1px ${borderColor};
        /* Hmm without this, box shadow is cut at bottom */
       
      }
      .cs-main-container > .cs-sidebar.cs-sidebar--right {
        flex-basis: 25%;
        min-width: 150px;
        max-width: 320px;
        border-top: solid 0px ${borderColor};
        border-right: solid 0px ${borderColor};
        border-bottom: solid 0px ${borderColor};
        border-left: solid 1px ${borderColor};
      }
      .cs-main-container > .cs-sidebar.cs-sidebar--left .cs-search {
        margin: 0.5em;
      }
      .cs-main-container .cs-chat-container {
        order: 1;
       
        flex-grow: 1;
        flex-basis: 65%;
        border-right: solid 0px ${borderColor};
      }
      .cs-main-container .cs-sidebar {
        order: 2;
        height: 100%;
        
        
      }
      .cs-main-container .cs-sidebar .cs-expansion-panel {
        border-left: 0;
        border-top: 0;
        border-right: 0;
      }
      .cs-main-container .cs-sidebar .cs-expansion-panel:nth-last-child(3) {
        border-bottom: 0;
      }
      .cs-main-container .cs-conversation-header {
        
      }
      .cs-main-container--responsive .cs-chat-container .cs-conversation-header .cs-conversation-header__back {
        display: none;
      }
      .cs-main-container--responsive .cs-chat-container .cs-conversation-header .cs-conversation-header__actions .cs-button--info {
        display: none;
      }
      .cs-main-container--responsive .cs-conversation-list .cs-conversation__content,
      .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__content,
      .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__last-activity-time {
        display: inherit;
      }
      @media (max-width: 768px) {
        .cs-main-container--responsive {
          height: 75dvh;
          height: 75vh;);
        }
        .cs-main-container--responsive .cs-search {
          display: none;
        }
        .cs-main-container--responsive > .cs-sidebar.cs-sidebar--left {
          flex-basis: calc(1.6em + 40px);
          min-width: calc(1.6em + 40px);
        }
        .cs-main-container--responsive > .cs-sidebar.cs-sidebar--right {
          display: none;
        }
        .cs-main-container--responsive > .cs-conversation-list {
          flex-basis: calc(1.6em + 40px);
          display:none;
        }
        .cs-main-container--responsive .cs-conversation-list .cs-conversation > .cs-avatar,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation > .cs-avatar {
          margin-right: 0;
          
        }
        .cs-main-container--responsive .cs-conversation-list .cs-conversation__content,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__content,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__last-activity-time {
          display: inherit;
        }
        .cs-main-container--responsive .cs-conversation-list .cs-conversation__operations,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__operations {
           display: none;
        }
        .cs-main-container--responsive .cs-conversation-list .cs-conversation__last-activity-time,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__last-activity-time {
            display: none;
        }
        .cs-main-container--responsive .cs-conversation-list .cs-conversation__unread-dot,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__unread-dot {
          position: absolute;
          top: 0.3em;
          right: 0.3em;
          margin-right: 0;
        }
        .cs-main-container--responsive .cs-conversation-header .cs-conversation-header__actions .cs-button--info {
          display: flex;
        }
      }
      @media (max-width: 576px) {
        .cs-main-container--responsive {
          min-width: auto;
          height: 70dvh;
          height: 70vh;
        }
        .cs-main-container--responsive > .cs-sidebar.cs-sidebar--left {
          display: none;
        }
        .cs-main-container--responsive .cs-chat-container .cs-conversation-header .cs-conversation-header__back {
          display: flex;
        }
        .cs-main-container--responsive .cs-conversation-list .cs-conversation__content,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__content,
        .cs-main-container--responsive .cs-sidebar .cs-conversation-list .cs-conversation__last-activity-time {
          display: inherit;
        }
      }

      .cs-message {
        box-sizing: border-box;
        font-size: 1em;
        color: ${color};
        display: flex;
        flex-direction: row;
        padding: 0;
        background-color: transparent;
        overflow: hidden;
        border-radius: 0;
      }
      .cs-message:only-child {
        margin: 0.2em 0 0 0;
      }
      .cs-message:not(:only-child) {
        margin: 0.2em 0 0 0;
      }
      .cs-message__avatar {
        box-sizing: border-box;
        margin: 0 8px 0 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        width: 42px;
      }
      .cs-message__content-wrapper {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .cs-message__header {
        box-sizing: border-box;
        color: ${gray};
        background-color: transparent;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        font-size: 0.8em;
        margin: 0 0.2em 0.1em 0.2em;
      }
      .cs-message__header .cs-message__sender-name {
        box-sizing: border-box;
        color: ${gray};
        background-color: transparent;
      }
      .cs-message__header .cs-message__sent-time {
        box-sizing: border-box;
        color: ${gray};
        background-color: transparent;
        margin-left: auto;
        padding-left: 0.8em;
      }
      .cs-message__footer {
        box-sizing: border-box;
        color: ${gray};
        background-color: transparent;
        display: flex;
        font-size: 0.8em;
        margin: 0.1em 0.2em 0 0.2em;
      }
      .cs-message__footer .cs-message__sender-name {
        box-sizing: border-box;
        color: ${gray};
        background-color: transparent;
      }
      .cs-message__footer .cs-message__sent-time {
        box-sizing: border-box;
        color: ${color};
        background-color: transparent;
        margin-left: auto;
        padding-left: 0.8em;
      }
      .cs-message__content {
        box-sizing: border-box;
        color: white;
        background-color: ${primary};
        margin-top: 0;
        padding: 0.6em 0.9em;
        border-radius: 0.7em 0.7em 0.7em 0.7em;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        word-break: break-word;
        font-weight: normal;
        font-size: 0.91em;
        font-variant: normal;
      }
      .cs-message--incoming {
        color: ${color};
        background-color: transparent;
        margin-right: auto;
      }
      .cs-message--incoming .cs-message__avatar {
        margin: 0 8px 0 0;
      }
      .cs-message--incoming .cs-message__sender-name {
        display: none;
      }
      .cs-message--incoming .cs-message__sent-time {
        display: none;
      }
      .cs-message--incoming .cs-message__content {
        color: white;
        background-color: ${accent};
        border-radius: 0 0.7em 0.7em 0;
      }
      .cs-message--outgoing {
        color: ${color};
        background-color: transparent;
        margin-left: auto;
        justify-content: flex-end;
      }
      .cs-message--outgoing .cs-message__avatar {
        order: 1;
        margin: 0 0 0 8px;
      }
      .cs-message--outgoing .cs-message__sender-name {
        display: none;
      }
      .cs-message--outgoing .cs-message__sent-time {
        display: none;
      }
      .cs-message--outgoing .cs-message__content {
        color: white;
        background-color: ${secondary};
        border-radius: 0.7em 0 0 0.7em;
      }
      .cs-message.cs-message--incoming.cs-message--single {
        border-radius: 0;
      }
      .cs-message.cs-message--incoming.cs-message--single:not(:first-child) {
        margin-top: 0.4em;
      }
      .cs-message.cs-message--incoming.cs-message--single .cs-message__sender-name {
        display: block;
      }
      .cs-message.cs-message--incoming.cs-message--single .cs-message__sent-time {
        display: block;
      }
      .cs-message.cs-message--incoming.cs-message--single .cs-message__content {
        border-radius: 0 0.7em 0.7em 0.7em;
      }
      .cs-message.cs-message--incoming.cs-message--first {
        border-radius: 0 0 0 0;
      }
      .cs-message.cs-message--incoming.cs-message--first:not(:first-child) {
        margin-top: 0.4em;
      }
      .cs-message.cs-message--incoming.cs-message--first .cs-message__sender-name {
        display: block;
      }
      .cs-message.cs-message--incoming.cs-message--first .cs-message__sent-time {
        display: block;
      }
      .cs-message.cs-message--incoming.cs-message--first .cs-message__content {
        border-radius: 0 0.7em 0.7em 0;
        background-color: ${primary};
      }
      .cs-message.cs-message--incoming.cs-message--last {
        border-radius: 0 0 0 0;
      }
      .cs-message.cs-message--incoming.cs-message--last .cs-message__sent-time {
        display: none;
      }
      .cs-message.cs-message--incoming.cs-message--last .cs-message__content {
        border-radius: 0 0.7em 0 0.7em;
      }
      .cs-message.cs-message--outgoing.cs-message--single {
        border-radius: 0;
      }
      .cs-message.cs-message--outgoing.cs-message--single:not(:first-child) {
        margin-top: 0.4em;
      }
      .cs-message.cs-message--outgoing.cs-message--single .cs-message__sent-time {
        display: block;
      }
      .cs-message.cs-message--outgoing.cs-message--single .cs-message__content {
        border-radius: 0.7em 0.7em 0 0.7em;
      }
      .cs-message.cs-message--outgoing.cs-message--first {
        border-radius: 0 0 0 0;
        margin-top: 0.4em;
      }
      .cs-message.cs-message--outgoing.cs-message--first .cs-message__sent-time {
        display: block;
      }
      .cs-message.cs-message--outgoing.cs-message--first .cs-message__content {
        border-radius: 0.7em 0 0 0.7em;
        background-color: ${primary};
      }
      .cs-message.cs-message--outgoing.cs-message--last {
        border-radius: 0 0 0 0;
      }
      .cs-message.cs-message--outgoing.cs-message--last .cs-message__sent-time {
        display: none;
      }
      .cs-message.cs-message--outgoing.cs-message--last .cs-message__content {
        border-radius: 0.7em 0 0.7em 0.7em;
      }
      .cs-message--incoming.cs-message--avatar-spacer {
        margin-left: 50px;
      }
      .cs-message--outgoing.cs-message--avatar-spacer {
        margin-right: 50px;
      }
      .cs-message--avatar-tl .cs-message__avatar {
        justify-content: flex-start;
        order: 0;
        margin-right: 8px;
        margin-left: 0;
      }
      .cs-message--avatar-tl .cs-message__message-wrapper {
        order: 1;
      }
      .cs-message--avatar-tr .cs-message__avatar {
        justify-content: flex-start;
        order: 1;
        margin-left: 8px;
        margin-right: 0;
      }
      .cs-message--avatar-tr .cs-message__message-wrapper {
        order: 0;
      }
      .cs-message--avatar-br .cs-message__avatar {
        justify-content: flex-end;
        order: 1;
        margin-left: 8px;
        margin-right: 0;
      }
      .cs-message--avatar-br .cs-message__message-wrapper {
        order: 0;
      }
      .cs-message--avatar-bl .cs-message__avatar {
        justify-content: flex-end;
        order: 0;
        margin-right: 8px;
        margin-left: 0;
      }
      .cs-message--avatar-bl .cs-message__message-wrapper {
        order: 1;
      }
      .cs-message--avatar-cl .cs-message__avatar {
        justify-content: center;
        order: 0;
        margin-right: 8px;
        margin-left: 0;
      }
      .cs-message--avatar-cl .cs-message__message-wrapper {
        order: 1;
      }
      .cs-message--avatar-cr .cs-message__avatar {
        justify-content: center;
        order: 1;
        margin-left: 8px;
        margin-right: 0;
      }
      .cs-message--avatar-cr .cs-message__message-wrapper {
        order: 0;
      }


      .cs-message-group {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        margin: 0.4em 0 0 0;
      }
      .cs-message-group__avatar {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      .cs-message-group__content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .cs-message-group__header {
        box-sizing: border-box;
        display: flex;
        font-size: 0.8em;
        color: ${color};
        background-color: transparent;
        margin: 0 0 0.2em 0;
        padding: 0;
      }
      .cs-message-group__footer {
        box-sizing: border-box;
        display: flex;
        font-size: 0.8em;
        color: ${color};
        background-color: transparent;
        margin: 0.2em 0 0 0;
        padding: 0;
      }
      .cs-message-group__messages {
        box-sizing: border-box;
      }
      .cs-message-group__messages .cs-message:first-child {
        margin-top: 0;
      }
      .cs-message-group__messages .cs-message .cs-message__content {
        background-color: ${primary};
        margin-top: 0;
      }
      .cs-message-group--incoming {
        justify-content: flex-start;
      }
      .cs-message-group--incoming .cs-message-group__avatar {
        margin-right: 8px;
        order: 0;
      }
      .cs-message-group--incoming .cs-message-group__content {
        order: 1;
      }
      .cs-message-group--incoming .cs-message-group__messages .cs-message:first-child .cs-message__content {
        border-radius: 0 0.7em 0.7em 0;
      }
      .cs-message-group--incoming .cs-message-group__messages .cs-message .cs-message__content {
        border-radius: 0 0.7em 0.7em 0;
        color: white;
        background-color: ${primary};
      }
      .cs-message-group--incoming .cs-message-group__messages .cs-message:last-child .cs-message__content {
        border-radius: 0 0.7em 0 0.7em;
      }
      .cs-message-group--incoming .cs-message-group__messages .cs-message:only-child .cs-message__content {
        border-radius: 0 0.7em 0.7em 0.7em;
      }
      .cs-message-group--outgoing {
        justify-content: flex-end;
        margin-left: auto;
      }
      .cs-message-group--outgoing .cs-message-group__avatar {
        margin-left: 8px;
        order: 1;
      }
      .cs-message-group--outgoing .cs-message-group__content {
        order: 0;
      }
      .cs-message-group--outgoing .cs-message-group__messages .cs-message {
        justify-content: flex-end;
      }
      .cs-message-group--outgoing .cs-message-group__messages .cs-message:first-child .cs-message__content {
        border-radius: 0.7em 0 0 0.7em;
      }
      .cs-message-group--outgoing .cs-message-group__messages .cs-message .cs-message__content {
        border-radius: 0.7em 0 0 0.7em;
        color: white;
        background-color: ${secondary};
      }
      .cs-message-group--outgoing .cs-message-group__messages .cs-message:last-child .cs-message__content {
        border-radius: 0.7em 0 0.7em 0.7em;
      }
      .cs-message-group--outgoing .cs-message-group__messages .cs-message:only-child .cs-message__content {
        border-radius: 0.7em 0.7em 0 0.7em;
      }
      .cs-message-group--avatar-tl .cs-message-group__avatar {
        justify-content: flex-start;
        order: 0;
        margin-right: 8px;
        margin-left: 0;
      }
      .cs-message-group--avatar-tl .cs-message-group__content {
        order: 1;
      }
      .cs-message-group--avatar-tr .cs-message-group__avatar {
        justify-content: flex-start;
        order: 1;
        margin-left: 8px;
        margin-right: 0;
      }
      .cs-message-group--avatar-tr .cs-message-group__content {
        order: 0;
      }
      .cs-message-group--avatar-bl .cs-message-group__avatar {
        justify-content: flex-end;
        order: 0;
        margin-right: 8px;
        margin-left: 0;
      }
      .cs-message-group--avatar-bl .cs-message-group__content {
        order: 1;
      }
      .cs-message-group--avatar-br .cs-message-group__avatar {
        justify-content: flex-end;
        order: 1;
        margin-left: 8px;
        margin-right: 0;
      }
      .cs-message-group--avatar-br .cs-message-group__content {
        order: 0;
      }
      .cs-message-group--avatar-cl .cs-message-group__avatar {
        justify-content: center;
        order: 0;
        margin-right: 8px;
        margin-left: 0;
      }
      .cs-message-group--avatar-cl .cs-message-group__content {
        order: 1;
      }
      .cs-message-group--avatar-cr .cs-message-group__avatar {
        justify-content: center;
        order: 1;
        margin-left: 8px;
        margin-right: 0;
      }
      .cs-message-group--avatar-cr .cs-message-group__content {
        order: 0;
      }

      .cs-message-separator {
        box-sizing: border-box;
        color: ${borderColor};
        background-color: ${borderColor};
        font-size: 0.8em;
        text-align: center;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
      }
      .cs-message-separator::before, .cs-message-separator::after {
        box-sizing: border-box;
        content: "";
        background-color: ${borderColor};
        display: block;
        flex-grow: 1;
        height: 1px;
      }
      .cs-message-separator:not(:empty)::before {
        margin: 0 1em 0 0;
      }
      .cs-message-separator:not(:empty)::after {
        margin: 0 0 0 1em;
      }

      .cs-message-list {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow: hidden;
        min-height: 1.25em;
        position: relative;
        color: ${color};
        background-color: ${bg};
      }
      .cs-message-list__scroll-wrapper {
        -webkit-overflow-scrolling: touch;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0 1.2em 0 0.8em;
      }
      .cs-message-list__scroll-to:first-child {
        box-sizing: border-box;
        float: left;
        clear: both;
        height: 0;
      }
      .cs-message-list__scroll-wrapper > .cs-message:nth-last-child(4) {
        margin-bottom: 2.65em;
      }
      .cs-message-list__scroll-wrapper > .cs-message-group:nth-last-child(4) {
        margin-bottom: 2.65em;
      }
      .cs-message-list .cs-typing-indicator {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 15px;
        background-color: ${bg};
        padding: 0.5em 0.5em;
        font-size: 0.9em;
        height: 1.25em;
        line-height: 1.25em;
      }
      .cs-message-list__scroll-wrapper > .cs-message, .cs-message-list__scroll-wrapper > .cs-message-group {
        max-width: 85%;
      }
      .cs-message-list .cs-message.cs-message--incoming, .cs-message-list .cs-message-group.cs-message-group--incoming {
        margin-right: auto;
      }
      .cs-message-list .cs-message.cs-message--outgoing, .cs-message-list .cs-message-group.cs-message-group--outgoing {
        margin-left: auto;
      }
      .cs-message-list .cs-message-separator:not(:first-child) {
        margin-top: 1.2em;
      }
      .cs-message-list__loading-more {
        box-sizing: content-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        background-color: ${bg};
        padding: 2px 0;
        top: 0;
        left: 0;
        right: 0;
        height: 1.2em;
       
      }
      .cs-message-list__loading-more .cs-loader {
        width: 1.2em;
        height: 1.2em;
      }
      .cs-message-list__loading-more .cs-loader::before,
      .cs-message-list__loading-more .cs-loader::after {
        width: 100%;
        height: 100%;
      }
      .cs-message-list__loading-more--bottom {
        top: initial;
        bottom: 0;
      }
      .cs-message-list .ps__rail-y {
    
      }

      .cs-avatar {
        position: relative;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        box-sizing: border-box;
      }
      .cs-avatar > img {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .cs-avatar:hover > img {
        filter: brightness(115%);
      }
      .cs-avatar.cs-avatar--xs {
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
      }
      .cs-avatar.cs-avatar--sm {
        width: 26px;
        height: 26px;
        min-width: 26px;
        min-height: 26px;
      }
      .cs-avatar.cs-avatar--md {
        width: 42px;
        height: 42px;
        min-width: 42px;
        min-height: 42px;
      }
      .cs-avatar.cs-avatar--lg {
        width: 68px;
        height: 68px;
        min-width: 68px;
        min-height: 68px;
      }
      .cs-avatar.cs-avatar--fluid {
        width: 100%;
        height: 100%;
      }
      .cs-avatar.cs-avatar--fluid .cs-status {
        right: 5%;
        width: 22%;
        height: 22%;
      }
      .cs-avatar .cs-status {
        box-sizing: border-box;
        position: absolute;
        right: -1px;
        bottom: 3%;
      }
      .cs-avatar .cs-status__bullet {
        box-sizing: content-box;
        border: solid 2px ${bg};
      }
      .cs-avatar .cs-status--xs, .cs-avatar .cs-status--xs:not(.cs-status--named) {
        font-size: 1em;
        width: 6px;
        height: 6px;
        right: 0;
        bottom: 0;
      }
      .cs-avatar .cs-status--xs .cs-status__bullet, .cs-avatar .cs-status--xs:not(.cs-status--named) .cs-status__bullet {
        width: 4px;
        min-width: 4px;
        height: 4px;
      }
      .cs-avatar .cs-status--sm, .cs-avatar .cs-status--sm:not(.cs-status--named) {
        font-size: 1em;
        width: 12px;
        height: 12px;
        right: -3px;
        bottom: -1px;
      }
      .cs-avatar .cs-status--sm .cs-status__bullet, .cs-avatar .cs-status--sm:not(.cs-status--named) .cs-status__bullet {
        width: 8px;
        min-width: 8px;
        height: 8px;
      }
      .cs-avatar .cs-status--md, .cs-avatar .cs-status--md:not(.cs-status--named) {
        font-size: 1em;
        width: 15px;
        height: 15px;
      }
      .cs-avatar .cs-status--md .cs-status__bullet, .cs-avatar .cs-status--md:not(.cs-status--named) .cs-status__bullet {
        width: 11px;
        min-width: 11px;
        height: 11px;
      }
      .cs-avatar .cs-status--lg, .cs-avatar .cs-status--lg:not(.cs-status--named) {
        font-size: 1em;
        width: 18px;
        height: 18px;
        bottom: 4%;
      }
      .cs-avatar .cs-status--lg .cs-status__bullet, .cs-avatar .cs-status--lg:not(.cs-status--named) .cs-status__bullet {
        width: 14px;
        min-width: 14px;
        height: 14px;
      }
      .cs-avatar-group {
        display: flex;
        flex-direction: row-reverse;
        overflow: visible;
        position: relative;
        flex-wrap: wrap;
        box-sizing: border-box;
        min-width: 40px;
        align-content: flex-start;
        justify-content: flex-end;
      }
      .cs-avatar-group .cs-avatar--active {
     
      }
      .cs-avatar-group .cs-avatar--active-on-hover:hover {
        
      }
      .cs-avatar-group--xs {
        padding-left: 6.112px;
        padding-top: 6.112px;
      }
      .cs-avatar-group--xs .cs-avatar {
        margin-top: -6.112px;
        margin-left: -6.112px;
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        border: none;
        border-right: 1px solid ${borderColor};
      }
      .cs-avatar-group--sm {
        padding-left: 9.932px;
        padding-top: 9.932px;
      }
      .cs-avatar-group--sm .cs-avatar {
        margin-top: -9.932px;
        margin-left: -9.932px;
        width: 26px;
        height: 26px;
        min-width: 26px;
        min-height: 26px;
      }
      .cs-avatar-group--md {
        padding-left: 16.044px;
        padding-top: 16.044px;
      }
      .cs-avatar-group--md .cs-avatar {
        margin-top: -16.044px;
        margin-left: -16.044px;
        width: 42px;
        height: 42px;
        min-width: 42px;
        min-height: 42px;
        border: 2px solid ${borderColor};
      }
      .cs-avatar-group--lg {
        padding-left: 25.976px;
        padding-top: 25.976px;
      }
      .cs-avatar-group--lg .cs-avatar {
        margin-top: -25.976px;
        margin-left: -25.976px;
        width: 68px;
        height: 68px;
        min-width: 68px;
        min-height: 68px;
        border: 2px solid ${borderColor};
      }

      .cs-message-input {
        bottom: 20px;
        position: static;
        display: block;
        display: flex;
        flex-direction: row;
        background-color: ${secondary};
        border-top: none;
        border-right: none;
        border-bottom: none;
        border-left: none;
        box-sizing: border-box;
        padding: 0;
        overflow: visible;
        flex-shrink: 0;
      }
      .cs-message-input__content-editor-wrapper {
        box-sizing: border-box;
        position: relative;
        background-color: ${secondary};
        margin: 0;
        padding: 0.6em 0.9em;
        border-radius: 0.7em;
        flex-grow: 1;
      }
      .cs-message-input--disabled .cs-message-input__content-editor-wrapper {
        background-color: ${secondary};
        color: white;
      }
      .cs-message-input__content-editor-container {
        box-sizing: border-box;
        position: relative;
        background-color: ${secondary};
        display: flex;
        flex-direction: column;
        align-items: stretch;
        overflow: hidden;
        overflow-y: auto;
        font-size: 0.94em;
        line-height: 1.35em;
        min-height: 1.35em;
        max-height: 5.4em;
        padding: 0em 0em 0em 0em;
        scroll-padding: 0em;
      }
      .cs-message-input--disabled .cs-message-input__content-editor-container {
        color: ${gray};
        background-color: transparent;
      }
      .cs-message-input__content-editor {
        box-sizing: border-box;
        flex-grow: 1;
        background-color: ${secondary};
        outline: 0;
        border-top: 0 none;
        border-right: 0 none;
        border-bottom: 0 none;
        border-left: 0 none;
        overflow: visible;
        color: white;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
      .cs-message-input--disabled .cs-message-input__content-editor {
        background-color: transparent;
        color: ${gray};
      }
      .cs-message-input__content-editor[data-placeholder]:empty:before {
        box-sizing: border-box;
        content: attr(data-placeholder);
        color: white;
        display: block;
        cursor: text;
      }
      .cs-message-input__tools {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
      }
      .cs-message-input__tools .cs-button {
        font-size: 1.2em;
        margin-top: 0;
        margin-bottom: 0;
      }
      .cs-message-input__tools .cs-button--send {
        align-self: flex-end;
      }
      .cs-message-input__tools .cs-button--attachment {
        align-self: flex-end;
      }
      .cs-message-input__tools:first-child .cs-button:first-child {
        margin-left: 0;
      }
      .cs-message-input__tools:first-child .cs-button:last-child {
        margin-right: 0;
      }
      .cs-message-input__tools:last-child .cs-button:first-child {
        margin-left: 0;
      }
      .cs-message-input__tools:last-child .cs-button:last-child {
        margin-right: 0;
      }

      .cs-input-toolbox {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        margin: 0;
        padding: 0 0 0.4em 0;
      }
      .cs-input-toolbox .cs-button {
        margin: 0;
        padding: 0;
        background: none;
        border: none;
        margin: 0 0.5em 0 0;
        font-size: 1.2em;
      }

      .cs-chat-container {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background-color: 'black';
        min-width: 180px;
        color: ${color};
        background-color: ${bg};
      }
      .cs-chat-container .cs-message-input {
        border-top: solid 0px ${borderColor};
        border-right: solid 0px ${borderColor};
        border-bottom: solid 0px ${borderColor};
        border-left: solid 0px ${borderColor};
        margin-top: auto;
        padding: 0.3em 0 0.3em 0em;
        color: ${color};
        background-color: ${bg};
      }
      .cs-chat-container .cs-message-input .cs-message-input__content-editor-wrapper:first-child {
        margin-left: 0.8em;
      }
      .cs-chat-container .cs-message-input .cs-message-input__content-editor-wrapper:last-child {
        margin-right: 0.8em;
      }
      .cs-chat-container .cs-input-toolbox {
        margin: 0;
        padding: 0 0.8em 0.17em 0;
        color: ${color};
        background-color: ${bg};
      }

      .cs-typing-indicator {
        box-sizing: content-box;
        font-size: inherit;
        display: flex;
        flex-direction: row;
        align-items: stretch;
      }
      .cs-typing-indicator__indicator {
        box-sizing: inherit;
        background-color: transparent;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .cs-typing-indicator__dot {
        box-sizing: inherit;
        animation: cs-typing-indicator__typing-animation 1.5s infinite ease-in-out;
        border-radius: 100%;
        display: inline-block;
        height: 4px;
        width: 4px;
        background-color: ${borderColor};
      }
      .cs-typing-indicator__dot:not(:last-child) {
        margin-right: 3px;
      }
      .cs-typing-indicator__dot:nth-child(1) {
        box-sizing: inherit;
      }
      .cs-typing-indicator__dot:nth-child(2) {
        animation-delay: 300ms;
      }
      .cs-typing-indicator__dot:nth-child(3) {
        animation-delay: 400ms;
      }
      .cs-typing-indicator__text {
        box-sizing: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: ${borderColor};
        background-color: transparent;
        margin: 0 0 0 0.5em;
        -webkit-user-select: none;
          -moz-user-select: none;
                user-select: none;
      }
      @keyframes cs-typing-indicator__typing-animation {
        0% {
          transform: translateY(0px);
        }
        28% {
          transform: translateY(-5px);
        }
        44% {
          transform: translateY(0px);
        }
      }

      .cs-conversation-header {
        box-sizing: border-box;
        color: ${colorInverse};
        background-color: ${primary};
        font-size: 1em;
        flex-shrink: 0;
        -webkit-user-select: none;
           -moz-user-select: none;
                user-select: none;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        border-top: solid 0px ${borderColor};
        border-right: solid 0px ${borderColor};
        border-bottom: solid 0px ${borderColor};
        border-left: solid 0px ${borderColor};
        padding: 0.4em 0.9em;
        box-shadow: 2px 1px 1px 1px black;
      }
      .cs-conversation-header__back {
        box-sizing: border-box;
        margin-right: 0.5em;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        
        order: 1;
      }
=
      .cs-conversation-header__back button {
        font-size: 1.4em;
        
        padding: 0;
      }
      .cs-conversation-header__back button svg {
        color: white;
      }
      .cs-conversation-header__avatar {
        box-sizing: border-box;
        width: 42px;
        height: 42px;
        margin-right: 1em;
        order: 2;
      }
      .cs-conversation-header__avatar > .cs-avatar > .cs-status > .cs-status__bullet {
        border-color: ${borderColor};
      }
      .cs-conversation-header__avatar .cs-avatar-group {
        padding-right: 0 !important;
      }
      .cs-conversation-header__content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        order: 3;
        flex-grow: 2;
        justify-content: center;
        min-width: 0;
      }
      .cs-conversation-header__content .cs-conversation-header__user-name {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: bold;
        color: white;
        background-color: ${primary};
      }
      .cs-conversation-header__content .cs-conversation-header__info {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: white;
        background-color: ${primary};
        font-weight: normal;
        font-size: 0.9em;
      }
      .cs-conversation-header__actions {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        color: ${colorInverse};
        background-color: transparent;
        margin: 0 0 0 0.5em;
        order: 4;
      }
      .cs-conversation-header__actions .cs-button:not(:first-child) {
        margin-left: 0.2em;
      }
      .cs-conversation-header__actions .cs-button {
        padding: 0;
      }
      .cs-conversation-header__actions .cs-button.cs-button--arrow,
      .cs-conversation-header__actions .cs-button.cs-button--info,
      .cs-conversation-header__actions .cs-button.cs-button--voicecall,
      .cs-conversation-header__actions .cs-button.cs-button--videocall,
      .cs-conversation-header__actions .cs-button.cs-button--star,
      .cs-conversation-header__actions .cs-button.cs-button--adduser,
      .cs-conversation-header__actions .cs-button.cs-button--ellipsis,
      .cs-conversation-header__actions .cs-button.cs-button--ellipsis {
        font-size: 1.4em;
        color: normal;
        background-color: transparent;
      }
      .cs-conversation-header__actions .cs-button.cs-button--ellipsis {
        font-size: 1.3em;
      }

      .cs-conversation {
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        position: relative;
        padding: 0.6em 0.8em 0.6em 0.8em;
        cursor: pointer;
        justify-content: flex-start;
        color: ${color};
        background-color: ${bg};
        -webkit-user-select: none;
          -moz-user-select: none;
                user-select: none;
        border-top: 0;
        border-right: 0;
        border-bottom: 1px solid ${borderColor};
        border-left: 0;
      }
      .cs-conversation:hover {
        background-color: ${secondary};
      }
      .cs-conversation:hover > .cs-avatar > .cs-status > .cs-status__bullet {
        border-color: ${borderColor};
      }
      .cs-conversation:hover > .cs-avatar > img {
        filter: none;
      }
      .cs-conversation.cs-conversation:active {
        color: ${color};
        background-color: ${primary};
        border-top: 0;
        border-right: 0;
        border-bottom: 0;
        border-left: 0;
      }
      .cs-conversation.cs-conversation:active > .cs-avatar > .cs-status > .cs-status__bullet {
        border-color: ${primary};
      }
      .cs-conversation.cs-conversation--active {
        color: white;
        background-color: ${primary};
        font-weight: normal;
        border-top: 0;
        border-right: 0;
        border-bottom: 0;
        border-left: 0;
      }
      .cs-conversation.cs-conversation--active > .cs-avatar > .cs-status > .cs-status__bullet {
        border-color: ${primary};
      }
      .cs-conversation.cs-conversation--active .cs-conversation__name {
        color: white;
        font-weight: bold;
      }
      .cs-conversation.cs-conversation--active .cs-conversation__info {
        color: ${color};
        font-weight: normal;
      }
      .cs-conversation > .cs-avatar {
        width: 42.1px;
        height: 42.1px;
        margin-right: 1em;
      }
      .cs-conversation > .cs-avatar > .cs-status {
        border-color: white;
      }
      .cs-conversation > .cs-avatar-group {
        width: 42.1px;
        height: 42.1px;
        min-width: 42.1px;
        min-height: 42.1px;
        padding-right: 0 !important;
        margin-right: 1em;
      }
      .cs-conversation__content {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-right: 1.1em;
        flex-grow: 1;
      }
      .cs-conversation__operations {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 0 0 0 auto;
        color: ${gray};
        visibility: hidden;
      }
      .cs-conversation__operations--visible {
        visibility: visible;
      }
      .cs-conversation__operations:hover {
        color: white;
      }
      .cs-conversation:hover .cs-conversation__operations {
        visibility: visible;
      }
      .cs-conversation__name {
        box-sizing: border-box;
        color: ${color};
        font-size: 1em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .cs-conversation__info {
        box-sizing: border-box;
        color: ${color};
        font-size: 0.8em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .cs-conversation__last-sender {
        box-sizing: border-box;
        display: inline;
        font-weight: normal;
      }
      .cs-conversation__info-content {
        box-sizing: border-box;
        display: inline;
        font-weight: normal;
      }
      .cs-conversation__last-activity-time {
        box-sizing: border-box;
        font-size: 0.8em;
        display: inherit;
        position: absolute;
        right: 0.5em;
        bottom: 0.5em;
      }
      .cs-conversation__last-activity-time + .cs-conversation__operations {
        margin-left: 0.5em;
      }
      .cs-conversation__unread-dot {
        box-sizing: content-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 0.5em;
        align-self: center;
        border-radius: 50%;
        width: 0.7em;
        min-width: 0.7em;
        height: 0.7em;
        box-shadow: 1px 1px 1px 0px ${gray};
        perspective: 200px;
        perspective-origin: 50% 50%;
        background: radial-gradient(circle at 3px 3px, ${accent}, white);
      }
      .cs-conversation__unread-dot:hover::before {
        content: "";
        position: absolute;
        top: 1%;
        left: 5%;
        border-radius: 50%;
        
        filter: blur(0);
        height: 80%;
        width: 40%;
        background: radial-gradient(circle at 130% 130%, black 0, black 46%, black 50%, black 58%, black 60%, black 100%);
        transform: translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg);
      }
      .cs-conversation__unread-dot:hover::after {
        content: "";
        position: absolute;
        top: 5%;
        left: 10%;
        width: 80%;
        height: 80%;
        border-radius: 100%;
        filter: blur(1px);
       
        transform: rotateZ(-30deg);
        display: block;
        background: radial-gradient(circle at 50% 80%, black, black 74%, white 80%, white 84%, black 100%);
        animation: cs-unread-anim 2s ease-out infinite;
      }
      .cs-conversation__unread {
        box-sizing: border-box;
        position: absolute;
        right: 0.8em;
        top: 0.3em;
        padding: 0.01em 0.3em;
        border-radius: 0.3em;
        font-size: 0.75em;
        font-weight: 600;
        color: white;
        background-color: ${secondary};
        max-width: 30em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      
        /* For grouped Avatar */
      }
      @keyframes cs-unread-anim {
        0% {
          transform: scale(1);
        }
        20% {
          transform: scaleY(0.95) scaleX(1.05);
        }
        48% {
          transform: scaleY(1.1) scaleX(0.9);
        }
        68% {
          transform: scaleY(0.98) scaleX(1.02);
        }
        80% {
          transform: scaleY(1.02) scaleX(0.98);
        }
        97%, 100% {
          transform: scale(1);
        }
      }
      .cs-conversation-list {
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        height: 100%;
        color: ${color};
        background-color: transparent;
      }
      .cs-conversation-list > div > ul {
        margin: 0;
        padding: 0;
        list-style-type: none;
      }
      .cs-conversation-list__loading-more {
        box-sizing: content-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        position: absolute;
        background-color: transparent;
        padding: 2px 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1.2em;
        z-index: 1;
      }
      .cs-conversation-list__loading-more .cs-loader {
        width: 1.2em;
        height: 1.2em;
      }
      .cs-conversation-list__loading-more .cs-loader::before,
      .cs-conversation-list__loading-more .cs-loader::after {
        width: 100%;
        height: 100%;
      }
      .cs-conversation-list .ps__rail-y {
        z-index: 2;
      }

      .cs-status {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: nowrap;
        font-size: 1em;
      }
      .cs-status .cs-status__bullet {
        box-sizing: content-box;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        position: relative;
        perspective: 200px;
        perspective-origin: 50% 50%;
      }
      .cs-status--selected {
        color: ${color};
        background-color: ${primary};
      }
      .cs-status--named {
        width: auto;
        height: auto;
      }
      .cs-status__name {
        margin: 0 0 0 0.58em;
        line-height: 1.5;
      }
      .cs-avatar:hover .cs-status__bullet:before, .cs-status:ho-ver .cs-status__bullet:before {
        box-sizing: border-box;
        content: "";
        position: absolute;
        top: 1%;
        left: 5%;
        border-radius: 50%;
        z-index: 2;
        filter: blur(0);
        height: 80%;
        width: 40%;
        background: radial-gradient(circle at 130% 130%, black 0, black 46%, black 50%, black 58%, black 60%, black 100%);
        transform: translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg);
      }

      .cs-avatar:hover .cs-status__bullet:after, .cs-status:ho-ver .cs-status__bullet:after {
        box-sizing: border-box;
        content: "";
        position: absolute;
        top: 5%;
        left: 10%;
        width: 80%;
        height: 80%;
        border-radius: 100%;
        filter: blur(1px);
        z-index: 2;
        transform: rotateZ(-30deg);
        display: block;
        background: radial-gradient(circle at 50% 80%, black, black 74%, white 80%, white 84%, black 100%);
        animation: cs-bubble-anim 2s ease-out infinite;
      }

      .cs-status--available .cs-status__bullet {
        background: radial-gradient(circle at 3px 3px, #00d5a6, #00a27e);
      }
      .cs-status--available .cs-status__name {
        color: ${color};
      }
      .cs-status--unavailable .cs-status__bullet {
        background: radial-gradient(circle at 3px 3px, #ffb527, #a66d00);
      }
      .cs-status--unavailable .cs-status__name {
        color: ${color};
      }
      .cs-status--away .cs-status__bullet {
        background: radial-gradient(circle at 3px 3px, #ffdbb0, #fc8b00);
      }
      .cs-status--away .cs-status__name {
        color: ${color};
      }
      .cs-status--dnd .cs-status__bullet {
        background-color: ${secondary};
        background: radial-gradient(circle at 3px 3px, #f89f9f, ${secondary});
      }
      .cs-status--dnd .cs-status__name {
        color: ${color};
      }
      .cs-status--invisible .cs-status__bullet {
        background-color: #c2d1d9;
        background: radial-gradient(circle at 3px 3px, white, #c2d1d9);
      }
      .cs-status--invisible .cs-status__name {
        color: ${color};
      }
      .cs-status--eager .cs-status__bullet {
        background: radial-gradient(circle at 3px 3px, ${bg}, #ffee00);
      }
      .cs-status--eager .cs-status__name {
        color: ${color};
      }
      .cs-status--xs:not(.cs-status--named) {
        font-size: 1em;
        width: 4px;
        height: 4px;
      }
      .cs-status--xs:not(.cs-status--named) .cs-status__bullet {
        width: 4px;
        min-width: 4px;
        height: 4px;
      }
      .cs-status--sm:not(.cs-status--named) {
        font-size: 1em;
        width: 8px;
        height: 8px;
      }
      .cs-status--sm:not(.cs-status--named) .cs-status__bullet {
        width: 8px;
        min-width: 8px;
        height: 8px;
      }
      .cs-status--md:not(.cs-status--named) {
        font-size: 1em;
        width: 11px;
        height: 11px;
      }
      .cs-status--md:not(.cs-status--named) .cs-status__bullet {
        width: 11px;
        min-width: 11px;
        height: 11px;
      }
      .cs-status--lg:not(.cs-status--named) {
        font-size: 1em;
        width: 14px;
        height: 14px;
      }
      .cs-status--lg:not(.cs-status--named) .cs-status__bullet {
        width: 14px;
        min-width: 14px;
        height: 14px;
      }
      .cs-status--fluid {
        width: 100%;
        height: 100%;
      }
      .cs-status--fluid .cs-status__bullet {
        width: 100%;
        min-width: 100%;
        height: 100%;
      }
      @keyframes cs-bubble-anim {
        0% {
          transform: scale(1);
        }
        20% {
          transform: scaleY(0.95) scaleX(1.05);
        }
        48% {
          transform: scaleY(1.1) scaleX(0.9);
        }
        68% {
          transform: scaleY(0.98) scaleX(1.02);
        }
        80% {
          transform: scaleY(1.02) scaleX(0.98);
        }
        97%, 100% {
          transform: scale(1);
        }
      }

      .cs-sidebar {
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .cs-sidebar--left {
        background-color: ${bg};
      }
      .cs-sidebar--right {
        background-color: ${bg};
      }
      .cs-sidebar .cs-expansion-panel + .cs-expansion-panel {
        border-top: 0;
      }

      .cs-expansion-panel {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        color: ${color};
        background-color: ${bg};
        border: solid 1px ${borderColor};
        font-weight: normal;
        font-size: inherit;
        font-variant: normal;
      }
      .cs-expansion-panel__header {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        color: ${color};
        background-color: ${primary};
        font-weight: bold;
        font-size: 0.75em;
        font-variant: normal;
        -webkit-user-select: none;
          -moz-user-select: none;
                user-select: none;
        padding: 0.8em 0.8em;
        align-items: center;
        user-select: none;
        cursor: pointer;
      }
      .cs-expansion-panel__header:hover {
        color: ${color};
        background-color: ${secondary};
      }
      .cs-expansion-panel__title {
        box-sizing: border-box;
        flex-grow: 1;
      }
      .cs-expansion-panel__icon {
        box-sizing: border-box;
        margin-left: 1em;
        margin-right: 0.5em;
      }
      .cs-expansion-panel__content {
        display: none;
        color: ${color};
        background-color: ${bg};
        font-weight: normal;
        font-size: 0.8em;
        font-variant: normal;
        padding: 0.4em 0.8em;
      }
      .cs-expansion-panel--open .cs-expansion-panel__content {
        display: block;
        color: ${color};
        background-color: ${bg};
      }
      .cs-expansion-panel--closed .cs-expansion-panel__content {
        display: none;
      }
      .cs-expansion-panel--open .cs-expansion-panel__header {
        color: ${color};
        background-color: ${primary};
      }
      .cs-search {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        margin: 0;
        padding: 0;
        background-color: ${primary};
        align-items: center;
        position: relative;
        border-radius: 0.7em;
        padding: 0.6em 0.9em;
        font-size: inherit;
        font-family: inherit;
      }
      .cs-search__input {
        box-sizing: border-box;
        order: 1;
        color: ${color};
        border: none;
        width: 100%;
        min-width: 0;
        outline: 0;
        margin-right: 0.5em;
        background-color: ${primary};
        font-size: 0.8em;
        font-family: inherit;
      }
      .cs-search__input:disabled {
        color: ${color};
        background-color: ${primary};
      }
      .cs-search__input::-moz-placeholder {
        color: ${color};
      }
      .cs-search__input::placeholder {
        color: ${color};
      }
      .cs-search__search-icon {
        box-sizing: border-box;
        order: 0;
        display: block;
        margin-right: 0.5em;
        color: ${borderColor};
      }
      .cs-search__clear-icon {
        box-sizing: border-box;
        order: 2;
        color: ${borderColor};
        visibility: hidden;
      }
      .cs-search__clear-icon:hover {
        color: ${primary};
        cursor: pointer;
      }
      .cs-search__clear-icon--active {
        visibility: visible;
      }
      .cs-search--disabled {
        opacity: 0.38;
        color: ${gray};
        background-color: ${primary};
      }

      .cs-button {
        box-sizing: border-box;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        color: ${borderColor};
        background-color: transparent;
        border: none;
        border-radius: 0.7em;
        margin: 0.1em 0.2em;
        padding: 0.2em 0.7em;
        outline: none;
        font-size: 1em;
        line-height: 1.5;
      }
      .cs-button:focus {
        outline: none;
      }
      .cs-button:disabled {
        opacity: 0.38;
      }
      .cs-button:not(:disabled) {
        cursor: pointer;
      }
      .cs-button.cs-button--border {
        border: solid 1px ${borderColor};
      }
      .cs-button:hover:not(:disabled) {
        opacity: 0.6;
      }
      .cs-button.cs-button--right > svg[data-icon]:first-child {
        margin-right: 0.5em;
      }
      .cs-button.cs-button--left > svg[data-icon]:last-child {
        margin-left: 0.5em;
      }
      .cs-button--adduser {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--arrow {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--ellipsis {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--info {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--star {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--videocall {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--voicecall {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--send {
        color: ${borderColor};
        background-color: transparent;
      }
      .cs-button--attachment {
        color: ${borderColor};
        background-color: transparent;
      }

      .cs-loader {
        box-sizing: border-box;
        display: inline-flex;
        position: relative;
        font-size: 1em;
        width: 1.8em;
        height: 1.8em;
        color: ${color};
        background-color: transparent;
      }
      .cs-loader::before, .cs-loader::after {
        box-sizing: border-box;
        display: block;
        width: 1.8em;
        height: 1.8em;
        margin: 0 0 0 -0.9em;
      }
      .cs-loader::before {
        position: absolute;
        content: "";
        top: 0;
        left: 50%;
        border-radius: 50%;
        border-color: ${primary};
        border-style: solid;
        border-width: 0.2em;
      }
      .cs-loader::after {
        position: absolute;
        content: "";
        top: 0;
        left: 50%;
        animation: loader-default 0.6s linear;
        animation-iteration-count: infinite;
        border-radius: 50%;
        border-color: ${borderColor} transparent transparent transparent;
        border-style: solid;
        border-width: 0.2em;
        box-shadow: 0 0 0 transparent;
      }
      .cs-loader--content {
        width: auto;
        height: auto;
        padding-top: 2.6em;
      }
      @keyframes loader-default {
        to {
          transform: rotate(360deg);
        }
      }
      .cs-overlay {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-backdrop-filter: blur(10%);
                backdrop-filter: blur(10%);
      }
      .cs-overlay__content {
        z-index: 220;
      }
      .cs-overlay::before {
        box-sizing: border-box;
        content: "";
        background-color: ${secondary};
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
      }
      .cs-overlay--blur::before {
        -webkit-backdrop-filter: blur(2px);
                backdrop-filter: blur(2px);
      }
      .cs-overlay--grayscale::before {
        -webkit-backdrop-filter: grayscale(50%);
                backdrop-filter: grayscale(50%);
      }

      .cs-status-list {
        box-sizing: border-box;
        list-style-type: none;
        margin: 0;
        padding: 1em;
        color: ${color};
        background-color: ${bg};
      }
      .cs-status-list > li {
        box-sizing: border-box;
        cursor: pointer;
        -webkit-user-select: none;
           -moz-user-select: none;
                user-select: none;
      }
      .cs-status-list > li > .cs-status {
        margin: 0;
        padding: 0.4em 0.8em;
        width: auto;
        height: auto;
      }
      .cs-status-list > li .cs-status--selected {
        color: ${color};
        background-color: ${primary};
      }
      .cs-status-list > li .cs-status--selected .cs-status__name {
        color: ${color};
        background-color: ${primary};
      }
      .cs-status-list > li:hover {
        color: ${color};
        background-color: ${secondary};
      }
      .cs-status-list > li:focus {
        color: ${color};
        background-color: ${primary};
      }
      .cs-status-list > li:active {
        color: ${color};
        background-color: ${primary};
      }
      .cs-status-list--xs > li > .cs-status {
        font-size: 1em;
        width: auto;
        height: auto;
      }
      .cs-status-list--xs > li > .cs-status .cs-status__bullet {
        width: 4px;
        min-width: 4px;
        height: 4px;
      }
      .cs-status-list--sm > li > .cs-status {
        font-size: 1em;
        width: auto;
        height: auto;
      }
      .cs-status-list--sm > li > .cs-status .cs-status__bullet {
        width: 8px;
        min-width: 8px;
        height: 8px;
      }
      .cs-status-list--md > li > .cs-status {
        font-size: 1em;
        width: auto;
        height: auto;
      }
      .cs-status-list--md > li > .cs-status .cs-status__bullet {
        width: 11px;
        min-width: 11px;
        height: 11px;
      }
      .cs-status-list--lg > li > .cs-status {
        font-size: 1em;
        width: auto;
        height: auto;
      }
      .cs-status-list--lg > li > .cs-status .cs-status__bullet {
        width: 14px;
        min-width: 14px;
        height: 14px;
      }

      .ps {
        overflow: hidden !important;
        overflow-anchor: none;
        -ms-overflow-style: none;
        touch-action: auto;
        -ms-touch-action: auto;
      }

      .ps__rail-x {
        display: none;
        opacity: 0;
        transition: background-color 0.2s linear, opacity 0.2s linear;
        -webkit-transition: background-color 0.2s linear, opacity 0.2s linear;
        height: 15px;
        bottom: 0px;
        position: absolute;
      }

      .ps__rail-y {
        display: none;
        opacity: 0;
        transition: background-color 0.2s linear, opacity 0.2s linear;
        -webkit-transition: background-color 0.2s linear, opacity 0.2s linear;
        width: 15px;
        right: 0;
        left: auto !important;
        position: absolute;
      }

      .ps--active-x > .ps__rail-x,
      .ps--active-y > .ps__rail-y {
        display: block;
        background-color: transparent;
      }

      .ps:hover > .ps__rail-x,
      .ps:hover > .ps__rail-y,
      .ps--focus > .ps__rail-x,
      .ps--focus > .ps__rail-y,
      .ps--scrolling-x > .ps__rail-x,
      .ps--scrolling-y > .ps__rail-y {
        opacity: 0.6;
      }

      .ps .ps__rail-x:hover,
      .ps .ps__rail-y:hover,
      .ps .ps__rail-x:focus,
      .ps .ps__rail-y:focus,
      .ps .ps__rail-x.ps--clicking,
      .ps .ps__rail-y.ps--clicking {
        background-color: ${gray};
        background-color: ${primary};
        opacity: 0.9;
      }

      .ps__thumb-x {
        background-color: ${borderColor};
        border-radius: 6px;
        transition: background-color 0.2s linear, height 0.2s ease-in-out;
        -webkit-transition: background-color 0.2s linear, height 0.2s ease-in-out;
        height: 6px;
        bottom: 2px;
        position: absolute;
      }

      .ps__thumb-y {
        background-color: ${primary};
        border-radius: 6px;
        transition: background-color 0.2s linear, width 0.2s ease-in-out;
        -webkit-transition: background-color 0.2s linear, width 0.2s ease-in-out;
        width: 6px;
        right: 2px;
        position: absolute;
      }

      .ps__rail-x:hover > .ps__thumb-x,
      .ps__rail-x:focus > .ps__thumb-x,
      .ps__rail-x.ps--clicking .ps__thumb-x {
        background-color: ${primary};
        height: 11px;
      }

      .ps__rail-y:hover > .ps__thumb-y,
      .ps__rail-y:focus > .ps__thumb-y,
      .ps__rail-y.ps--clicking .ps__thumb-y {
        background-color: ${primary};
        width: 11px;
      }

      @supports (-ms-overflow-style: none) {
        .ps {
          overflow: auto !important;
        }
      }
      @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
        .ps {
          overflow: auto !important;
        }
      }
      .scrollbar-container {
        position: relative;
        height: 100%;
      }

      .cs-button svg {
        min-height: 1.5rem;
        color: ${color};
      }
      `}
    </style>
  )
}
