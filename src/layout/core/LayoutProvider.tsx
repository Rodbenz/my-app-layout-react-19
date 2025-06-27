import { createContext, useContext, useState } from "react";
import { initialState, useLayoutContextProps, WithChildren } from "./model";

const LayoutContext = createContext<useLayoutContextProps>(initialState);

const LayoutProvider = ({ children }: WithChildren) => {
  const [isLoadingScreen, setIsLoadingScreen] = useState(initialState.isLoadingScreen);

  const value = {
    isLoadingScreen,
    setIsLoadingScreen,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};
const useLayout = () => useContext(LayoutContext);

export { LayoutProvider, useLayout };
