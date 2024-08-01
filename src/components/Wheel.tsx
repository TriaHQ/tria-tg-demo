"use client"
import React, { useEffect } from "react"
import { Wheel } from "react-custom-roulette"
import styles from "./Wheel.module.css"
interface WheelData {
  option: string
  style: {
    backgroundColor: string
    textColor: string
  }
}
const wheelData = [
  { option: "0", style: { backgroundColor: "green", textColor: "white" } },
  { option: "32", style: { backgroundColor: "red", textColor: "white" } },
  { option: "15", style: { backgroundColor: "black", textColor: "white" } },
  { option: "19", style: { backgroundColor: "red", textColor: "white" } },
  { option: "4", style: { backgroundColor: "black", textColor: "white" } },
  { option: "21", style: { backgroundColor: "red", textColor: "white" } },
  { option: "2", style: { backgroundColor: "black", textColor: "white" } },
  { option: "25", style: { backgroundColor: "red", textColor: "white" } },
  { option: "17", style: { backgroundColor: "black", textColor: "white" } },
  { option: "34", style: { backgroundColor: "red", textColor: "white" } },
  { option: "6", style: { backgroundColor: "black", textColor: "white" } },
  { option: "27", style: { backgroundColor: "red", textColor: "white" } },
  { option: "13", style: { backgroundColor: "black", textColor: "white" } },
  { option: "36", style: { backgroundColor: "red", textColor: "white" } },
  { option: "11", style: { backgroundColor: "black", textColor: "white" } },
  { option: "30", style: { backgroundColor: "red", textColor: "white" } },
  { option: "8", style: { backgroundColor: "black", textColor: "white" } },
  { option: "23", style: { backgroundColor: "red", textColor: "white" } },
  { option: "10", style: { backgroundColor: "black", textColor: "white" } },
  { option: "5", style: { backgroundColor: "red", textColor: "white" } },
  { option: "24", style: { backgroundColor: "black", textColor: "white" } },
  { option: "16", style: { backgroundColor: "red", textColor: "white" } },
  { option: "33", style: { backgroundColor: "black", textColor: "white" } },
  { option: "1", style: { backgroundColor: "red", textColor: "white" } },
  { option: "20", style: { backgroundColor: "black", textColor: "white" } },
  { option: "14", style: { backgroundColor: "red", textColor: "white" } },
  { option: "31", style: { backgroundColor: "black", textColor: "white" } },
  { option: "9", style: { backgroundColor: "red", textColor: "white" } },
  { option: "22", style: { backgroundColor: "black", textColor: "white" } },
  { option: "18", style: { backgroundColor: "red", textColor: "white" } },
  { option: "29", style: { backgroundColor: "black", textColor: "white" } },
  { option: "7", style: { backgroundColor: "red", textColor: "white" } },
  { option: "28", style: { backgroundColor: "black", textColor: "white" } },
  { option: "12", style: { backgroundColor: "red", textColor: "white" } },
  { option: "35", style: { backgroundColor: "black", textColor: "white" } },
  { option: "3", style: { backgroundColor: "red", textColor: "white" } },
  { option: "26", style: { backgroundColor: "black", textColor: "white" } },
]

interface RouletteWheelProps {
  mustSpin: boolean
  prizeNumber: number
  data: WheelData[]
  onStopSpinning: () => void
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({
  mustSpin,
  prizeNumber,
  data,
  onStopSpinning,
}) => {
  useEffect(() => {
    console.log("wheel rerendered!!")
  }, [])
  useEffect(() => {
    console.log("must spin triggered", mustSpin)
  }, [mustSpin])
  return (
    <div className={styles.wheelContainer}>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={wheelData}
        onStopSpinning={onStopSpinning}
        backgroundColors={["#FF0000", "#000000"]}
        textColors={["#ffffff"]}
        outerBorderColor='#FFD700'
        outerBorderWidth={10}
        innerRadius={0}
        innerBorderColor='#FFD700'
        innerBorderWidth={5}
        radiusLineColor='#FFD700'
        radiusLineWidth={2}
        fontSize={16}
        perpendicularText={true}
      />
    </div>
  )
}

export default RouletteWheel
