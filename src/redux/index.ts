import { createStore } from "redux";
import { rootReducer } from "./reducer/root-reducer";

const Store = createStore(rootReducer);

export default Store;
