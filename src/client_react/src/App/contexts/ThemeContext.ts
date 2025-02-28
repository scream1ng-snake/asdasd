import { createContext } from "react";
import { ThemeType } from "../theme/theme";

export const ThemeContext = createContext({
  switchTheme: (theme: ThemeType) => { },
  theme: '',
});