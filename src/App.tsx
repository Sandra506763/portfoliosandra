import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/Portfolio.css";

const App: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <div className="top-section">
    
        {!isHome && <Header />}

        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default App;