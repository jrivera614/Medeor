"use client";
import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Medeor Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: "'DM Sans', system-ui, sans-serif",
          background: "#0a0a0f", color: "#e8e8ed",
          minHeight: "100dvh", display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: 24
        }}>
          <div style={{ textAlign: "center", maxWidth: 360 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#9888;</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Something went wrong
            </div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 20, lineHeight: 1.6 }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{
                background: "#8b5cf6", border: "none", color: "#fff",
                padding: "10px 24px", borderRadius: 10, fontSize: 14,
                fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
