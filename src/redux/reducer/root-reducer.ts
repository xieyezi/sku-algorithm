import { combineReducers } from "redux";
import specReducer from "./spec-reducer";

export const rootReducer = combineReducers({
  spec: specReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
