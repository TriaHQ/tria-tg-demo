interface Props {
  align?: "left" | "right"
}
const SingleLine: React.FC<Props> = ({ align = "right" }) => {
  return (
    <div className='h-[15px] relative animate-pulse'>
      <div
        className={`w-[100px] h-3  ${align}-0  absolute bg-gray-300 rounded-[17px]`}
      />
    </div>
  )
}
export default SingleLine
