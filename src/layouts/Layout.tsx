
import Header from '@/componentes/Header';
import { Outlet } from 'react-router-dom';

export default function Layout(){
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        <Outlet />

      </main>
      {/* <Footer /> */}
    </div>
  );
}
