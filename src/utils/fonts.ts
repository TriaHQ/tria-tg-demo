// fonts.ts
import { Montserrat } from "next/font/google"

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "500", "700"], // Add or remove weights as needed
})
