import Link from 'next/link';
import { useAnimateToAnchorClickHandler } from '../../../animations/useAnimateToAnchorClickHandler';

interface Props {
  link: string;
  text: string;
}

const GetInTouchButton = ({ link, text }: Props): JSX.Element => {
  const onClick = useAnimateToAnchorClickHandler();

  return (
    <Link href={link} onClick={onClick} className="button-primary">
      {text}
    </Link>
  );
};

export default GetInTouchButton;
