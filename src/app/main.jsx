import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "@/styles/index.css";

const savedTheme = window.localStorage.getItem("theme");
const initialIsDark = savedTheme ? savedTheme === "dark" : true;
document.body.classList.toggle("dark", initialIsDark);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
