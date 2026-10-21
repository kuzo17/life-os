import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="fatal-error" role="alert">
      <h1>LifeOS non riesce ad aprirsi</h1>
      <p>Puoi ricaricare la pagina. In questa versione le modifiche in memoria andranno perse.</p>
      <button className="button" onClick={() => { window.location.reload(); }}>Ricarica</button>
    </main>;
    return this.props.children;
  }
}
