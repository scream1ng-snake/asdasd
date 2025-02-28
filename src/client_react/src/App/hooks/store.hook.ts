import { useContext } from "react";
import { StoreContext } from "../contexts";

export const useStore = () => useContext(StoreContext);