import wheelNumbers from "../data/wheelNumbers.json"
export const formatTriaName = (address: string) => {
  return address?.slice(0, 5) + "....." + address?.slice(-10)
}
export const formatAddress = (address: string) => {
  return address?.slice(0, 6) + "....." + address?.slice(-4)
}
export const copyToClipboard = (text: string | undefined) => {
  let copied = false
  if (text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copied = true
      })
      .catch((error) => {
        console.error("Failed to copy: ", error)
      })
  }
  return { copied: true, text }
}
export function getColorForNumber(number: number) {
  // Convert number to string to ensure proper key lookup
  const key = number.toString()

  // Check if the number exists in the colors object
  if (key in wheelNumbers.colors) {
    // @ts-ignore
    return wheelNumbers.colors[key]
  } else {
    return "Number not found"
  }
}
