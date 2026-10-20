try {
  const {
    startApp
  } = await import('./app/bootstrap.mjs');
  startApp();
} catch (error) {
  console.error('LifeOS startup failed', error);
  const view = document.querySelector('#view');
  view.textContent = 'LifeOS non è riuscita ad avviarsi. Ricarica la pagina per riprovare.';
  view.setAttribute('role', 'alert');
  document.body.dataset.startupError = 'true';
}
