import { ReactNode } from "react";

export type WithChildren = {
  children?: ReactNode
}

export type useLayoutContextProps = {
  isLoadingScreen: boolean;
  setIsLoadingScreen: (isLoading: boolean) => void;
};

export const initialState: useLayoutContextProps = {
  isLoadingScreen: false,
  setIsLoadingScreen: () => {},
};
