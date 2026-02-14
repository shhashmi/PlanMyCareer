import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

const rootElement = document.getElementById('root')!;

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If the page was pre-rendered, hydrate to attach event handlers to existing DOM.
// Otherwise, render fresh (dev mode or non-pre-rendered pages).
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
