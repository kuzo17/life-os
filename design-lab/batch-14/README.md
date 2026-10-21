# LifeOS — base applicativa modulare (Batch 14)

**Stato:** prima separazione tecnica del laboratorio esistente. Non è ancora la migrazione funzionale completa della V1 e non sostituisce l’app in uso.

La priorità è rifattorizzare LifeOS esistente, preservando funzioni e dati. I prototipi precedenti restano materiale di riferimento per la futura interfaccia; non costituiscono prova di parità con V1.

## Cosa cambia realmente

- `index.html` contiene la shell e un solo punto di ingresso, senza programma o foglio di stile incorporato.
- Moduli ES con import/export espliciti separano navigazione, UI, viste e gestori per dominio.
- Lo store possiede i record canonici; le viste leggono snapshot immutabili. Tentare una mutazione diretta genera errore.
- I comandi lavorano su una bozza: validazione riuscita → commit; errore → nessuna modifica, notifica o voce Undo.
- Cartelle, progetti, task, Inbox, goals, ricorrenti, spese, note, inventario e lista movimenti usano lo stesso confine transazionale e Undo.
- I moduli dati non dipendono dall’interfaccia; i comandi sono verificabili senza browser.
- Nessun ponte globale su `window`, `eval`, dipendenza circolare o copia mutabile di task per calendario.
- Inbox → Nota conserva l’elemento sorgente fino alla conferma e gestisce anche ID stringa.
- Il focus torna al pulsante mobile dopo la rimozione di `inert` dal suo contenitore.

## Dove modificare cosa

| Responsabilità | Percorso |
|---|---|
| Avvio e gestione degli errori iniziali | `src/main.mjs`, `src/app/bootstrap.mjs` |
| URL, cronologia e navigazione | `src/app/router.mjs`, `src/app/shell.mjs` |
| Stato esclusivamente visivo | `src/app/ui-state.mjs` |
| Stato canonico, transazioni, Undo | `src/data/store.mjs` |
| Validazione dei record | `src/data/schema.mjs` |
| Dati sintetici isolati | `src/data/seed.mjs` |
| Comandi per dominio | `src/domains/commands/` |
| Schermate e input di ogni area | `src/domains/<area>/views.mjs`, `events.mjs` |
| Allenamento: sessione, catalogo, storico, progressione | `src/domains/fitos/` |
| Stile e temi esistenti | `styles/` |
| Verifica del comportamento e dei confini | `tests/` |

**Congelata dal consolidamento INC-01 del 21 ottobre 2026:** la sorgente attiva è [`app/`](../../app/README.md), con React/TypeScript/Vite. Il [registro di provenienza](../../docs/v2/increments/INC-01.md) distingue materiale recuperato e capacità ancora da trasferire. Questa batch resta un riferimento storico; nessuna nuova batch deve ricopiare l’app completa.

## Avvio e verifiche

Richiede Node >=22; il codice dell’app non richiede pacchetti o build.

```text
node tools/serve.mjs
node --test tests/*.test.mjs
node tests/browser.cjs
```

Il controllo browser richiede Playwright disponibile. `LIFEOS_PLAYWRIGHT` può indicarne il percorso; `LIFEOS_BROWSER` può indicare un browser installato. Il test avvia e chiude il proprio server locale. `LIFEOS_URL` consente un controllo su una preview; `LIFEOS_SMOKE_ONLY=1` limita la verifica alle route. `LIFEOS_QA_DIR` abilita schermate desktop/mobile.

## Confini ancora aperti

1. Record e Undo sono volatili: nessuna persistenza, autenticazione o sincronizzazione è stata collegata.
2. Le date del laboratorio sono ancora etichette dimostrative; il modello ISO e le ricorrenze V1 richiedono trasferimento e test dedicati.
3. La sessione FitOS è isolata nel suo modulo ma conserva un proprio stato mutabile temporaneo; non usa ancora lo store/repository canonico.
4. Le viste sono funzioni che producono markup; alcuni template e il CSS conservano debito tecnico del laboratorio. La separazione dei file non equivale alla completa revisione di ogni componente.
5. La validazione è a runtime; non è stata introdotta una verifica statica TypeScript.
6. Il registro è limitato e volatile; non è un audit finanziario, un sistema idempotente o un sistema di recupero persistente.
7. Le statistiche dimostrative non diventano calcoli V1 per il fatto di trovarsi in un modulo separato.
8. L’importazione dei dati V1 e l’adattatore al salvataggio esistente non sono ancora implementati.

La prova di parità rimane la [matrice V1](../non-regression-matrix.md). La direzione operativa è descritta nel [piano tecnico](../architecture/TECHNICAL_REFACTOR.md).
