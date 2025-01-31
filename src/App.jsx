import { RouterProvider } from 'react-router-dom';
import { useState, useEffect } from 'react';

import router from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
      <RouterProvider router={router} />
      </ScrollTop>
    </ThemeCustomization>
  );
}
 