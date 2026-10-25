import './styles/tm23-frontend-images.css';
import './styles/tm21-images-placement.css';
import './styles/tm20-images.css';
import React
  from "react";

import ReactDOM
  from "react-dom/client";

import App
  from "./App";

import {
  AuthProvider
} from "./context/AuthContext";

import "./styles/variables.css";
import "./styles/global.css";
import "./styles/responsive.css";
import "./styles/modules.css";
import "./styles/business.css";
import "./styles/responsive-final.css";
import "./styles/portal.css";

ReactDOM.createRoot(
  document.getElementById(
    "root"
  ) as HTMLElement
).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
