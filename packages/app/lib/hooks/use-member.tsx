import useSWR from 'swr';
import { Member } from 'lib/models';
import { JsonFetcher } from '../services/fetchers';

type MemberResults = {
  member: Member;
  error: boolean;
  loading: boolean;
};

export const userMember = (id: string = 'me'): MemberResults => {
  const { data, error, isValidating } = useSWR<Member>(
    `/api/member/${id}`,
    JsonFetcher
  );

  return {
    member: data,
    error,
    loading: isValidating
  };
};
