import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header_2 from "@/components/Header_2";


export default function Layout_Login() {

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
