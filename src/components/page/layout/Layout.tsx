import NavBar from '../header/Header';
import Banner from '../banner/Banner';
import { BannerNotificationEntry } from '../../../types/banner';
import Footer from '../footer/Footer';

interface Props {
  children: JSX.Element;
  banner?: BannerNotificationEntry;
}

const Layout = ({ children }: Props): JSX.Element => {
  return (
    <div className="min-h-screen bg-brand-blush/60 bg-hero-gradient flex flex-col">
      <Banner />
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
