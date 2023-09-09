import { createContext, useContext } from "react";

export type ViewHeightContextType = {
  viewHeight: string
}

export const ViewHeightContext = createContext<ViewHeightContextType>({
  viewHeight: '100vh'
})

export const useViewHeight = () => {
  return useContext(ViewHeightContext)
}
