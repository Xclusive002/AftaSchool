import React from 'react';

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<{ children?: React.ReactNode }, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  constructor(private readonly componentProps: { children?: React.ReactNode }) {
    super(componentProps);
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <section className="max-w-lg w-full rounded-2xl border border-rose-700/60 bg-slate-900 p-6">
            <h1 className="text-lg font-bold text-white">The application could not load</h1>
            <p className="mt-2 text-sm text-slate-300">Refresh the page after checking the server logs.</p>
            <pre className="mt-4 overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-rose-300">{this.state.error.message}</pre>
            <button onClick={() => window.location.reload()} className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950">Reload application</button>
          </section>
        </main>
      );
    }

    return this.componentProps.children;
  }
}
