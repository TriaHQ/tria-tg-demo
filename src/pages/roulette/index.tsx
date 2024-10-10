"use client"
import React, { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import BettingTable from "../../components/BettingTable"
import wheelNumbers from "../../data/wheelNumbers.json"
import styles from "../../styles/Home.module.css"
import { useRouter } from "next/router"
import toast, { Toaster } from "react-hot-toast"
import LoadingSpinner from "@/components/LoadingSpinner"
import {
  TriaAuthModal,
  useTelegramMiniApp,
  useTriaAuth,
  useTriaWallet,
} from "@tria-sdk/authenticate-react"
import MenuPopup from "@/components/MenuPopup"
import {
  Account,
  ContractDetails,
  wagmiConnectedAsync,
} from "@tria-sdk/connect"
import { UserController } from "@tria-sdk/core"
import { getColorForNumber } from "@/utils"
import { useToast } from "@/hooks/useToast"
import Toast from "@/components/Toast"
import Topbar from "@/components/Topbar"

const DynamicWheel = dynamic(() => import("../../components/Wheel"), {
  ssr: false,
})

interface WheelData {
  option: string
  style: {
    backgroundColor: string
    textColor: string
  }
}

type GameStage = "betting" | "spinning"

interface PlayerBet {
  number: number | null
  amount: number
}

export default function Roulette() {
  const [isLoading, setIsLoading] = useState(true)
  const [mustSpin, setMustSpin] = useState<boolean>(false)
  const [prizeNumber, setPrizeNumber] = useState<number>(2)
  const [gameStage, setGameStage] = useState<GameStage>("betting")
  const [playerBet, setPlayerBet] = useState<PlayerBet>({
    number: null,
    amount: 0,
  })
  const [fetchCallCount, setFetchCallCount] = useState<number>(0)
  const [avatar, setAvatar] = useState<string>()
  const [bgColor, setBgColor] = useState<string>()
  const [chipsBalance, setChipsBalance] = useState<number>(0)
  const [balance, setBalance] = useState<number>(0)
  const [triaAccount, setTriaAccount] = useState<Account | undefined>()
  const [winningNumber, setWinningNumber] = useState<number | null>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [fetchBalance, setFetchBalance] = useState<boolean>()
  const [triaBalance, setTriaBalance] = useState<number>()
  const [triaBalanceLoading, setTriaBalanceLoading] = useState<boolean>(false)
  const [showLoginModal, setShowLoginModal] = useState<boolean>()
  const [hasScrolled, setHasScrolled] = useState(false)
  const [randomBet, setRandomBet] = useState<number | null>(null)

  const router = useRouter()
  const scrollableRef = useRef<HTMLDivElement>(null)
  const { getAccount, logout, showAuthModal, userState } = useTriaAuth()
  const { writeContract, isReady } = useTriaWallet()
  const { impactOccurred } = useTelegramMiniApp()
  const { isVisible, message, showToast, setIsVisible, type, title } =
    useToast()
  // const MemoizedDynamicWheel = React.memo(DynamicWheel)
  const MemoizedToast = React.memo(Toast)
  const userController = new UserController(
    process.env.NEXT_PUBLIC_SDK_BASE_URL
  )
  const guestLogin =
    typeof localStorage != "undefined"
      ? localStorage.getItem("guestLogin")
      : null
  const calledFromRedeem =
    typeof localStorage != "undefined"
      ? localStorage.getItem("called-from-redeem")
      : null

  const updateBalance = (balance: number) => {
    setBalance(balance)
    if (guestLogin) {
      localStorage.setItem(`guest-balance`, balance?.toString())
    } else {
      localStorage.setItem(
        `${triaAccount?.triaName}-balance`,
        balance?.toString()
      )
    }
  }

  const handleBetPlaced = (
    number: number | null,
    randomBetIn: number | null,
    amount: number
  ) => {
    impactOccurred("heavy")
    console.log("Bet placed:", { number, amount })
    if (amount > balance) {
      // alert("Insufficient balance!")
      toast.error("Insufficient balance!")
      return
    }
    setPlayerBet({ number, amount })
    updateBalance(balance - amount)
    setGameStage("spinning")
    try {
      const newPrizeNumber = Math.floor(
        Math.random() * wheelNumbers.numbers.length
      )
      console.log("New prize number index:", newPrizeNumber)

      setPrizeNumber(newPrizeNumber)
      setRandomBet(randomBetIn)
      const winningNumberStr = wheelNumbers.numbers[newPrizeNumber]
      console.log("Winning number string:", winningNumberStr)

      if (winningNumberStr && !isNaN(parseInt(winningNumberStr))) {
        const winningNumber = parseInt(winningNumberStr)
        console.log("Parsed winning number:", winningNumber)
        setWinningNumber(winningNumber)
      } else {
        console.error("Invalid winning number")
        setWinningNumber(null)
      }
      spinWheel()
    } catch (error) {
      console.error("Error in spinWheel:", error)
      setGameStage("betting")
      // Optionally, revert the bet
      updateBalance(balance + amount)
      setPlayerBet({ number: null, amount: 0 })
      // alert("An error occurred while spinning the wheel. Please try again.")
      toast.error(
        "An error occurred while spinning the wheel. Please try again."
      )
    }
  }
  const spinWheel = () => {
    console.log("Spinning wheel")

    if (
      !wheelNumbers ||
      !Array.isArray(wheelNumbers.numbers) ||
      wheelNumbers.numbers.length === 0
    ) {
      console.error("Invalid wheelNumbers data")
      return
    }
    showToast(
      `Good luck!`,
      `Your bet has been placed. The wheel is spinning...`,
      "message"
    )
    setTimeout(() => {
      setIsVisible(false)
    }, 2000)
    setMustSpin(true)
  }

  const handleSpinComplete = () => {
    impactOccurred("light")
    console.log("Spin complete")
    setMustSpin(false)
    if (winningNumber !== null) {
      console.log("Winning number:", winningNumber)
      let winnings = 0
      if (winningNumber === playerBet.number) {
        winnings = playerBet.amount * 35

        // alert(`Congratulations! You won $${winnings}`);
        showToast(
          `Congratulations! You won!`,
          `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
            winningNumber
          )}** color.`,
          "success"
        )
        toast.success(`Congratulations! You won $${winnings}`)
      } else if (randomBet) {
        console.log(
          "Random Winning number:",
          randomBet,
          winningNumber,
          getColorForNumber(winningNumber)
        )
        if (randomBet === 3 && getColorForNumber(winningNumber) === "red") {
          winnings = playerBet.amount * 10
          showToast(
            `Congratulations! You won!`,
            `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
              winningNumber
            )}** color.`,
            "success"
          )
          toast.success(`Congratulations! You won $${winnings}`)
        } else if (
          randomBet === 4 &&
          getColorForNumber(winningNumber) === "black"
        ) {
          winnings = playerBet.amount * 10
          showToast(
            `Congratulations! You won!`,
            `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
              winningNumber
            )}** color.`,
            "success"
          )
          toast.success(`Congratulations! You won $${winnings}`)
        } else if (
          randomBet === 1 &&
          winningNumber <= 18 &&
          winningNumber >= 1
        ) {
          winnings = playerBet.amount * 10
          toast.success(`Congratulations! You won $${winnings}`)
          showToast(
            `Congratulations! You won!`,
            `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
              winningNumber
            )}** color.`,
            "success"
          )
        } else if (randomBet === 6 && winningNumber > 18) {
          winnings = playerBet.amount * 10
          toast.success(`Congratulations! You won $${winnings}`)
          showToast(
            `Congratulations! You won!`,
            `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
              winningNumber
            )}** color.`,
            "success"
          )
        } else if (randomBet === 2 && winningNumber % 2 === 0) {
          winnings = playerBet.amount * 10
          showToast(
            `Congratulations! You won!`,
            `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
              winningNumber
            )}** color.`,
            "success"
          )
          toast.success(`Congratulations! You won $${winnings}`)
        } else if (randomBet === 5 && winningNumber % 2 != 0) {
          winnings = playerBet.amount * 10
          showToast(
            `Congratulations! You won!`,
            `You won **$${winnings}** on number **${winningNumber}** and **${getColorForNumber(
              winningNumber
            )}** color.`,
            "success"
          )
          toast.success(`Congratulations! You won $${winnings}`)
        } else {
          toast.error(
            `Sorry, you lost $${playerBet.amount}. The winning number was ${winningNumber}.`
          )
          showToast(
            `Better luck next time!`,
            `The winning number was **${winningNumber}** and color was **${getColorForNumber(
              winningNumber
            )}**. You lost **$${playerBet.amount}**`,
            "error"
          )
        }
      } else {
        toast.error(
          `Sorry, you lost $${playerBet.amount}. The winning number was ${winningNumber}.`
        )
        showToast(
          `Better luck next time!`,
          `The winning number was **${winningNumber}** and color was **${getColorForNumber(
            winningNumber
          )}**. You lost **$${playerBet.amount}**`,
          "error"
        )
        // alert(
        // `Sorry, you lost $${playerBet.amount}. The winning number was ${winningNumber}.`
        // );
      }
      setTimeout(() => {
        setIsVisible(false)
      }, 2000)
      updateBalance(balance + winnings)
    } else {
      console.error("Winning number is null")
    }
    setGameStage("betting")
    setWinningNumber(null)
    setRandomBet(null)
  }

  const handleRedeem = async () => {
    impactOccurred("heavy")
    if (guestLogin) {
      localStorage.setItem("called-from-redeem", "true")
      handleLogout()
    } else {
      const contractDetails: ContractDetails = {
        contractAddress: "0x1eeb2910c9f2e1e60294271634832824b159f61a",
        abi: [
          {
            inputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "mint",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        args: [`${100 * 10 ** 18}`],
        functionName: "mint",
        value: 0,
      }
      const res = await writeContract(contractDetails)
      localStorage.removeItem("called-from-redeem")
      if (res?.success) {
        console.log("redeem balance", balance)
        const bal = localStorage.getItem(`${triaAccount?.triaName}-balance`)
        updateBalance(parseFloat(bal || "1000") - 100)
        setFetchBalance(true)
      }
    }
  }
  const handleLogout = async () => {
    impactOccurred("medium")

    if (guestLogin) {
      showAuthModal()
      setShowMenu(false)
      setShowLoginModal(true)
    } else {
      await logout()
      router.push("/")
    }
  }

  const handleTopUp = () => {
    setBalance((prevBalance) => prevBalance + 1000)
    localStorage.setItem(
      `${triaAccount?.triaName}-balance`,
      `${balance + 1000}`
    )
    showToast(
      "Coins Added!",
      "1000 test coins added to your account successfully! 🚀",
      "message"
    )
    setTimeout(() => {
      setIsVisible(false)
    }, 2000)
  }
  // Get Calls
  const getUserAssets = async (triaName: string) => {
    const response = await userController.getAssetDetails({
      chain: { chainName: "POLYGON" },
      triaName,
      type: "AA",
      tokenAddress: "0x1eeb2910c9f2e1e60294271634832824b159f61a",
    })
    setChipsBalance(response?.data?.balanceInTokens)
    console.log("getAssetDetail response", response?.data?.balanceInTokens)
  }
  const getTriaImage = async (item: any) => {
    console.log(
      "calling getriaImage",
      `${process.env.NEXT_PUBLIC_SDK_BASE_URL}/api/v2/user/getAvatarByTriaName?triaNames=${item}`
    )
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SDK_BASE_URL}/api/v2/user/getAvatarByTriaName?triaNames=${item}`,
      {
        method: "GET",
      }
    )

    const res = await resp.json()

    setBgColor(res?.response[item]?.[0]?.background)
    setAvatar(res?.response[item]?.[0]?.avatar)
  }
  const getTotalBalance = async (triaName: string) => {
    setTriaBalanceLoading(true)
    const response = await userController.getTotalBalance(triaName)
    console.log("total balance response", response?.data?.balance)
    setTriaBalance(response?.data?.balance)
    setTriaBalanceLoading(false)
  }

  useEffect(() => {
    const account = getAccount()

    if (!account?.triaName && !guestLogin) {
      router.push("/")
    }
    if (account?.triaName) {
      setTriaAccount(account)
      getTriaImage(account?.triaName)
      getTotalBalance(account?.triaName)
    }
  }, [getAccount, guestLogin])

  useEffect(() => {
    let intervalId: NodeJS.Timeout
    let timeoutId: NodeJS.Timeout

    if (fetchBalance) {
      // Set a timeout of 5 seconds before starting the process
      timeoutId = setTimeout(() => {
        // Start the interval after 5 seconds
        intervalId = setInterval(() => {
          if (fetchCallCount < 5) {
            getUserAssets(triaAccount?.triaName || "")
            setFetchCallCount((prevCount) => prevCount + 1)
          } else {
            // Stop the interval after 10 seconds
            clearInterval(intervalId)
            setFetchBalance(false)
            setFetchCallCount(0)
          }
        }, 1000) // Run every 1 second
      }, 5000) // Wait for 5 seconds before starting
    }

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
    }
  }, [fetchBalance, fetchCallCount, getUserAssets])
  useEffect(() => {
    getUserAssets(triaAccount?.triaName || "")
  }, [triaAccount?.triaName])
  const wheelData = React.useMemo(
    () =>
      wheelNumbers.numbers.map((number) => ({
        option: number,
        style: {
          backgroundColor:
            wheelNumbers.colors[number as keyof typeof wheelNumbers.colors] ||
            "gray",
          textColor: "white",
        },
      })),
    []
  )
  useEffect(() => {
    if (router.isReady && (triaAccount || guestLogin)) {
      let initialBalance: string | null
      if (guestLogin) {
        initialBalance = localStorage.getItem(`guest-balance`)
      } else {
        if (localStorage.getItem(`${triaAccount?.triaName}-balance`)) {
          initialBalance = localStorage.getItem(
            `${triaAccount?.triaName}-balance`
          )
        } else {
          initialBalance = localStorage.getItem(`guest-balance`)
        }
      }

      updateBalance(parseFloat(initialBalance || "1000"))
      setIsLoading(false)
    }
  }, [router.isReady, router.query.balance, triaAccount, guestLogin])
  useEffect(() => {
    if (userState?.success && guestLogin) {
      localStorage.removeItem("guestLogin")
      const balance = localStorage.getItem(`guest-balance`)
      setBalance(parseFloat(balance || "1000"))
      localStorage.removeItem(`${userState?.account?.triaName}-balance`)
      setBalance(parseFloat(balance || "1000"))
      localStorage.setItem(
        `${userState?.account?.triaName}-balance`,
        balance || "1000"
      )
      window.location.reload()
    }
  }, [userState])
  useEffect(() => {
    if (calledFromRedeem && triaAccount && isReady) {
      handleRedeem()
    }
  }, [calledFromRedeem, triaAccount, isReady])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div
      id='roulette-page'
      className={`flex flex-col items-center justify-center pt-[40px] px-[20px] min-h-[100vh]`}
      //
      ref={scrollableRef}
    >
      {/* <Toaster /> */}
      <MemoizedToast
        type={type}
        title={title}
        message={message}
        isVisible={isVisible}
        // onHide={hideToast}
        setIsVisible={setIsVisible}
      />
      {showLoginModal && (
        <div className='z-[200]'>
          {" "}
          <TriaAuthModal />{" "}
        </div>
      )}
      {showMenu && (
        <>
          <div
            className='w-[100vw] fixed top-0 left-0 h-[100vh] bg-transparent'
            onClick={() => {
              setShowMenu(false)
            }}
          />
          <MenuPopup
            avatar={{ avatar: avatar, bg: bgColor }}
            account={triaAccount}
            triaBalance={triaBalance}
            handleLogout={handleLogout}
            handleTopUp={handleTopUp}
            triaBalanceLoading={triaBalanceLoading}
          />
        </>
      )}
      <Topbar
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        guestLogin={guestLogin}
        scrollableRef={scrollableRef}
        avatar={{ bgColor: bgColor, avatar }}
        chipsBalance={chipsBalance}
      />
      <div className={`flex flex-col overflow-y-auto items-center`}>
        <DynamicWheel
          mustSpin={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={handleSpinComplete}
        />
        <BettingTable
          onBetPlaced={handleBetPlaced}
          balance={balance}
          onRedeem={handleRedeem}
        />
      </div>
    </div>
  )
}
