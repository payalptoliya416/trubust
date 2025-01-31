import { RouterProvider } from 'react-router-dom';
import { useState, useEffect } from 'react';

import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  useEffect(() => {
    const handleResize = () => {
      window.location.reload();
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ThemeCustomization>
      <ScrollTop>
        <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
