import React from 'react';
import { locale } from 'moment';
import './App.css';
import 'moment/locale/ru'
import { RootStore } from './store';
import { StoreProvider, ThemeProvider } from './providers';
import { RouterComponent } from './components';

const Store = new RootStore()
locale('ru');

function App() {
  return (
    <ThemeProvider>
      <StoreProvider store={Store}>
        <RouterComponent />
      </StoreProvider>
    </ThemeProvider>
  );
}

export default App;
