import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./state/store";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const AppWrapper = () => {
  const theme = useSelector((state) => state.theme.value);

  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <StyledEngineProvider injectFirst>
              <App />
            </StyledEngineProvider>
          </BrowserRouter>
        </PersistGate>
      </ThemeProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>
);

reportWebVitals();
