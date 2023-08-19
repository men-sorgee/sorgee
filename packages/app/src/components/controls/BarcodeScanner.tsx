
import { useZxing, ZxingOptions } from "hooks/use-zxing";

export const BarcodeScanner: React.FC<ZxingOptions> = ((options: ZxingOptions = {
  constraints: {
    audio: false,
    video: {
      facingMode: "environment",
    }
  },
  onResult: (result) => {
    console.log(result)
  },
  onError: (error) => {
    console.error(error)
  }
}) => {
  const { ref } = useZxing(options)
  return <video ref={ref} />;
}) 
