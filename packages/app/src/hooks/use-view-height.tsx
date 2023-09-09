import { createContext, useContext, useEffect, useState } from "react";

export type ViewHeightContextType = {
  subtract: number
}

export const ViewHeightContext = createContext<ViewHeightContextType>({
  subtract: 0
})

export const useViewHeight = () => {
  const [viewHeight, setViewHeight] = useState('100vh')
  const isIos = navigator.userAgent.match(/(iPod|iPhone|iPad)/) ? true : false
  const { subtract } = useContext(ViewHeightContext)

  useEffect(() => {
    if (isIos) {
      setViewHeight(`calc(80vh - ${subtract}px)`)
    } else {
      setViewHeight(`calc(100dvh - ${subtract}px)`)
    }
  }, [isIos, subtract])

  return { viewHeight }

}
