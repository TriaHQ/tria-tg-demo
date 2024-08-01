import { useEffect } from "react"
import { useRouter } from "next/router"
import { useTelegramMiniApp } from "@tria-sdk/authenticate-react"

export default function Home() {
  const router = useRouter()
  const { setBackgroundColor } = useTelegramMiniApp()
  useEffect(() => {
    setBackgroundColor("#031329")
    router.push("/menu")
  }, [router, setBackgroundColor])

  return null
}
