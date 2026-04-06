"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  appTitle: string;
}

interface State {
  hasError: boolean;
}

export class WindowErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.appTitle}] render error:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 bg-parchment p-6 text-center">
          <AlertTriangle size={32} strokeWidth={1.5} className="text-amber" />
          <p className="font-body text-sm text-deep-brown">
            Something went wrong in {this.props.appTitle}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded-md border border-deep-brown/12 bg-cream px-4 py-1.5 font-body text-sm font-medium text-deep-brown transition-colors hover:bg-parchment"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
