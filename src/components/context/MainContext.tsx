import React from "react"
import { createContext, useState } from "react"

type MainContextProviderProps = {
  children: React.ReactNode;
}

export type MainContextType = {
  bannerVariant: "info" | "success" | "error";
  setBannerVariant: React.Dispatch<
    React.SetStateAction<"info" | "success" | "error">
  >;
  bannerMessage: string;
  setBannerMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const MainContext = createContext<MainContextType | null>(null)

export const MainContextProvider = ({ children }: MainContextProviderProps) => {
  const [bannerVariant, setBannerVariant] = useState<
    "info" | "success" | "error"
  >("info")
  const [bannerMessage, setBannerMessage] = useState<string>("")

  return (
    <MainContext.Provider
      value={{
        bannerVariant,
        setBannerVariant,
        bannerMessage,
        setBannerMessage,
      }}
    >
      {children}
    </MainContext.Provider>
  )
}
