import React, { ReactNode } from "react";

import { Box, Button } from "@chakra-ui/react";

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
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Box mx={[4, 4, 0]}>
          <h2>Something went wrong!</h2>
          <Button type="button" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Box>
      )
    }

    // Return children components in case of no error
    return this.props.children
  }
}
