import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@pr80-app/ui/style'

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
