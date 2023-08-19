'use client'
import { useEffect, useRef, useState } from "react";

import { DecodeHintType, Result } from "@zxing/library";

export type ZxingOptions = {
  hints?: Map<DecodeHintType, any>
  constraints?: MediaStreamConstraints
  timeBetweenDecodingAttempts?: number
  onResult?: (result: Result) => void
  onError?: (error: Error) => void
}

export const useZxing = ({
  constraints = {
    audio: false,
    video: {
      facingMode: 'environment',
    },
  },
  hints,
  timeBetweenDecodingAttempts = 300,
  onResult = () => { },
  onError = () => { },
}: ZxingOptions = {}) => {
  const [reader, setReader] = useState(null);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    import("@zxing/library")
      .then(({ BrowserMultiFormatReader }) => {
        const instance = new BrowserMultiFormatReader(hints);
        instance.timeBetweenDecodingAttempts = timeBetweenDecodingAttempts;
        setReader(instance);
      })
  }, [hints, timeBetweenDecodingAttempts]);

  useEffect(() => {
    if (!ref.current || !reader) return;
    reader.decodeFromConstraints(constraints, ref.current, (result, error) => {
      if (result) onResult(result);
      if (error) onError(error);
    });
    return () => {
      reader.reset();
    };
  })

  return { ref };
};
