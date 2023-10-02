import useSWR, { KeyedMutator } from "swr"

const Fetcher = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data: unknown = await response.json()

  return data
}

export const useFetch = (
  url: string,
  token: string
): {
  data: unknown;
  isLoading: boolean;
  error: Error | undefined;
  mutate: KeyedMutator<unknown>;
} => {
  const { data, isLoading, error, mutate } = useSWR<unknown, Error>(
    url,
    // eslint-disable-next-line require-await
    async (url) =>
      Fetcher([`${process.env.BACKEND_API_END_POINT as string}${url}`, token]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return { data, isLoading, error, mutate }
}
