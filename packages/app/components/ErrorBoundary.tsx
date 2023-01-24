import React, { ReactNode } from 'react'
import { Button } from '@chakra-ui/react'
import { postJSON } from 'lib/utils'

export class ErrorBoundary extends React.Component<{
  children: ReactNode | ReactNode[]
}> {
  state: { hasError: boolean }
  constructor(public $props: { children: ReactNode | ReactNode[] }) {
    super($props)
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    // postJSON('/api/errors', { error, errorInfo })
    //   .then((res) => {})
    //   .catch((err) => {})
    // console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section>
          <h2>Something went wrong!</h2>
          <Button type="button" onClick={() => this.setState({ hasError: false })}>
            Try again?
          </Button>
        </section>
      )
    }

    // Return children components in case of no error
    return this.props.children
  }
}
