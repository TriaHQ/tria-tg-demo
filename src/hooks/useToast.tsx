// hooks/useToast.ts
import { useState, useCallback } from "react"

type ToastType = "message" | "error" | "success"

export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [title, setTitle] = useState("")
  const [type, setType] = useState<ToastType>("message")

  const showToast = useCallback(
    (title: string, msg: string, toastType: ToastType = "message") => {
      setMessage(msg)
      setTitle(title)
      setType(toastType)
      setIsVisible(true)
    },
    []
  )

  const hideToast = useCallback(() => {
    setIsVisible(false)
  }, [])

  return { isVisible, message, type, showToast, setIsVisible, title }
}
