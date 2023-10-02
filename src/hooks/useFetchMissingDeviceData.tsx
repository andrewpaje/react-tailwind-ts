/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useState, useEffect } from "react"


export const useFetchMissingDeviceData = <T,>(URL: string, initialState: T, Token: string): [T, boolean] => {
    const [ missingDevices, setMissingDevices ] = useState<T>(initialState)
    const [ loading, setLoading ] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(URL, {headers: {Authorization: `Bearer ${Token}`}})
            .then((response: Response) => {
                return response.json()}
            )
            .then((data) => {
                setMissingDevices(data)
            })
            .finally(() => setLoading(false))
    }, [URL, Token])

    return [missingDevices, loading]
}
