import { StoreContext } from "../contexts";
import { RootStore } from "../store";

export const StoreProvider: React.FC<{ 
  children: React.ReactNode, 
  store: RootStore
}> = ({ children, store }) => {
  
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
};