import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

// Styles and components
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./components/ui/provider";

// Redux store
import store from "./store";

// Performance monitoring
import reportWebVitals from "./reportWebVitals";

// Create root element and render the application
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
);

// Performance monitoring (optional)
// To log results: reportWebVitals(console.log)
// To send to analytics endpoint: https://bit.ly/CRA-vitals
reportWebVitals();
