// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider } from 'react-router/dom';
import { createRuntime } from '../../src/app/runtime';
import { createTestRouter } from '../../src/app/router';
import { WorkspaceContext } from '../../src/app/workspace-context';
import { ErrorBoundary } from '../../src/ui/error-boundary';

async function mount(path = '/today') {
  const runtime = createRuntime();
  render(<WorkspaceContext.Provider value={runtime}><RouterProvider router={createTestRouter(runtime, [path])} /></WorkspaceContext.Provider>);
  await screen.findByRole('main');
  return runtime;
}

describe('interfaccia collegata ai casi d’uso', () => {
  it('aggiorna una task e il riepilogo, poi la ripristina con Undo', async () => {
    const user = userEvent.setup();
    await mount();
    const task = await screen.findByRole('checkbox', { name: 'Definire il prossimo passo' });
    await user.click(task);
    expect(task).toBeChecked();
    expect(screen.getByRole('progressbar', { name: 'Task completate oggi' })).toHaveAttribute('value', '2');
    await user.click(screen.getByRole('button', { name: 'Annulla ultima operazione' }));
    expect(task).not.toBeChecked();
  });

  it('rende esplicito l’ambiente sintetico e cambia tema senza cambiare record', async () => {
    const user = userEvent.setup();
    const runtime = await mount();
    const before = runtime.repository.getSnapshot();
    expect(screen.getByText('Dati sintetici · solo memoria')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Attiva tema chiaro' }));
    expect(document.querySelector('.app')).toHaveAttribute('data-theme', 'light');
    expect(runtime.repository.getSnapshot()).toBe(before);
  });

  it('rinomina con conferma visibile e Undo senza perdere i collegamenti', async () => {
    const user = userEvent.setup();
    const runtime = await mount('/projects/orione');
    const field = await screen.findByRole('textbox', { name: 'Nome del progetto' });
    await user.clear(field);
    await user.type(field, 'Nuova direzione');
    await user.click(screen.getByRole('button', { name: 'Aggiorna nome' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Nuova direzione' })).toBeVisible();
    expect(screen.getByText(/Nome aggiornato. Modifica solo in memoria/)).toBeVisible();
    expect(runtime.repository.getSnapshot().data.tasks[0]?.projectId).toBe('orione');
    await user.click(screen.getByRole('button', { name: 'Annulla ultima operazione' }));
    expect(field).toHaveValue('Progetto Orione');
  });

  it('gestisce una destinazione inesistente e un progetto mancante', async () => {
    await mount('/projects/mancante');
    expect(await screen.findByRole('heading', { name: 'Progetto non trovato' })).toBeVisible();
    expect(within(screen.getByRole('alert')).getByRole('link', { name: 'Vai ai progetti' })).toBeVisible();
  });

  it('intercetta un errore di rendering senza esporre lo stack', () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Broken(): never { throw new Error('errore interno riservato'); }
    render(<ErrorBoundary><Broken /></ErrorBoundary>);
    expect(screen.getByRole('alert')).toHaveTextContent('LifeOS non riesce ad aprirsi');
    expect(screen.queryByText(/errore interno riservato/)).not.toBeInTheDocument();
    logger.mockRestore();
  });
});
