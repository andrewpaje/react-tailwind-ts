import useSWR, { KeyedMutator } from "swr"

export const performUpdate = async ([url, token]: [string, string]) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data_list: unknown = await response.json()
  return {
    data: data_list,
    count: Number(response.headers.get("X-Total-Count")),
  }
}

export const useFetchWithCount = (
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
      performUpdate([
        `${process.env.BACKEND_API_END_POINT as string}${url}`,
        token,
      ]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return { data, isLoading, error, mutate }
}
