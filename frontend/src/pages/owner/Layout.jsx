import NavbarOwner from "../../components/owner/NavbarOwner";
import Sidebar from "../../components/owner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";

const Layout = () => {

  const {isOwner,navigate} = useAppContext()

  useEffect(()=> {
    if(!isOwner) {
      navigate('/')
    }
  },[isOwner])
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavbarOwner />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 bg-white overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
