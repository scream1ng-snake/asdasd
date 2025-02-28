import { createContext } from "react";
import { RootStore } from "../store";

const empty = null as unknown as RootStore
export const StoreContext = createContext<RootStore>(empty);