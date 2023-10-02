/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useState, useEffect } from "react"

interface IToken {
    data: {
        access_token: string;
        expires_in: number;
        token_type: string;
    },
    meta: {
        data_time: string;
        name: string;
        uuid: string;
        start_timestamp: number;
        end_timestamp: number;
        execution_time: number;
    }
}

export const useFetchBackendToken = (dependencies): string => {
    const [backendToken, setBackendToken] = useState<string>("");

    const addHour = (date: Date, hours: number): Date => {
        date.setHours(date.getHours() + hours);

        return date;
    }

    const token_request_payload = {
        grant_type: "client_credentials",
        client_id: process.env.BACKEND_AUTH_CLIENT_ID,
        client_secret: process.env.BACKEND_AUTH_CLIENT_SECRET,
        audience: process.env.BACKEND_AUTH_AUDIENCE,
    }

    useEffect(() => {
        let existing_token: any = localStorage.getItem('backend-token') || ""

        const fetchData = async () => {
            const URL = "https://api.auth.dtn.com/v1/tokens/authorize"
            const request_init = {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(token_request_payload),
                }

            const response = await fetch(URL, request_init)
            const fetchToken = await response.json() as IToken

            localStorage.setItem('backend-token', JSON.stringify(fetchToken))
            setBackendToken(fetchToken.data.access_token)
        }

        if (existing_token !== "") {
            // Have existing token
            existing_token = JSON.parse(existing_token)
            const token_timestamp = new Date(existing_token.meta.date_time)
            const expiration_timestamp = addHour(token_timestamp, 4)
            const current_timestamp = new Date()
            if (expiration_timestamp > current_timestamp) {
                // Reuse the token
                setBackendToken((existing_token as IToken).data.access_token)
            } else {
                void fetchData()
            }
        } else {
            void fetchData()
        }

    }, [token_request_payload, dependencies])

    return backendToken
}
