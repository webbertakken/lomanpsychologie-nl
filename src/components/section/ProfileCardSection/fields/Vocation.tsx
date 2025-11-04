interface Props {
  vocation: string;
}

const Vocation = ({ vocation }: Props): JSX.Element => {
  return <p className="text-lg font-semibold text-brand-denim">{vocation}</p>;
};

export default Vocation;
