'use client'
import { useEffect, useMemo, useRef } from "react";

import {
  BrowserMultiFormatReader,
  DecodeHintType,
  Result
} from "@zxing/library";

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
  const ref = useRef<HTMLVideoElement>(null);

  const reader = useMemo<BrowserMultiFormatReader>(() => {
    const instance = new BrowserMultiFormatReader(hints);
    instance.timeBetweenDecodingAttempts = timeBetweenDecodingAttempts;
    return instance;
  }, [hints, timeBetweenDecodingAttempts]);

  useEffect(() => {
    if (!ref.current) return;
    reader.decodeFromConstraints(constraints, ref.current, (result, error) => {
      if (result) onResult(result);
      if (error) onError(error);
    });
    return () => {
      reader.reset();
    };
  }, [ref, reader, constraints, onResult, onError]);

  return { ref };
};
