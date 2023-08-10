import { Site } from "lib/models";
import useSWR, { KeyedMutator } from "swr";

export type SiteResults = {
  site: Site | null
  error?: any
  mutate: KeyedMutator<Site>
  loading: boolean
  reload: () => void
}

export const useSite = (): SiteResults => {
  const {
    data: site,
    mutate,
    error,
    isLoading,
  } = useSWR<Site, Error>(`/api/site`, {
    fallbackData: {
      site_title: 'GuysNHeat',
      description:
        'A fraternity of bisexual men that provides safe environments for discrete encounters for men to explore and express in a safe manor. We host curated sex parties with vetted men in the Denver area.',
      invite_only: false,
    },
  })

  return {
    site,
    error,
    mutate,
    loading: isLoading,
    reload: () => {
      mutate()
    },
  }
}
