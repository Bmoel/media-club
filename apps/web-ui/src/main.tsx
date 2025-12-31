import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage.tsx';
import MediaPage from './pages/MediaPage.tsx';

// Font imports for material ui
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { store } from './store.ts';

// Main css import
import './css/app.css';
import MenuWrapper from './components/MenuWrapper.tsx';
import RegistrationPage from './pages/RegistrationPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<MenuWrapper><HomePage /></MenuWrapper>} />
          <Route path="/media/:id" element={<MenuWrapper><MediaPage /></MenuWrapper>} />
          <Route path="/registration" element={<MenuWrapper><RegistrationPage /></MenuWrapper>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
