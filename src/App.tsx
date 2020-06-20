import React from "react";
import { Provider } from "react-redux";
import Spec from "./pages/spec-choose";
import Store from "./redux";
import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={Store}>
        <Spec />
      </Provider>
    </div>
  );
};

export default App;
