import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

import { RouterProvider } from 'react-router-dom';
import router from './router/index';
// Redux
import { Provider } from 'react-redux';
import { store, persistor } from './store/index';
import { PersistGate } from 'redux-persist/integration/react';

// Loader context
import { LoadingProvider } from "./context/LoadingContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <PersistGate persistor={persistor}>
          <Provider store={store}>
            <LoadingProvider>
              <RouterProvider router={router} />
            </LoadingProvider>
          </Provider>
        </PersistGate>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
