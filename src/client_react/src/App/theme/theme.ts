export const Themes = {
  light: 'light',
  dark: 'dark'
} as const;

export type ThemeType = typeof Themes[keyof typeof Themes];


type Var = { cssVar: string, dark: string, light: string }

export const tgCssVars = {
  '--tg-color-scheme': '--tg-color-scheme',
  '--tg-theme-hint-color': '--tg-theme-hint-color',
  '--tg-theme-link-color': '--tg-theme-link-color',
  '--tg-theme-button-color': '--tg-theme-button-color',
  '--tg-theme-bg-color': '--tg-theme-bg-color',
  '--tg-theme-text-color': '--tg-theme-text-color',
  '--tg-theme-button-text-color': '--tg-theme-button-text-color',
  '--tg-theme-secondary-bg-color': '--tg-theme-secondary-bg-color',
} as const
/** телеграммные переменные, чтобы в десктопной версии тоже были какие-то цвета */
export const tgVariables: Var[] = [
  { cssVar: tgCssVars["--tg-color-scheme"], dark: 'dark', light: 'light' },
  { cssVar: tgCssVars['--tg-theme-hint-color'], dark: '#708499', light: '#999999' },
  { cssVar: tgCssVars['--tg-theme-link-color'], dark: '#168ACD', light: '#73B9F5' },
  { cssVar: tgCssVars['--tg-theme-button-color'], dark: '#2F6EA5', light: '#40A7E3' },
  { cssVar: tgCssVars['--tg-theme-button-text-color'], dark: '#FFFFFF', light: '#FFFFFF' },
  { cssVar: tgCssVars['--tg-theme-bg-color'], dark: '#17212B', light: '#FFFFFF' },
  { cssVar: tgCssVars['--tg-theme-secondary-bg-color'], dark: '#232E3C', light: '#EDF1F4' },
  { cssVar: tgCssVars['--tg-theme-text-color'], dark: '#F5F5F5', light: '#222222' } 
]

export const myCssVars = {
  '--accent-color': '--accent-color',
  '--громкий-текст': '--громкий-текст',
  '--тихий-текст': '--тихий-текст',
} as const

/** кастомные переменные */
export const myVariables = [
  { cssVar: myCssVars['--accent-color'], dark: '#C516FF', light: '#C516FF' },
  { cssVar: myCssVars['--громкий-текст'], dark: '#FFFFFF', light: '#000000' }, 
  { cssVar: myCssVars['--тихий-текст'], dark: '#BABABA', light: '#836868' }, 
]

export const antdCssVars = {
  '--adm-color-background': '--adm-color-background',
  '--adm-color-primary': '--adm-color-primary',
  '--adm-color-box': '--adm-color-box',
  '--adm-font-family': '--adm-font-family',
} as const


export const themeVars = {
  tgScheme: 'var(' + tgCssVars['--tg-color-scheme'] + ')',
  tgHintColor: 'var(' + tgCssVars['--tg-theme-hint-color'] + ')',
  tgLinkColor: 'var(' + tgCssVars['--tg-theme-link-color'] + ')',
  tgButtonColor: 'var(' + tgCssVars['--tg-theme-button-color'] + ')',
  tgTextColor: 'var(' + tgCssVars['--tg-theme-text-color'] + ')',
  tgBgColor: 'var(' + tgCssVars['--tg-theme-bg-color'] + ')',
  tgButtonTextColor: 'var(' + tgCssVars['--tg-theme-button-text-color'] + ')', 
  tgSecondaryBgColor: 'var(' + tgCssVars['--tg-theme-secondary-bg-color'] + ')', 

  myAccentColor: "var(" + myCssVars['--accent-color'] + ')',
  myLoudText: "var(" + myCssVars['--громкий-текст'] + ')',
  mySilentText: "var(" + myCssVars['--тихий-текст'] + ')',

  admBg: 'var(' + antdCssVars['--adm-color-background'] + ')',
  admPrimary: 'var(' + antdCssVars['--adm-color-primary'] + ')',
  admBox: 'var(' + antdCssVars['--adm-color-box'] + ')',
  admFont: 'var(' + antdCssVars['--adm-font-family'] + ')',
}

// меняем цвета в библиотеке
export const antdVariables: Var[] = [
  { cssVar: antdCssVars['--adm-color-background'], dark: themeVars.tgBgColor, light: themeVars.tgBgColor }, 
  { cssVar: antdCssVars['--adm-color-primary'], dark: themeVars.myAccentColor, light: themeVars.myAccentColor }, 
  { cssVar: antdCssVars['--adm-color-box'], dark: themeVars.tgSecondaryBgColor, light: themeVars.tgSecondaryBgColor }, 
  { cssVar: antdCssVars['--adm-font-family'], dark: 'Roboto, sans-serif', light: 'Roboto, sans-serif' }
]