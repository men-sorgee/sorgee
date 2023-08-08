import { useCallback, useRef, useState } from "react";

import { Button, ButtonProps, chakra, Spinner } from "@chakra-ui/react";

export type BusyButtonProps = ButtonProps & {
  onClick?: () => Promise<any> | any
  timeout?: number
  children: React.ReactNode | React.ReactNode[]
}

export const ButtonBusy = chakra(({ onClick, timeout = 5000, disabled, children, ...props }) => {
  const [busy, setBusy] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const handleClick = useCallback(() => {
    const clickPromise = () =>
      new Promise((resolve, reject) => {
        const promise = onClick?.call() || null
        if (promise && promise?.then) {
          promise.then(resolve).catch(reject)
        } else {
          if (buttonRef.current && buttonRef.current.type === 'submit') {
            buttonRef.current.closest('form')?.requestSubmit(buttonRef.current)
          }
        }
        setTimeout(() => {
          resolve(promise)
        }, timeout)
      })
    setBusy(true)
    clickPromise().catch(() => {
      setBusy(false)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy, onClick, timeout, setBusy])

  return (
    <>
      <Button ref={buttonRef} isDisabled={busy || disabled} onClick={handleClick} {...props}>
        {busy && <Spinner size="sm" mr={2} />} {children}
      </Button>
    </>
  )
})
