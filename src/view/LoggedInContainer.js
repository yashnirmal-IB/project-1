import { Route, Routes, useNavigate } from "react-router-dom";
import Customers from "../components/Customers";
import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Upload from "../components/Upload";

export default function LoggedInContainer() {
  const loggedUser = useSelector((state) => state.loggedUser.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedUser) {
      navigate("/login");
    }
  }, [loggedUser, navigate]);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="w-full h-[calc(100%-60px)] flex">
        <div className="hidden lg:flex">
          <Sidebar />
        </div>
        <div className="w-full h-full px-4 pt-6 md:px-6 lg:px-8 overflow-scroll">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
          <div className="w-full py-4 flex items-center justify-center text-sm text-gray-400 mt-10">
            <p>Comapny Copyright</p>
          </div>
        </div>
      </div>
    </div>
  );
}
