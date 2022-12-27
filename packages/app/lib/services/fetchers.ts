import { request } from 'graphql-request';
import { adminBaseUrl } from '../config/client';

export const JsonFetcher = (url: string) => fetch(url).then((r) => r.json());
export const GraphQlFetcher = (query: string) =>
  request(adminBaseUrl + '/graphql', query);
