'use client'
import { request } from 'graphql-request'
import { adminBaseUrl } from '../config'

export const JsonFetcher = (url: string) => {
  return url
    ? fetch(url)
        .then((r) => r.json())
        .then((r) => r.data)
    : Promise.reject('No URL')
}

export const GraphQlFetcher = (query: string) => request(adminBaseUrl + '/graphql', query)
