interface Props {
  location: string;
}

const Location = ({ location }: Props): JSX.Element => {
  return <p className="text-sm font-medium text-neutral-500">{location}</p>;
};

export default Location;
