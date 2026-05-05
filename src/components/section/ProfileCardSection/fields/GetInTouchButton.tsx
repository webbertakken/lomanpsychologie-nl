import Link from 'next/link'
import { useAnimateToAnchorClickHandler } from '../../../animations/useAnimateToAnchorClickHandler'

interface Props {
  link: string
  text: string
}

const GetInTouchButton = ({ link, text }: Props): JSX.Element => {
  const onClick = useAnimateToAnchorClickHandler()

  return (
    <div className="pt-12 pb-8">
      <Link
        href={link}
        onClick={onClick}
        className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2 px-4 rounded-full"
      >
        {text}
      </Link>
    </div>
  )
}

export default GetInTouchButton
