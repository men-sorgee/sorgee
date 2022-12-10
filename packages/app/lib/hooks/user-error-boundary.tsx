import React, { ReactNode } from 'react';
import { Button } from 'react-daisyui';
import { postJSON } from '../utils/client';

class ErrorBoundary extends React.Component<{
  children: ReactNode | ReactNode[];
}> {
  state: { hasError: boolean };
  constructor(props: { children: ReactNode | ReactNode[] }) {
    super(props);
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    postJSON('/api/errors', { error, errorInfo }).then((res) => {});
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <section>
          <h2>Oops, there was an error!</h2>
          <p>This error was reported to the develop for proper punishment.</p>
          <Button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </Button>
        </section>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default ErrorBoundary;
