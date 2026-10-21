# INC-01 — sorgente unica e controllo qualità

**Data:** 21 ottobre 2026 · **Branch:** `lifeos-visual-lab` · **Piano:** [versione corrente](../DELIVERY_PLAN.md).

**ID coinvolti:** ARCH-001, ARCH-002, QA-001; primo contratto DATA-001. Nessuna capacità V1 completa viene chiusa da questo incremento.

## Risultato e confini

È istituita una sola sorgente attiva in [`app/`](../../../app/README.md), con React/TypeScript/Vite, componenti, routing mantenuto e dipendenze fissate. Batch 14 e precedenti rimangono riferimenti congelati. Nessuna modifica al codice V1 o a branch protetti; nessun SDK Firebase, account, backup privato o collegamento ai dati in uso.

Oggi, progetto e Agenda sono tre viste dello stesso piccolo workspace sintetico. Completare una task o rinominare un progetto passa da un caso d’uso e aggiorna il record canonico; Undo ripristina i dati in memoria. Il dataset ha una data di riferimento dichiarata e non è un calendario personale corrente.

FitOS, finanze, Inbox e impostazioni hanno destinazioni di navigazione con stato del trasferimento esplicito. Non sono capacità operative o già migrate per il fatto di avere una route.

### Quattro dimensioni

| Dimensione | Stato |
|---|---|
| Implementazione | Base F1; comandi e viste workspace parziali su fixture |
| Dati | Volatili; reload riparte dal seed, verificato intenzionalmente |
| Parità V1 | Non dimostrata; nessun mapping/import legacy in INC-01 |
| Rilascio | Non rilasciata; build e preview locale separate dalla V1 |

## Recupero selettivo e provenienza

Baseline materiale recuperato: `774de73d552a2e3e755fdd9713794d66229545de`.

| Origine Batch 14 | Destinazione / scelta |
|---|---|
| `src/data/store.mjs` | `app/src/data/adapters/memory/transaction-store.ts`: clone, freeze, commit validato, rollback, Undo limitato e subscribe; aggiunti tipi, revisione attesa e protezione dalla rientranza |
| `src/data/schema.mjs` | `app/src/domain/workspace/validation.ts`: validazione selettiva del primo contratto, senza coercizioni dei dati |
| `src/domains/commands/bus.mjs` e `workspace.mjs` | Separazione in comandi puri e servizio applicativo, senza singleton runtime o handler DOM |
| `src/domains/workspace/selectors.mjs` | Pattern dei selettori su record identificati, ora nel dominio workspace |
| `styles/app.css` | Palette Aurora/Prism recuperata in token; nuovo CSS condiviso minimo, non copia del foglio completo |
| `tests/domain.test.mjs` | Caratterizzazioni recuperate: immutabilità, rollback parziale, Undo/identità, isolamento e unsubscribe; aggiunti concorrenza, schema, errori e rientranza |
| `tests/architecture.test.mjs` | Shell HTML ridotta e import aciclici; grafo ora letto con parser TypeScript, confini tra livelli e controlli lint |
| Navigazione e relativi hardening | Ricostruita in componenti React; native dialog più ciclo Tab esplicito, pin/focus/reveal e nessuna animazione di larghezza |

Non sono stati trasferiti in blocco template, handler di pagina, seed esteso, logica FitOS o simulazioni finanziarie. Le capacità corrispondenti restano nel backlog e mantengono il materiale di origine. Non si replica la restrizione LAB che obbligava ogni task a un progetto: il primo modello può rappresentare `null`, ma mapping e casi orfani V1 restano da verificare in INC-02.

## Decisioni tecniche attuate

- `app/` è il punto di sviluppo attivo; nessuna nuova serie di batch.
- React `19.3.1`, React Router `8.5.0`, Vite `8.3.5`, TypeScript `6.0.3`, pnpm `11.25.0`. Versioni verificate con metadati registry e installazione; TypeScript 7 non selezionato perché il parser lint scelto supporta una versione inferiore a 6.1.
- React Router Data Mode, hash router, route lazy e `base: './'`; prima preview locale senza attivare hosting o pubblicare `dist/` in Git.
- Repository asincrono, snapshot UI stabile e servizio applicativo distinto dall’adattatore. La revisione attesa protegge i commit nella stessa istanza; autorità remota, retry/idempotenza e conflitti multi-client non sono implementati.
- Ambiente esclusivamente sintetico composto in un punto. Nessun flag ambiente che abilita produzione, nessuna chiave o dipendenza backend.
- Typecheck indipendente dalla build, lint rigoroso, test di dominio/componenti/architettura e test browser sulla build. Workflow di sola verifica, senza deploy e con permessi `contents: read`.
- CSP della build mantenuta anche durante i test. La limitazione dello screenshotter WebKit è trattata nei test, senza allentare la protezione dell’app.

