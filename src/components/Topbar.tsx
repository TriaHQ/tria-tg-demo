import { useTelegramMiniApp } from "@tria-sdk/authenticate-react"
import React, { useEffect, useState } from "react"

const Topbar = ({
  chipsBalance,
  avatar,
  showMenu,
  setShowMenu,
  guestLogin,
  scrollableRef,
}: {
  chipsBalance: number
  avatar: { bgColor?: string; avatar?: string }
  showMenu: boolean
  guestLogin: string | null
  setShowMenu: React.Dispatch<React.SetStateAction<boolean>>
  scrollableRef: React.RefObject<HTMLDivElement>
}) => {
  const [hasScrolled, setHasScrolled] = useState<Boolean>()
  const { impactOccurred } = useTelegramMiniApp()
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      // Expand viewport

      const scrollable = scrollableRef.current
      console.log("scrolltop scrollable", scrollableRef, scrollable)
      if (scrollable) {
        let startY: number

        const onTouchStart = (e: TouchEvent) => {
          startY = e.touches[0].clientY
          console.log("scrolltop startY", startY)
        }

        const onTouchMove = (e: TouchEvent) => {
          const deltaY = e.touches[0].clientY - startY
          const scrollTop = scrollable.scrollTop
          console.log("scrolltop", scrollTop, deltaY)

          // if (scrollTop === 0 && deltaY > 0) {
          //   e.preventDefault()
          // }
          if (deltaY < 0) {
            setHasScrolled(true)
          } else {
            setHasScrolled(false)
          }
          if (scrollTop > 0) {
            setHasScrolled(true)
          }
          // if (scrollTop < 150 && deltaY > 0) {
          //   setHasScrolled(false)
          // }
        }

        scrollable.addEventListener("touchstart", onTouchStart, {
          passive: true,
        })
        scrollable.addEventListener("touchmove", onTouchMove, {
          passive: false,
        })

        return () => {
          scrollable.removeEventListener("touchstart", onTouchStart)
          scrollable.removeEventListener("touchmove", onTouchMove)
        }
      }
    }
  }, [scrollableRef])

  return (
    <div
      className={`
  h-[64px] py-[12px] flex items-center fixed top-0  px-[20px] justify-between w-full z-[100] 
       ${
         hasScrolled
           ? "bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg transition duration-300 ease-in-out"
           : "bg-transparent"
       } 
`}
    >
      <div
        className='w-[44px] h-[44px] flex items-center justify-center rounded-full overflow-hidden'
        style={{ background: `${avatar?.bgColor || ""}` }}
        onClick={() => {
          impactOccurred("light")
          setShowMenu(!showMenu)
        }}
      >
        {guestLogin || !avatar?.avatar || !avatar?.bgColor ? (
          <img src='/images/guestimage.png' />
        ) : (
          <img src={avatar?.avatar} className='' />
        )}
      </div>
      <div
        className='w-[100px] h-[42px] rounded-[100px] pl-[4px] flex justify-between items-center'
        style={{ background: "rgba(255, 255, 255, 0.10)" }}
      >
        <p className='pl-[10px] text-[16px] text-[#FFFFFF] font-[500]'>
          {chipsBalance}
        </p>
        <div className='relative'>
          <img src='/images/chips.svg' alt='tria-bal' />
          <div className='absolute w-[14px] h-[14px] top-[28px] left-[28px]'>
            {/* <img src='/images/chips.svg' alt='tria-bal' /> */}

            <img src='https://static.tria.so/chain-logo-w/Polygon.svg' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
