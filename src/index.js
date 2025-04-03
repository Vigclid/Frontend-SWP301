import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./Components/Themes/ThemeProvider.tsx";
import { AuthProvider } from "./Components/AuthenContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import "./SessionUtility/sessionUtils.js";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <GoogleOAuthProvider clientId="942686730302-38cl9bd98ca7acnf70ds0t7deebfeuu5.apps.googleusercontent.com">
            <App />
          </GoogleOAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
