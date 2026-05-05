import { BannerNotificationEntry } from '../../../types/banner'
import Banner from '../banner/Banner'
import Footer from '../footer/Footer'
import NavBar from '../header/Header'

interface Props {
  children: JSX.Element
  banner?: BannerNotificationEntry
}

const Layout = ({ children }: Props): JSX.Element => {
  return (
    <div className="font-serif min-h-screen flex flex-col">
      <Banner />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
