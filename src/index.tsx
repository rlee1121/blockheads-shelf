import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChainId, DAppProvider } from "@usedapp/core";
import MobileStylesheets from "./MobileStylesheets";

const config = {
  readOnlyChainId:
    window.location.hostname === "shelf.blockheads.family"
      ? ChainId.Mainnet
      : ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Mainnet]:
      "https://mainnet.infura.io/v3/0d5355d2f5764f35801138abefcc8e00",
    [ChainId.Rinkeby]:
      "https://rinkeby.infura.io/v3/0d5355d2f5764f35801138abefcc8e00",
  },
};
console.log({config})

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
      <MobileStylesheets />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
