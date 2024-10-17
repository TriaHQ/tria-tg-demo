"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import styles from "../../styles/Menu.module.css"
import {
  TriaAuthModal,
  useTelegramAutoAuth,
  useTelegramMiniApp,
  useTria,
  useTriaAuth,
} from "@tria-sdk/authenticate-react"
import Image from "next/image"

const MenuPage: React.FC = () => {
  const [showTriaModal, setShowTriaModal] = useState<boolean>()
  const router = useRouter()
  const { showAuthModal, userState, logout, getAccount } = useTriaAuth()
  const { impactOccurred } = useTelegramMiniApp()
  const { handleTelegramAutoAuth } = useTelegramAutoAuth({
    enableAutoDidCreation: true,
  })
  const handleGuestPlay = () => {
    impactOccurred("heavy")
    localStorage.setItem("guestLogin", "true")
    router.push({
      pathname: "/roulette",
      query: { balance: 1000 },
    })
  }

  const handleLogin = () => {
    handleTelegramAutoAuth()
    showAuthModal()
  }

  useEffect(() => {
    const account = getAccount()
    if (account?.evm?.address) {
      localStorage.removeItem("guestLogin")
      router.push("/roulette")
    }
  }, [getAccount, userState])

  return (
    <div className='flex flex-col items-center justify-center w-full h-[100vh] '>
      <div>
        <TriaAuthModal />
      </div>

      <div className='w-[80vh] h-[80vh] flex items-center justify-center  fixed top-[-30%]'>
        <img
          src='/images/roulette2.svg'
          className='w-[120vw] h-[120vw] '
          alt='roulette'
        />
      </div>
      <div className=' w-full mt-[5vh] flex flex-col items-center gap-[10vh]'>
        <p className='text-[44px] w-[200px] text-[#FFF] font-[600] text-center'>
          {" "}
          Roulette Royale
        </p>
        <div className='px-[20px] w-full flex flex-col items-center justify-center gap-[12px]'>
          <button
            className='w-full py-[12px] rounded-[100px] bg-[#FFF] text-[#202020] text-[18px] font-[600] mt-[40px]'
            onClick={handleLogin}
          >
            Login
          </button>
          <button
            className='w-full py-[12px] rounded-[100px] bg-[linear-gradient(180deg, #21CC51 0%, #166E55 100%)] text-[#FFF] text-[18px] font-[600]'
            style={{
              background: "linear-gradient(180deg, #21CC51 0%, #166E55 100%)",
            }}
            onClick={handleGuestPlay}
          >
            Play Now
          </button>
        </div>
      </div>
      <p
        className='text-[12px] font-[600] leading-[120%] fixed bottom-[20px]'
        style={{ color: "rgba(255, 255, 255, 0.40)" }}
      >
        powered by tria
      </p>
    </div>
  )
}

export default MenuPage
