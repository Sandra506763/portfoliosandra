import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/Portfolio.css';

const App: React.FC = () => {
  return (
    <>
      <div className="top-section">
        <Outlet />
        <Header />
      </div>
      <Footer />
    </>
  );
};

export default App;