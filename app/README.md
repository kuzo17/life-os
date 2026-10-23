# LifeOS — sorgente applicativa unica

Da INC-01 questa è l’implementazione attiva. Le batch in `design-lab/` sono conservate, congelate e non vengono duplicate in nuove app.

**Stato:** base tecnica F1/INC-02, con fixture sintetiche salvate in IndexedDB. Catalogo V1 e contratto RTDB verificabili separatamente su emulatore; l'app non ha connessioni remote. Non sostituisce la V1 e non dimostra parità completa.

- [Piano principale](../docs/v2/DELIVERY_PLAN.md)
- [Stato, limiti e prossimo incremento](../docs/v2/DELIVERY_STATUS.md)
- [Provenienza, prove e decisioni INC-01](../docs/v2/increments/INC-01.md)
- [Mapping Agenda, salvataggio e limiti INC-02](../docs/v2/increments/INC-02.md)
- [Catalogo e contratto emulatore INC-02](../docs/v2/increments/INC-02-catalog-emulator.md)

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

La cache, i browser e i risultati rimangono fuori da Git. Nessuno script di installazione dei pacchetti viene eseguito. Nessuna configurazione o credenziale di produzione: la prova emulatore usa un progetto demo senza risorse reali.

### Contratto emulatore separato

Con Java 21 disponibile (eventualmente indicando il solo eseguibile portabile in `LIFEOS_TEST_JAVA`):

```text
pnpm test:emulator:install
pnpm test:emulator
```

Il primo comando scarica esclusivamente il binario RTDB ufficiale 4.11.2 con SHA-256 fissato nella cache; il secondo lo verifica, avvia su `127.0.0.1:8900`, carica regole di sola prova, esegue i test e ferma il processo. La porta occupata causa errore: non viene usato un servizio già avviato. Nessuna CLI Firebase, login, deploy, configurazione o dato reale; nessuna dipendenza npm aggiuntiva. La CI esegue sia `verify` sia questo contratto, con Java fissato.

Il test REST ETag/If-Match non è un backend collegato all'interfaccia, una coda offline o una sincronizzazione multi-device. Le regole consentono richieste anonime solo al sottoalbero sintetico dei contratti e negano il resto: **non sono regole di produzione o autenticazione**. Un controllo d'architettura impedisce che l'avvio browser importi questo adattatore. Gli esiti di conferma persa sono distinti dai rifiuti sicuri.

## Cosa funziona nella base corrente

- Navigazione a pagine, deep link hash, Back/Forward, caricamento e recupero da route errata.
- Rail desktop compatta: hover/focus, pin e chiusura dopo scelta; dialog mobile con Escape, Tab confinato e ritorno del focus, anche dopo ridimensionamento.
- Token dark Aurora / light Prism recuperati dal laboratorio, senza font o asset esterni.
- Due progetti e cinque task sintetiche: le viste Oggi, progetto e Agenda leggono gli stessi record.
- Completamento task e rinomina progetto salvati nel browser; orari e priorità visibili e ordinamento Agenda per orario.
- Undo della sessione: l'effetto dell'annullamento viene salvato, la cronologia non viene recuperata dopo riapertura.
- Transazioni IndexedDB con revisione atomica; una bozza obsoleta non sovrascrive silenziosamente modifiche di un'altra scheda.
- Conferma dopo commit, errori di avvio/salvataggio e nessun reset automatico di archivi invalidi.
- Validazione, rollback, snapshot immutabili, revisione ottimistica e rifiuto degli aggiornamenti concorrenti obsoleti.
- Moduli non trasferiti chiaramente indicati: non simulano operazioni disponibili.

Schema locale 2: primo contratto Task/progetti, non formato dell'intero backup V1. I mapper puri ricostruiscono il catalogo da PD/custom/override e trasformano estratti Agenda. Il report conserva metadati cartelle/archivio/tipo/ordine e originali: tali metadati non sono ancora nello schema locale della UI. I record ambigui sono in quarantena. Non è esposto un importatore di backup personali. Creazione/modifica completa, bulk, import/export e coda/sync rimangono INC-03 e fasi successive.

### Limiti del salvataggio locale

Archivio isolato `lifeos-lab-workspace-v1`, distinto dalla V1. Il seed viene scritto solo alla creazione del database. Un errore non avvia una copia volatile e non risemina i dati. Dopo un errore di versione/archivio, chiudere vecchie schede e riprovare/ricaricare; non cancellare lo storage per aggirarlo.

Il salvataggio dipende da browser e origine (protocollo, host e porta): `localhost`, `127.0.0.1` o un'altra porta non condividono l'archivio. Non è un backup, non sincronizza dispositivi e non protegge da cancellazione/eviction o modalità privata. Anche le preferenze tema/pin restano di sessione. Non usare questa preview per dati personali da conservare.

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
| `src/data/adapters/local/` | Repository duraturo, cache immutabile, CAS e Undo di sessione |
| `src/data/adapters/shared/` | Motore repository comune ai driver persistenti e al contratto emulato |
| `src/data/adapters/rtdb/` | Codec e adattatore esclusivo per l'emulatore, non importati dall'avvio UI |
| `src/data/adapters/indexeddb/` | Transazioni native, inizializzazione isolata e gestione versione |
| `src/data/migrations/` | Trasformazioni legacy pure e report con originali/quarantena |
| `src/data/fixtures/` | Soltanto dataset sintetici |
| `tests/unit/` | Dominio, repository, componenti e confini architetturali |
| `tests/e2e/` | Percorsi sulla build e matrice browser |
| `tests/contracts/`, `tests/emulator/` | Contratto comune, prove RTDB reali di test e regole non produttive |

Le viste inviano comandi al servizio; non modificano snapshot o scrivono nel repository. L'avvio browser apre sempre IndexedDB prima delle route; la factory in memoria serve ai test isolati. La revisione evita sovrascritture silenziose tra istanze dello stesso archivio; al ritorno in primo piano i dati vengono riletti. Non equivale a sincronizzazione multi-device o idempotenza persistente dei comandi futuri.

## Matrice browser e protezione della preview

La matrice automatica comprende Chromium, Firefox e WebKit desktop, più Chromium e WebKit con viewport/touch mobile emulati. Controlla anche 320 px, tastiera, entrambi i temi e deep link sotto `/lifeos-preview/`. Non è una prova su iPhone o altri telefoni reali.

La build ha una CSP restrittiva; il server di preview aggiunge intestazioni di protezione. Queste intestazioni non sono autenticazione o regole di sicurezza dei dati. Nessun accesso remoto viene implementato qui.

Le schermate sono prodotte per Chromium/Firefox e mobile Chromium. Lo screenshotter WebKit della versione fissata inietta uno stile inline `body {}` per sincronizzare animazioni: la CSP lo blocca. I test WebKit verificano funzioni, temi e layout senza screenshot e senza disattivare la CSP; conservano il trace in caso di errore.
