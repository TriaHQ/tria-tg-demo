"use client"
import React, { useState } from "react"
import tableLayout from "../data/tableLayout.json"
import styles from "./BettingTable.module.css"
import { useTelegramMiniApp } from "@tria-sdk/authenticate-react"

interface BettingTableProps {
  onBetPlaced: (
    number: number | null,
    randomBet: number | null,
    amount: number
  ) => void
  balance: number
  onRedeem: () => void
}

const BettingTable: React.FC<BettingTableProps> = ({
  onBetPlaced,
  balance,
  onRedeem,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [selectedBet, setSelectedBet] = useState<number | null>(null)
  const [selectedCoin, setSelectedCoin] = useState<number>(10)
  const [coinCount, setCoinCount] = useState<number>(1)
  const { impactOccurred } = useTelegramMiniApp()
  const handleNumberClick = (number: number) => {
    impactOccurred("light")
    setSelectedNumber(number)
    setSelectedBet(null)
  }

  const handleCoinSelection = (value: number) => {
    impactOccurred("light")
    setSelectedCoin(value)
    setCoinCount(1) // Reset coin count when changing coin value
  }

  const handleCoinCountChange = (increment: number) => {
    impactOccurred("light")
    const newCount = Math.max(1, coinCount + increment)
    if (newCount * selectedCoin <= balance) {
      setCoinCount(newCount)
    }
  }

  const handleBetPlacement = () => {
    if (selectedNumber !== null || selectedBet !== null) {
      const betAmount = selectedCoin * coinCount
      if (betAmount <= balance) {
        onBetPlaced(selectedNumber, selectedBet, betAmount)
      } else {
        alert("Insufficient balance!")
      }
    }
  }
  const handleRandomBetClicked = (betIndex: number) => {
    impactOccurred("light")
    setSelectedBet(betIndex)
    setSelectedNumber(null)
  }
  return (
    <div className={styles.bettingTableContainer}>
      <div className='py-[12px] my-[12px] text-[18px]'>
        <span className='text-[#c5c5c5] font-[500]'>Game points:</span>
        <span> </span>
        <span className='text-[#FFF] font-[700]'>{balance.toFixed(2)}</span>
      </div>
      <div className={styles.rouletteTable}>
        <div className={styles.zeroSection}>
          <button
            className={`${styles.numberButton} ${styles.greenButton}`}
            style={{
              background: `${selectedNumber === 0 ? "black" : "#008000"}`,
            }}
            onClick={() => {
              impactOccurred("light")
              handleNumberClick(0)
            }}
          >
            0
          </button>
        </div>
        <div className={styles.numbersSection}>
          {tableLayout.columns.map((column, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {column.map((number) => (
                <button
                  key={number}
                  onClick={() => handleNumberClick(number)}
                  className={`${styles.numberButton} ${
                    number % 2 === 0 ? styles.blackButton : styles.redButton
                  } ${selectedNumber === number ? styles.selected : ""}`}
                >
                  {number}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className={styles.betOptions}>
          <button
            className={styles.betOption}
            style={{ background: `${selectedBet === 1 ? "red" : "#008000"}` }}
            onClick={() => handleRandomBetClicked(1)}
          >
            1-18
          </button>
          <button
            className={styles.betOption}
            style={{ background: `${selectedBet === 2 ? "black" : "#008000"}` }}
            onClick={() => handleRandomBetClicked(2)}
          >
            EVEN
          </button>
          <button
            className={styles.betOption}
            style={{ background: `${selectedBet === 3 ? "red" : "#008000"}` }}
            onClick={() => handleRandomBetClicked(3)}
          >
            RED
          </button>
          <button
            className={styles.betOption}
            style={{ background: `${selectedBet === 4 ? "black" : "#008000"}` }}
            onClick={() => handleRandomBetClicked(4)}
          >
            BLACK
          </button>
          <button
            className={styles.betOption}
            style={{ background: `${selectedBet === 5 ? "red" : "#008000"}` }}
            onClick={() => handleRandomBetClicked(5)}
          >
            ODD
          </button>
          <button
            className={styles.betOption}
            style={{ background: `${selectedBet === 6 ? "black" : "#008000"}` }}
            onClick={() => handleRandomBetClicked(6)}
          >
            19-36
          </button>
        </div>
      </div>
      <div className='flex flex-col w-full items-center gap-[20px] mt-[40px]'>
        <div className='flex w-full items-center justify-center gap-[12px]'>
          {[10, 50, 100].map((value) => (
            <button
              key={value}
              className={`text-[18px] w-[90px] py-[12px] rounded-[10px] font-[600] text-[#fff] ${
                selectedCoin === value ? "scale-110 transform duration-200" : ""
              }`}
              onClick={() => handleCoinSelection(value)}
              style={{
                background: `${
                  selectedCoin === value
                    ? "linear-gradient(180deg, rgba(33, 204, 81, 0.80) 0%, rgba(22, 110, 85, 0.80) 100%)"
                    : "linear-gradient(180deg, rgba(33, 204, 81, 0.10) 0%, rgba(22, 110, 85, 0.10) 100%)"
                }`,
              }}
            >
              <div className=''>${value}</div>
            </button>
          ))}
        </div>
        <div
          className='py-[12px] px-[10px] flex gap-[16px] items-center justify-center rounded-[10px] text-[18px] font-[600]'
          style={{
            background:
              "linear-gradient(180deg, rgba(33, 204, 81, 0.10) 0%, rgba(22, 110, 85, 0.10) 100%)",
          }}
        >
          <button
            onClick={() => handleCoinCountChange(-1)}
            className='w-[30px] h-[30px] flex items-center justify-center rounded-full'
            style={{
              background: "linear-gradient(180deg, #21CC51 0%, #166E55 100%)",
            }}
          >
            -
          </button>
          <span>{coinCount}</span>
          <button
            onClick={() => handleCoinCountChange(1)}
            className='w-[30px] h-[30px] flex items-center justify-center rounded-full'
            style={{
              background: "linear-gradient(180deg, #21CC51 0%, #166E55 100%)",
            }}
          >
            +
          </button>
        </div>
        <div className='flex flex-col items-center justify-center w-full gap-[12px]'>
          <button
            onClick={handleBetPlacement}
            disabled={
              (selectedNumber === null && selectedBet === null) ||
              selectedCoin * coinCount > balance
            }
            className={`w-full py-[12px] rounded-[100px] text-[18px] font-[600]`}
            style={{
              background: `${
                (selectedNumber === null && selectedBet === null) ||
                selectedCoin * coinCount > balance
                  ? "#404040"
                  : "linear-gradient(180deg, #21CC51 0%, #166E55 100%)"
              }`,
            }}
          >
            Place Bet (${selectedCoin * coinCount})
          </button>
          <button
            onClick={onRedeem}
            disabled={balance < 100}
            className={`w-full py-[12px] rounded-[100px] text-[18px] font-[600] ${
              balance > 100 ? "bg-[#FFF] text-[#202020] " : "bg-[#404040]"
            }`}
          >
            Redeem ($100)
          </button>
        </div>
      </div>
    </div>
  )
}

export default BettingTable
