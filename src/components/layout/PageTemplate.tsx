import React, { useContext, useEffect } from "react"
import Head from "next/head"
import { PageShell, FullWidth, Alert } from "@eco/stratos-components"
import { MainContext } from "components/context/MainContext"

type Props = {
  title: string;
  children: JSX.Element;
  header_only?: boolean;
}

const PageTemplate: React.FC<Props> = ({
  title,
  children,
  header_only = false,
}: Props) => {
  const mainContext = useContext(MainContext)

  useEffect(() => {
    setTimeout(() => {
      mainContext?.setBannerMessage("")
    }, 3500)
  }, [mainContext?.bannerMessage])

  return (
    <React.Fragment>
      <Head>
        <title>Observations- {title}</title>
      </Head>
      {mainContext?.bannerMessage !== undefined &&
      mainContext.bannerMessage !== "" ? (
        <div className="fixed z-50 w-screen">
          <Alert
            id="mainPageBanner"
            testId="testMainPageBanner"
            variant={mainContext.bannerVariant}
            message={mainContext.bannerMessage}
            dismissible={true}
            onDismiss={() => void 0}
          />
        </div>
      ) : (
        <></>
      )}

      {header_only ? (
        children
      ) : (
        <PageShell>
          <FullWidth>{children}</FullWidth>
        </PageShell>
      )}
    </React.Fragment>
  )
}

export default PageTemplate
