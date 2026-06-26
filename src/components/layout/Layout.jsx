import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />
      <main className="relative z-0 flex-1 pt-[var(--navbar-height)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
