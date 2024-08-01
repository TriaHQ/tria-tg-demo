// components/Toast.tsx
import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ToastProps {
  title: string
  message: string
  type: "message" | "error" | "success"
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
}
const parseBoldText = (text: string): (string | JSX.Element)[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type,
  isVisible,
  setIsVisible,
}) => {
  const [toastIsVisible, setToastIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setToastIsVisible(true)
    }
  }, [isVisible])

  useEffect(() => {
    if (toastIsVisible) {
      const timer = setTimeout(() => {
        setToastIsVisible(false)
        if (type !== "message") setTimeout(() => setIsVisible(false), 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [toastIsVisible, type, setIsVisible])

  const getBackgroundColor = () => {
    switch (type) {
      case "message":
        return "#132F56"
      case "error":
        return "#2F0E0E"
      case "success":
        return "#072A07"
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "message":
        return "rgba(60, 141, 255, 0.45)"
      case "error":
        return "rgba(255, 0, 0, 0.20)"
      case "success":
        return "rgba(0, 128, 0, 0.60)"
    }
  }

  const containerVariants = {
    hidden: { y: -120, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.5,
      },
    },
    exit: {
      y: -120,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const toastVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.2,
        duration: 0.3,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <AnimatePresence>
      {toastIsVisible && (
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          exit='exit'
          style={{
            position: "fixed",
            top: 64,
            left: 0,
            right: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.div
            variants={toastVariants}
            style={{
              color: "white",
              width: "90%",
              height: "87px",
              paddingTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "16px",
              paddingLeft: "16px",
              paddingRight: "16px",
              borderRadius: "14px",
              background: getBackgroundColor(),
              border: `1px solid ${getBorderColor()}`,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div className='flex flex-col w-[90%]'>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='text-[14px] font-[600] leading-normal'
              >
                {title}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='text-[12px] font-[400] leading-normal'
              >
                {parseBoldText(message)}
              </motion.p>
            </div>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
              className='text-[30px]'
            >
              {type === "message" ? "🤞" : type === "error" ? "💔" : "🎉"}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
