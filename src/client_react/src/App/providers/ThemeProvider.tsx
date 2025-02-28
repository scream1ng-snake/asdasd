import { useEffect, useState } from 'react';
import { useTelegram } from '../hooks';
import { Logger } from '../utils';
import { ThemeContext } from '../contexts';
import { antdVariables, myVariables, tgVariables, Themes, ThemeType } from '../theme/theme';


const logger = new Logger('Theme-Provider')
export const ThemeProvider = ({ children }: haveChildren) => {
  const { colorScheme, isInTelegram } = useTelegram()

  const [theme, setTheme] = useState<ThemeType>(
    isInTelegram()
      ? colorScheme
      : getThemeFromLocalstorage()
  );

  const switchTheme = (theme: ThemeType) => {
    for (const Var of myVariables) {
      document.documentElement.style.setProperty(Var.cssVar, Var[theme])
    }
    if (!isInTelegram()) {
      setTheme(theme);
      for (const Var of tgVariables) {
        document.documentElement.style.setProperty(Var.cssVar, Var[theme])
      }
      localStorage.setItem('theme', theme)
      logger.log('тема переключена на ' + theme)
    }
    // antd-mobile
    // сетаем антд переменные темы вот так:
    document.documentElement.setAttribute(
      'data-prefers-color-scheme',
      theme
   )
   for (const Var of antdVariables) {
      document.documentElement.style.setProperty(Var.cssVar, Var[theme])
   }
  }
  useEffect(() => {
    switchTheme(theme)
  }, []) // eslint-disable-line

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const getThemeFromLocalstorage = () =>
  window.localStorage.getItem("theme") === null
    ? Themes.light
    : window.localStorage.getItem("theme") === Themes.dark
      ? Themes.dark
      : Themes.light

