import { Button, ButtonProps, Spinner, chakra } from '@chakra-ui/react'
import { useState, useCallback } from 'react'

export type BusyButtonProps = ButtonProps & {
  onClick: () => Promise<any> | any
  timeout?: number
  children: React.ReactNode | React.ReactNode[]
}

export const BusyButton = chakra(
  ({ onClick, timeout = 10000, disabled, children, ...props }) => {
    const [busy, setBusy] = useState(false)

    const handleClick = useCallback(() => {
      const clickPromise = () =>
        new Promise((resolve, reject) => {
          const promise = onClick()
          if (promise.then) {
            promise.then(resolve).catch(reject)
          } else {
            setTimeout(() => {
              resolve(promise)
            }, timeout)
          }
        })
      setBusy(true)
      clickPromise().finally(() => {
        setBusy(false)
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [busy, onClick, timeout, setBusy])

    return (
      <>
        <Button
          onClick={() => handleClick()}
          {...props}
          isDisabled={busy || disabled}
        >
          {busy && <Spinner size="sm" mr={2} />} {children}
        </Button>
      </>
    )
  }
)
