import Navbar from '@/components/public/layout/Navbar';
import Footer from '@/components/public/layout/Footer';
import CookieBanner from '@/components/public/layout/CookieBanner';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}
