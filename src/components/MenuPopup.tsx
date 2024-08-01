import { copyToClipboard, formatAddress, formatTriaName } from "@/utils"
import {
  TriaAuthModal,
  useTelegramMiniApp,
  useTriaAuth,
} from "@tria-sdk/authenticate-react"
import { Account } from "@tria-sdk/connect"
import { UserController } from "@tria-sdk/core"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
interface Chain {
  chainName: string
  logo: string
  type: string
}
const MenuPopup = ({
  avatar,
  account,
  triaBalance,
  handleLogout,
  handleTopUp,
}: {
  avatar?: { avatar?: string; bg?: string }
  account?: Account
  triaBalance?: number
  handleLogout: () => void
  handleTopUp: () => void
}) => {
  const router = useRouter()
  const guestLogin =
    typeof localStorage != "undefined"
      ? localStorage.getItem("guestLogin")
      : null

  const [showAddress, setShowAddress] = useState<Boolean>(false)
  const [eoaChains, setEoaChains] = useState<Chain[]>()
  const [aaChains, setAaChains] = useState<Chain[]>()
  const [copied, setIsCopied] = useState(false)
  const [copiedText, setCopiedText] = useState("")
  const { impactOccurred } = useTelegramMiniApp()
  const toggleShowAddress = () => {
    impactOccurred("light")
    setShowAddress(!showAddress)
  }

  const userController = new UserController(
    process.env.NEXT_PUBLIC_SDK_BASE_URL
  )
  const getNetworks = async () => {
    const eoaChainsResponse: any = await userController.getAllNetworks("EOA")
    const aaChainsResponse: any = await userController.getAllNetworks("AA")

    setEoaChains(
      eoaChainsResponse?.networks
        ?.filter((chain: Chain) => chain.type === "mainnet")
        ?.slice(0, 10)
    )
    setAaChains(
      aaChainsResponse?.networks
        ?.filter((chain: Chain) => chain.type === "mainnet")
        ?.slice(0, 10)
    )
  }

  useEffect(() => {
    if (userController) {
      getNetworks()
    }
  }, [])
  const handleCopyClick = (item: string) => {
    impactOccurred("soft")
    setIsCopied(copyToClipboard(item)?.copied)
    setCopiedText(copyToClipboard(item)?.text || "")
  }
  useEffect(() => {
    if (copied) {
      setTimeout(() => setIsCopied(false), 4000)
    }
  }, [copied])
  return (
    <div className='w-[250px] h-auto rounded-[12.5px] border-solid border-[0.8px] border-[#bed4f326] fixed top-[70px] left-[20px] z-50 bg-[#031329]'>
      <div className='h-[56px] py-[12px] px-[16px] border-b-[0.8px] border-solid border-[#bed4f326] flex items-center justify-start gap-[12.5px]'>
        {guestLogin ? (
          <img src='/images/guestimage.png' className='w-[32px] h-[32px]' />
        ) : (
          <div
            className='w-[32px] h-[32px] flex items-center justify-center rounded-full'
            style={{ background: `${avatar?.bg || ""}` }}
          >
            <img src={avatar?.avatar} className='' />
          </div>
        )}
        {!guestLogin && (
          <div className='flex flex-col'>
            <p className='text-[13px] font-[600] leading-[120%]'>
              {account?.triaName && account?.triaName?.length > 15
                ? formatTriaName(account?.triaName)
                : account?.triaName}
            </p>
            <p className='text-[12px] text-[#808080] font-[600]'>{`$ ${triaBalance}`}</p>
          </div>
        )}
        {guestLogin && (
          <div className='flex flex-col'>
            <p className='text-[13px] font-[600] leading-[120%]'>Guest User</p>
            <p className='text-[10px] text-[#808080] font-[500]'>
              {" "}
              Login to Claim Rewards!
            </p>
          </div>
        )}
      </div>

      {!guestLogin && (
        <div
          className={`${
            showAddress
              ? "h-auto transform duration-500"
              : "h-[56px] transform duration-500"
          }  py-[12px] px-[16px] border-b-[0.8px] border-solid border-[#bed4f326] flex flex-col items-center justify-start`}
        >
          <div
            className='flex items-center justify-between w-full'
            onClick={toggleShowAddress}
          >
            <div className='flex flex-col gap-[6px]'>
              <p className='text-[13px] font-[600] leading-[120%]'>Addresses</p>
              <p className='text-[11px] font-[600] leading-[120%] text-[#808080]'>
                {" "}
                2 network addresses
              </p>
            </div>
            <img
              src='/images/arrow-down.svg'
              alt=''
              className={`${
                showAddress
                  ? "rotate-180 transform duration-200"
                  : "rotate-0 transform duration-200"
              } `}
            />
          </div>
          {showAddress && (
            <div className='w-full '>
              <div className='w-full h-[70px] py-[10px] flex items-center justify-between'>
                <div className='flex flex-col gap-[4px]'>
                  <p className='text-[13px] font-[600] leading-[120%]'>
                    Ethereum (EOA)
                  </p>
                  <p className='text-[13px] font-[600] text-[#808080] leading-[120%]'>
                    {formatAddress(account?.evm?.address || "")}
                  </p>
                  <div className='flex gap-[2px]'>
                    {eoaChains?.map((chain) => (
                      <div className='w-[14px] h-[14px] rounded-[2px]'>
                        <img
                          src={chain?.logo}
                          className='w-[14px] h-[14px] rounded-[2px]'
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className='w-[30px] h-[30px]'
                  onClick={() => handleCopyClick(account?.evm?.address || "")}
                >
                  {copied && copiedText === account?.evm?.address ? (
                    <p className='ml-[-10px] text-[#808080] text-[10px] font-[600]'>
                      Copied!
                    </p>
                  ) : (
                    <img src='/images/copy.svg' className='w-[20px] h-[20px]' />
                  )}
                </div>
              </div>
              <div className='w-full h-[70px] py-[10px] flex items-center justify-between'>
                <div className='flex flex-col gap-[4px]'>
                  <p className='text-[13px] font-[600] leading-[120%]'>
                    Ethereum (AA)
                  </p>
                  <p className='text-[13px] font-[600] text-[#808080] leading-[120%]'>
                    {formatAddress(account?.aa?.address || "")}
                  </p>
                  <div className='flex gap-[2px]'>
                    {aaChains?.map((chain) => (
                      <div className='w-[14px] h-[14px] rounded-[2px]'>
                        <img
                          src={chain?.logo}
                          className='w-[14px] h-[14px] rounded-[2px]'
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className='w-[30px] h-[30px]'
                  onClick={() => handleCopyClick(account?.aa?.address || "")}
                >
                  {copied && copiedText === account?.aa?.address ? (
                    <p className='ml-[-10px] text-[#808080] text-[10px] font-[600]'>
                      Copied!
                    </p>
                  ) : (
                    <img src='/images/copy.svg' className='w-[20px] h-[20px]' />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {!guestLogin && (
        <div
          className='h-[56px] py-[12px] px-[16px] border-b-[0.8px] border-solid border-[#bed4f326] flex items-start justify-start gap-[4px] flex-col'
          onClick={handleTopUp}
        >
          <p className='text-[13px] font-[600] leading-[120%] text-[#34C759]'>
            Add Coins
          </p>
          <p className='text-[11px] font-[600] leading-[120%] text-[#808080]'>
            {" "}
            Topup of 1000 coins!
          </p>
        </div>
      )}
      <div
        className={`h-[56px] ${
          guestLogin ? "text-[#34C759]" : "text-[#F55C5C]"
        }  py-[12px] px-[16px] border-b-[0.8px] border-solid border-[#bed4f326] flex items-center justify-between`}
        onClick={handleLogout}
      >
        <div className='flex flex-col gap-[6px]'>
          <p className='text-[13px] font-[600] leading-[120%]'>
            {guestLogin ? "Sign In" : "Sign Out"}
          </p>
          {!guestLogin && (
            <p className='text-[11px] font-[600] leading-[120%] text-[#808080]'>
              {" "}
              {`from  ${
                account?.triaName && account?.triaName?.length > 15
                  ? formatTriaName(account?.triaName)
                  : account?.triaName
              }`}
            </p>
          )}
        </div>
        <img src='/images/logout.svg' alt='' />
      </div>
    </div>
  )
}

export default MenuPopup
