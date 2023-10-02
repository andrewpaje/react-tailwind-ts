import useSWR from "swr"

export const performUpdate = async ([url, token]: [string, string]) => {
  await fetch(`${process.env.BACKEND_API_END_POINT as string}${url}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export const useUpdateData = (url: string, token: string) => {
  const { data, mutate } = useSWR([url, token], performUpdate)

  return { data, mutate }
}
