import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "@/styles/index.css";

const savedTheme = window.localStorage.getItem("theme");
const initialIsDark = savedTheme ? savedTheme === "dark" : true;
document.body.classList.toggle("dark", initialIsDark);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