## Scenari di accettazione

1. Installazione da lockfile in cartella separata senza dipendenze pregresse, poi typecheck/lint/test/build.
2. Task completata in Oggi → stesso ID/stato nel progetto e in Agenda → Undo.
3. Rinomina progetto → riferimenti delle task invariati → conferma visibile → Undo.
4. Dati invalidi o comando fallito dopo una modifica parziale → niente commit, notifica o Undo aggiuntivo.
5. Due commit con la stessa revisione → uno accettato, uno in conflitto, nessuna sovrascrittura silenziosa.
6. Rail compatta → hover/focus → pin/unpin; chiusura dopo destinazione senza bloccare il contenuto sottostante.
7. Menu mobile → focus iniziale, giro Tab/Shift+Tab, Escape, touch e ritorno del focus; ridimensionamento a desktop senza pagina inerte.
8. Back/Forward, indirizzo sconosciuto, progetto mancante e collegamento di recupero.
9. Build sotto root e sotto prefisso statico; temi, assenza di overflow a 320 px, nessuna richiesta esterna durante gli scenari.
10. Reload dopo modifica → seed iniziale e avviso di volatilità: nessuna falsa dichiarazione di salvataggio.

## Prove di questa consegna

Eseguite il 21 ottobre 2026 con Node 24.19.0 e pnpm 11.25.0:

| Controllo | Esito locale |
|---|---|
| Installazione separata senza dipendenze pregresse, `install --frozen-lockfile --ignore-scripts` | PASS; ripetuti i controlli sulla sorgente finale |
| `pnpm typecheck` | PASS, opzioni TypeScript rigorose |
| `pnpm lint` | PASS, nessun warning ammesso |
| `pnpm test` | PASS: 22 casi in quattro suite, inclusi componenti e architettura |
| `pnpm build` | PASS; artefatti identici anche nella copia di installazione separata |
| `pnpm verify` | PASS: pipeline completa più 35 casi E2E, sette scenari su cinque profili |
| Browser sulla build | Chromium, Firefox, WebKit desktop; mobile Chromium/WebKit emulati |
| Rete osservata durante gli E2E | Nessuna richiesta esterna; nessun errore console/runtime |
| Controllo visivo | Schermate desktop dark/light e mobile sintetiche ispezionate |
| `pnpm audit --json` | Nessun advisory noto segnalato il giorno della verifica; non è una garanzia di assenza di vulnerabilità |
| Primo workflow GitHub Actions | [Run 39603361973](https://github.com/kuzo17/life-os/actions/runs/39603361973): setup/typecheck/lint/22 test/build riusciti; 32/35 E2E, difetto di hover iniziale Chromium Linux identificato; correzione in verifica |

I test hanno evidenziato e fatto correggere il blocco dei pulsanti sotto la rail dopo navigazione, il giro Tab mobile e le lettere parzialmente visibili nella rail chiusa. Non sono stati introdotti retry per nascondere questi difetti.

Il primo CI Linux ha mostrato anche la rail già aperta senza movimento del mouse, con puntatore iniziale a `(0, 0)`. Il reveal ora si attiva su movimento effettivo di un puntatore mouse, non sul solo `:hover` presente al montaggio; tastiera e pin restano indipendenti. Il caso viene mantenuto nella suite, senza spostare artificialmente il puntatore fuori dalla rail per far passare la precondizione.

Il pulsante pin acquisisce esplicitamente focus sul pointer-down: evita che la differenza di focus al click in WebKit faccia richiudere la rail tra pressione e rilascio. La suite controlla anche `aria-pressed`. In caso di fallimento CI, report e trace esclusivamente sintetici vengono conservati per sette giorni.

Gli screenshot e i trace sintetici vengono generati in `app/test-results/`, esclusa da Git. La preview locale è la build, non il server di sviluppo. Non viene pubblicata una falsa preview raw.githack dei sorgenti TypeScript.

I profili mobile sono emulazioni su Windows; WebKit non equivale a Safari su dispositivo Apple reale. La verifica completa dei dispositivi rimane nel gate F8/F9. Non è una certificazione di accessibilità, sicurezza o parità di tutta la V1.

## Prossimo blocco

**INC-02:** contratto Task V1, fixture di caratterizzazione dai riferimenti già inventariati, mapping di identità/date/record orfani e repository locale duraturo. Quindi INC-03 collega il percorso utente completo al salvataggio, senza aggiungere una seconda implementazione.
