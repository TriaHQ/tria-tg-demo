import { TriaProvider, useTelegramMiniApp } from "@tria-sdk/authenticate-react"
import type { AppProps } from "next/app"
import { montserrat } from "@/utils/fonts"
import "@tria-sdk/authenticate-react/dist/style.css"
import "@/styles/globals.css"

import { useEffect, useState } from "react"
export default function App({ Component, pageProps }: AppProps) {
  const {
    setHeaderColor,
    expand,
    impactOccurred,
    showSettingsButton,
    hideMainButton,
  } = useTelegramMiniApp()
  useEffect(() => {
    setHeaderColor("#080808")
    expand()
    showSettingsButton()
    hideMainButton()
    impactOccurred("heavy")
  }, [setHeaderColor, expand, impactOccurred])
  // useEffect(() => {
  //   console.log(
  //     "scrolltop component mounted",
  //     window.Telegram,
  //     window.Telegram?.WebApp
  //   )
  //   if (
  //     typeof window !== "undefined" &&
  //     window.Telegram &&
  //     window.Telegram.WebApp
  //   ) {
  //     const overflow = 100
  //     document.body.style.overflowY = "hidden"
  //     document.body.style.marginTop = `${overflow}px`
  //     document.body.style.height = window.innerHeight + overflow + "px"
  //     document.body.style.paddingBottom = `${overflow}px`
  //     window.scrollTo(0, overflow)
  //   }
  // }, [])
  return (
    <TriaProvider
      initialConfig={{
        analyticsKeys: {
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
          projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        },
        chain: "POLYGON",
        environment: "testnet",
        autoDIDCreationEnabled: true,
        telegramAutoAuthOpts: {
          enableAutoLogin: true,
          enableAutoDidCreation: false,
        },
        // triaStaging: "staging",
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
        didDomain: "tc",
      }}
      initialUIConfig={{
        modalMode: true,
        darkMode: true,
        showCloseButton: true,
        layout: ["web2"],
        web2LoginMethods: ["telegram_miniapp"],
        emailPhoneLoginMethods: [],
        web3LoginMethods: [],
        showDivider: false,
      }}
      initialWalletUIConfig={{
        darkMode: true,
        enableWallet: true,
        primaryColor: "red",
        transactionsUIConfig: {
          darkMode: true,
          primaryColor: "#080808",
          buttonPrimaryColor:
            "linear-gradient(180deg, #21CC51 0%, #166E55 100%)",
          borderColor: "#21CC5121",
          buttonSecondaryColor: "#FFF",
          buttonFontSecondaryColor: "#031329",
          primaryFontColor: "#FFFFFF",
          secondaryFontColor: "#808080",
          gradientStart: "#303030",
          gradientStop: "#080808",
        },
      }}
    >
      <div
        id='main-doc'
        style={{
          backgroundColor: "#080808", // Dark blue background
          minHeight: "100vh",
          height: "100%",
          color: "white", // White text color
        }}
        className={`${montserrat.variable} font-sans`}
      >
        <Component {...pageProps} />
      </div>
    </TriaProvider>
  )
}
