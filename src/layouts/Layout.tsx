
import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

export default function Layout(){
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1 mt-14 ">
        <Outlet />

      </main>
      {/* <Footer /> */}
    </div>
  );
}
