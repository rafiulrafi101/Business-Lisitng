import { Outlet } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const Layout = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Header />
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
