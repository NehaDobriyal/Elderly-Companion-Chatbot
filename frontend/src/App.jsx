import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import routes from './routes';
import Solace from './components/Solace';

const App = () => {
  const location = useLocation(); // Get the current location

  const isSolace = location.pathname === '/solace';

  return (
    <div>
      {/* Conditionally render Navbar based on current path */}
      {!isSolace && <Navbar />}

      {/* Main content */}
      {isSolace ? (
        <div style={{ display: 'flex', animation: 'fadeIn 2.0s' }}>
          <Solace />
        </div>
      ) : (
        <main>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
      )}

      {/* Conditionally render Footer based on current path */}
      {!isSolace && <Footer />}
    </div>
  );
};

export default App;