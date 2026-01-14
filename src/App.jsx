import { Outlet, useLocation  } from "react-router-dom"
import { useEffect, useState } from "react";
import { subscribeToGlobalLoading } from "./api/loadingStore";
import Loader from "./components/Common/Loader";
import Navbar from "./components/Layout/Navbar"

function App() {
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  const hideNavbar = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const unsubscribe  = subscribeToGlobalLoading(setLoading);

    // cleanup on unmount
    return unsubscribe;
  },[]);

  return (
    <>
      {!hideNavbar && <Navbar/>}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
          <Loader/>
        </div>
      )}
      <Outlet/>
    </>
  )
}

export default App
