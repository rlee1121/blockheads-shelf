import "./App.css";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import ConnectedContent from "./ConnectedContent";
import StatusBar from "./StatusBar";
import TitleBar from "./TitleBar";

import { BrowserRouter as Router } from "react-router-dom";

function getLibrary(provider: any, connector: any) {
  return new Web3Provider(provider);
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <div className="App">
          <StatusBar />
          <hr />
          <TitleBar />
          <hr />
          <ConnectedContent />
        </div>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;
