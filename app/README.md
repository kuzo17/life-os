# LifeOS — sorgente applicativa unica

Da INC-01 questa è l’implementazione attiva. Le batch in `design-lab/` sono conservate, congelate e non vengono duplicate in nuove app.

**Stato:** base tecnica F1 con fixture sintetiche, dati esclusivamente volatili e nessuna connessione remota. Non sostituisce la V1 e non dimostra parità completa.

- [Piano principale](../docs/v2/DELIVERY_PLAN.md)
- [Stato, limiti e prossimo incremento](../docs/v2/DELIVERY_STATUS.md)
- [Provenienza, prove e decisioni INC-01](../docs/v2/increments/INC-01.md)

## Avvio riproducibile

Richiede Node `24.19.x` o una versione compatibile con `engines`; pnpm `11.25.0`. Versioni dirette e lockfile sono fissati: non usare aggiornamenti automatici a `latest`.

Dalla cartella `app/`:

```text
pnpm install --frozen-lockfile --ignore-scripts
pnpm check
pnpm test:e2e:install
pnpm test:e2e
pnpm preview
```

Anteprima della **build**, non del sorgente: `http://127.0.0.1:8878/#/today`. Prima di `preview` deve esistere `dist/`, prodotto da `check` o `build`. `pnpm dev` serve allo sviluppo con aggiornamento dei componenti. Aprire `index.html` direttamente o da raw.githack non compila TypeScript.

`pnpm verify` esegue controlli del codice, build ed E2E; i browser devono essere già installati. Su Linux, `pnpm test:e2e:install --with-deps` installa anche i requisiti dei browser. La CI applica questi passaggi senza deploy e soltanto sul branch di laboratorio.

La cache, i browser e i risultati rimangono fuori da Git. Nessuno script di installazione dei pacchetti viene eseguito. Non è prevista alcuna configurazione Firebase o credenziale in questa fase.

## Cosa funziona in F1

- Navigazione a pagine, deep link hash, Back/Forward, caricamento e recupero da route errata.
- Rail desktop compatta: hover/focus, pin e chiusura dopo scelta; dialog mobile con Escape, Tab confinato e ritorno del focus, anche dopo ridimensionamento.
- Token dark Aurora / light Prism recuperati dal laboratorio, senza font o asset esterni.
- Due progetti e cinque task sintetiche: le viste Oggi, progetto e Agenda leggono gli stessi record.
- Completamento task, rinomina progetto e Undo esclusivamente in memoria.
- Validazione, rollback, snapshot immutabili, revisione ottimistica e rifiuto degli aggiornamenti concorrenti obsoleti.
- Moduli non trasferiti chiaramente indicati: non simulano operazioni disponibili.

Il formato workspace F1 è un primo contratto interno, non il formato della V1. Date/relazioni legacy, creazione/modifica completa, bulk, persistenza IndexedDB e contratto emulatore sono lavoro INC-02/03. Non usare questa base per immettere dati personali da conservare.

## Confini del codice

| Percorso | Responsabilità |
|---|---|
| `src/app/` | Composizione, route, provider e shell |
| `src/ui/` | Componenti minimi, token e stile condiviso |
| `src/modules/` | Pagine e interazioni; nessun accesso diretto agli adattatori |
| `src/application/` | Casi d’uso, validazione del comando e gestione dell’esito |
| `src/domain/` | Modelli, regole e selettori puri, senza React/DOM/SDK |
| `src/data/ports/` | Contratti asincroni del repository |
| `src/data/adapters/memory/` | Implementazione volatile e motore transazionale recuperato |
| `src/data/fixtures/` | Soltanto dataset sintetici |
| `tests/unit/` | Dominio, repository, componenti e confini architetturali |
| `tests/e2e/` | Percorsi sulla build e matrice browser |

Le viste inviano comandi al servizio; non modificano snapshot o scrivono nel repository. La revisione locale evita sovrascritture silenziose nella stessa istanza: non equivale a sincronizzazione multi-device o idempotenza persistente.

## Matrice browser e protezione della preview

La matrice automatica comprende Chromium, Firefox e WebKit desktop, più Chromium e WebKit con viewport/touch mobile emulati. Controlla anche 320 px, tastiera, entrambi i temi e deep link sotto `/lifeos-preview/`. Non è una prova su iPhone o altri telefoni reali.

La build ha una CSP restrittiva; il server di preview aggiunge intestazioni di protezione. Queste intestazioni non sono autenticazione o regole di sicurezza dei dati. Nessun accesso remoto viene implementato qui.

Le schermate sono prodotte per Chromium/Firefox e mobile Chromium. Lo screenshotter WebKit della versione fissata inietta uno stile inline `body {}` per sincronizzare animazioni: la CSP lo blocca. I test WebKit verificano funzioni, temi e layout senza screenshot e senza disattivare la CSP; conservano il trace in caso di errore.
