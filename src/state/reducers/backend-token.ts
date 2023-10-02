import { useReducer } from "react";

type TokenAction = {
    type: "new" | "get"
    payload: string
}

const initialState = { token: "" }

export const BackendTokenReducer = (state: typeof initialState, action: TokenAction): typeof initialState => {
    switch (action.type) {
        case 'get':
            return { token: state.token }
        case 'new':
            return { token: action.payload }
        default:
            return state
    }
}