import CopyrightAndLinksLayer from './CopyrightAndLinksLayer'

interface Props {}

const Footer = ({}: Props): JSX.Element => {
  return (
    <footer role="contentinfo" className="py-10 bg-black mt-auto">
      <div className="px-10 mx-auto max-w-7xl">
        {/*<LogoAndSocialLayer />*/}
        <CopyrightAndLinksLayer />
      </div>
    </footer>
  )
}

export default Footer
