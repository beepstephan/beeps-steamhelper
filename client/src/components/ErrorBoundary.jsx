import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-red-400">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Щось пішло не так</h1>
            <p>{this.state.error?.message || "Невідома помилка"}</p>
            <button
              className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Перезавантажити
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;