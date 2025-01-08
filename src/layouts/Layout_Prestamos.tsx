import { Outlet } from "react-router-dom";
import Header_Prestamos from "@/componentes/Header_Prestamos";

export default function Layout_TI() {

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header_Prestamos />
      <main className="flex">
        <div className=" w-full mt-10  ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
