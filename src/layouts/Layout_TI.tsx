import { Outlet } from "react-router-dom";
import Header_2 from "@/componentes/Header_2";
import Sidebar from "@/componentes/Sidebar";


export default function Layout_TI() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header_2 />
      <main className="flex">
        <Sidebar />
        <div className="ml-0 md:ml-40 w-full mt-10  ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
