import { TriaProvider, useTelegramMiniApp } from "@tria-sdk/authenticate-react"
import type { AppProps } from "next/app"
import { montserrat } from "@/utils/fonts"
import "@tria-sdk/authenticate-react/dist/style.css"
import "@/styles/globals.css"

import { useEffect } from "react"
export default function App({ Component, pageProps }: AppProps) {
  const {
    setHeaderColor,
    expand,
    impactOccurred,
    showSettingsButton,
    hideMainButton,
  } = useTelegramMiniApp()

  // Setting demo app header color and expanding modal to open in fullscreen mode
  useEffect(() => {
    setHeaderColor("#031329")
    expand()
    showSettingsButton()
    hideMainButton()
    impactOccurred("heavy")
  }, [setHeaderColor, expand, impactOccurred])

  return (
    <TriaProvider
      initialConfig={{
        analyticsKeys: {
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        },
        chain: "POLYGON",
        environment: "testnet",
        aa: {
          pimlicoApiKey: process.env.NEXT_PUBLIC_PIMLICO_API_KEY!,
          isSponsored: true,
          sponsorshipPolicyIds: {
            FUSE: "sp_cheerful_thing",
            POLYGON: "sp_slim_namor",
          },
          accountType: "Etherspot",
          supportAa: true,
        },
      }}
      initialUIConfig={{
        modalMode: true,
        darkMode: true,
        showCloseButton: true,
        layout: ["email-phone", "divider", "web2"],
        web2LoginMethods: ["google", "apple", "twitter"],
        emailPhoneLoginMethods: ["email"],
      }}
      initialWalletUIConfig={{
        darkMode: true,
        primaryColor: "red",
        transactionsUIConfig: {
          darkMode: true,
          primaryColor: "#031329",
          buttonPrimaryColor:
            "linear-gradient(180deg, #21CC51 0%, #166E55 100%)",
          buttonSecondaryColor: "#FFF",
          buttonFontSecondaryColor: "#031329",
          primaryFontColor: "#FFFFFF",
          secondaryFontColor: "#808080",
        },
      }}
    >
      <div
        id='main-doc'
        style={{
          backgroundColor: "#031329",
          minHeight: "100vh",
          height: "100%",
          color: "white",
        }}
        className={`${montserrat.variable} font-sans`}
      >
        <Component {...pageProps} />
      </div>
    </TriaProvider>
  )
}
