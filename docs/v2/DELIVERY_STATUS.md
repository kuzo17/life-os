# LifeOS — Registro operativo dello sviluppo

**Aggiornato:** 23 ottobre 2026 · **Piano:** [DELIVERY_PLAN.md, versione 1.3](DELIVERY_PLAN.md).

Questo file registra fatti e prossimi passi. Le descrizioni dei prototipi non vengono convertite in dichiarazioni di parità. Le autorizzazioni per produzione, dati reali e nuovi servizi rimangono quelle del piano e dell’utente.

## 1. Stato corrente

- Branch di lavoro: `lifeos-visual-lab`.
- Baseline V1: `e58a77e3e00445474d93008d15ecf3a171f2a783`.
- Baseline del materiale LAB recuperabile: `774de73d552a2e3e755fdd9713794d66229545de`.
- Consegna completata: **INC-01 / F1** e checkpoint dati **INC-02**, [catalogo progetti e contratto emulatore](increments/INC-02-catalog-emulator.md) verificati sul sottoinsieme sintetico in locale e CI Ubuntu. [Run completo riuscito 39927033049](https://github.com/kuzo17/life-os/actions/runs/39927033049): 43 test, 10 test emulatore e 65 E2E. F2 non completa. Prossimo blocco funzionale: **INC-03**, percorso Task completo.
- Sorgente attiva: [`app/`](../../app/README.md); batch congelate, nessuna nuova copia dell’app.
- React/TypeScript/Vite: **configurati con dipendenze fissate e lockfile**.
- Persistenza nella nuova base: **IndexedDB locale su fixture sintetiche**. Contratto RTDB separato: **verificato su emulatore ufficiale solo loopback**, senza connessione dall'interfaccia. Autenticazione, coda e sincronizzazione remota: **non implementate**.
- Prima consegna locale INC-02: `3c281a6`, [run 39921317118](https://github.com/kuzo17/life-os/actions/runs/39921317118). Checkpoint catalogo/emulatore: codice app `fdf02a3`, pipeline `d9ba206`, [run 39927033049](https://github.com/kuzo17/life-os/actions/runs/39927033049) interamente riuscito. Solo branch di laboratorio, nessun deploy.
- Migrazione e riconciliazione di dati reali: **non eseguite**.
- Disponibilità e validità dei backup privati: **da verificare privatamente prima del relativo gate**; non blocca le implementazioni con fixture sintetiche.
- Nessuna capacità V1 viene dichiarata completa o rilasciata da INC-01. [Provenienza, scenari e limiti](increments/INC-01.md).

### Evidenza già disponibile

| Riferimento | Risultato | Limite |
|---|---|---|
| `docs/v2/legacy-functions.md` | Inventario di 429 definizioni nominali con baseline e righe | Callback/registry e collegamenti ai nuovi test da integrare per capacità |
| `design-lab/non-regression-matrix.md` | Copertura delle aree V1 | Checklist, non stato di migrazione |
| `design-lab/batch-14/tests/domain.test.mjs` | Transazioni, rollback, ID, Undo, isolamento su fixture | Sottoinsieme sintetico e volatile |
| `design-lab/batch-14/tests/architecture.test.mjs` | Shell separata e moduli senza dipendenze circolari | Non verifica un progetto React/TypeScript o l’intera V1 |
| `design-lab/batch-14/tests/browser.cjs` | 41 destinazioni più flussi principali, temi e mobile | Prova del laboratorio, non persistenza o dati reali |
| Commit `774de73` | Base modulare pubblicata e codice recuperabile | Primo consolidamento tecnico, non rilascio V2 |
| `app/` e consegna INC-01 | Base React/TypeScript, contratti repository, comandi e test del workspace sintetico | Nessun import legacy, storage duraturo, sync o parità completa |
| Controlli INC-01 del 21 ottobre | Installazione pulita, typecheck/lint, 22 test, build e 35 E2E su cinque profili: PASS locale | Windows con mobile emulato; nessuna certificazione hardware/produzione; CI remota separata |
| CI sul codice `81e909a`, [run 39604511767](https://github.com/kuzo17/life-os/actions/runs/39604511767) | Installazione pulita, typecheck/lint, 22 test, build e 35 E2E: PASS Ubuntu | Non verifica dati personali, Firebase o dispositivi reali |
| INC-02, controlli del 21 ottobre | `pnpm verify`: PASS Windows; 33 test unit/component/contratto, build e 65 E2E con riavvio processo browser e profilo sintetico | Niente remoto, import completo o dispositivi fisici |
| INC-02, [CI del 23 ottobre](https://github.com/kuzo17/life-os/actions/runs/39921317118), codice `3c281a6` | Installazione da lockfile, typecheck/lint, 33 test, build e 65 E2E: PASS Ubuntu | Non chiude il contratto remoto/emulatore o la migrazione reale |
| Checkpoint catalogo/emulatore INC-02 del 23 ottobre, locale | Typecheck/lint/build e 43 test PASS; 10 test RTDB ufficiale PASS; 39 E2E Chromium/Firefox/mobile Chromium PASS | WebKit locale bloccato da Code Integrity prima dell'app (26 casi); nessuna protezione modificata. Casi WebKit verificati in CI Ubuntu |
| Prima CI catalogo/emulatore, [run 39925411607](https://github.com/kuzo17/life-os/actions/runs/39925411607) | 43 test e 65 E2E PASS Ubuntu sul codice `fdf02a3` | Job fallito nel successivo setup Java per selettore build abbreviato; corretta stringa completa disponibile `21.0.13+9.0.LTS`, nuova CI in attesa |
| CI finale catalogo/emulatore, [run 39927033049](https://github.com/kuzo17/life-os/actions/runs/39927033049), `d9ba206` | Entrambi i job PASS Ubuntu: app (typecheck/lint, 43 test, build, 65 E2E) e contratto emulatore (10 test) | Dati sintetici, mobile emulato; niente autenticazione, sync reale, import privato o parità completa |

## 2. Stati da usare

Le attività usano **da iniziare / in corso / verificata / bloccata**. Una voce bloccata riporta il vincolo esatto e le attività indipendenti che possono continuare.

Per una capacità utente annotare anche:

- **Implementazione:** documentata, laboratorio, parziale, verificata localmente.
- **Dati:** volatili, locali duraturi, sincronizzati in emulatore, verificati in staging autorizzato.
- **Parità:** non verificata, casi parziali, casi obbligatori verificati, riconciliata sui dati reali.
- **Rilascio:** non rilasciata, candidata, rilasciata, stabilizzata.

Esempio corretto oggi per Task: `parziale INC-02 su fixture · locale duraturo · caratterizzazione Agenda parziale · non rilasciata`. Non usare “Task completa” per riassumerlo.

## 3. Backlog principale con dipendenze

Tutte le attività sotto sono da realizzare nella sorgente unica; l’eventuale risultato LAB è materiale di partenza, non completamento dell’attività. Il dettaglio di accettazione è nella fase corrispondente del piano.

| ID | Fase | Capacità/consegna | Dipendenze | Stato corrente |
|---|---|---|---|---|
| PLAN-001 | F0 | Piano, registro, istruzioni e riallineamento documenti | Documenti V1 esistenti | Verificata: consegna documentale |
| ARCH-001 | F1 | Sorgente unica `app/`, toolchain e consolidamento Batch 14 | PLAN-001 | Verificata localmente in INC-01 |
| ARCH-002 | F1 | Confini, componenti, route, shell e gestione errori | ARCH-001 | Verificata localmente in INC-01 |
| QA-001 | F1 | Typecheck, lint, test, build e CI di verifica | ARCH-001 | Verificata: Windows e CI Ubuntu; primo difetto CI corretto e caso mantenuto nella suite |
| DATA-001 | F1/F2 | Modelli canonici, validazione, date, ID e porte repository | ARCH-001 | In corso: schema 2 Task con orario/priorità/ordine, date civili e task libere; contratto totale V1 ancora parziale |
| DATA-002 | F2 | Repository locale duraturo e contratto memoria/emulatore | DATA-001 | Verificata in locale e CI Ubuntu per schema 2: contratto comune memoria/locale/RTDB emulato; IndexedDB reale nei browser. Conferma persa distinta da rifiuto. Non include coda/sync o backend UI |
| LEG-001 | F2 | Mapping task/progetti V1 e fixture di caratterizzazione | DATA-001, DEC-006 | Verificata su fixture per estratti Agenda giornalieri e catalogo PD/custom/override, con quarantena e originali. Metadati catalogo nel report, non ancora nello schema UI; nessun import completo/privato |
| TASK-001 | F2 | Task/Oggi/Progetti/Agenda sullo stesso record persistente | LEG-001, DATA-002, ARCH-002 | Viste e due comandi con salvataggio locale sintetico; creazione/modifica completa e percorso INC-03 ancora da realizzare |
| TASK-002 | F2 | Scadute, ordinamenti, priorità/orari e operazioni bulk | TASK-001 | LAB parziale da trasferire |
| PROJ-001 | F3 | Cartelle, progetti speciali/custom, override, ordine, archivio | TASK-001 | LAB parziale da trasferire |
| GOAL-001 | F3 | Goals generali/settimanali, cicli, debiti e recuperi | PROJ-001 | LAB incompleto da trasferire |
| RECUR-001 | F3 | Regole, occorrenze, completamenti, eccezioni e streak | DATA-001, TASK-001 | Da iniziare sulla semantica V1 |
| HABIT-001 | F3 | Checkbox/min/max, target, correzioni e storico | DATA-002 | Da iniziare |
| TODAY-001 | F3 | Dashboard derivata da task/goals/habits/FitOS verificati | Domini pertinenti; completamento progressivo | LAB da collegare a dati verificati |
| TRAIN-001 | F4 | Cataloghi, piani, sessioni guidate, log e resume | DATA-002, ARCH-002 | LAB avanzato da trasferire |
| STRETCH-001 | F4 | Routine, focus, timer, completamenti e storico | DATA-002; pattern TRAIN-001 | Da iniziare |
| FOOD-001 | F4 | Alimenti, ricette, grammi, macro e dipendenze | DATA-002 | Da iniziare |
| FOOD-002 | F4 | 11 slot, piani settimanali, consumi/snapshot e target | FOOD-001 | Da iniziare |
| WEIGHT-001 | F4 | Peso per data, correzioni, unità e trend | DATA-002 | Da iniziare |
| FIN-001 | F5 | Asset, saldi iniziali, ledger e storni/idempotenza | DATA-001/002; decisioni numeriche | LAB visivo da trasferire |
| FIN-002 | F5 | Spese e rate con pagamento unico e fine mese | FIN-001, PROJ-001 | LAB incompleto da trasferire |
| CARD-001 | F5 | Copie fisiche, costi/stime/stati e vendite | FIN-001 | Inventario LAB da trasferire |
| VINTED-001 | F5 | Quantità, inventario, vendite legacy e margini | FIN-001 | Inventario LAB da trasferire |
| FIN-003 | F5 | Risparmio, crypto, valutazioni e patrimonio | FIN-001, CARD-001, VINTED-001 | Da trasferire |
| INCOME-001 | F5 | KDP/negozio, maturato/credito/payout e forecast storico | FIN-001 | LAB visivo da trasferire |
| CAPTURE-001 | F2/F6 | Registry V1 completo, form, preview, comandi e Inbox | Minimo TASK-001; poi domini destinatari | LAB parziale da trasferire |
| SEARCH-001 | F6 | Ricerca aggiornata, azioni e deep link ai record | Domini verificati e ARCH-002 | LAB da trasferire |
| SETTINGS-001 | F6 | Preferenze, ordinamenti, impostazioni e versioni | DATA-002 | LAB parziale da trasferire |
| BACKUP-001 | F6 | Export/import versionati e round-trip sintetico | Schemi dei domini e DATA-002 | Da iniziare |
| SYNC-001 | F2/F7 | Coda duratura, revisioni, retry e conflitti per dominio | Contratti iniziali F2; domini verificati | Contratto iniziale CAS/replay/ACK incerto verificato in emulatore; coda duratura e sync non implementate |
| AUTH-001 | F7 | Utenti, accessi e regole negate/consentite in emulatore | DATA-001, SYNC-001 | Da iniziare |
| PWA-001 | F7 | Offline, riapertura, aggiornamento cache e recupero | SYNC-001, BACKUP-001 | Da trasferire e verificare |
| UX-001 | F1/F8 | Componenti accessibili, temi Aurora/Prism e personalizzazione | Minimo F1; consolidamento F8 | Direzione LAB recuperabile |
| UX-002 | F8 | Usabilità e miglioramenti P1 selezionati | Capacità obbligatorie e F7 | Backlog, non baseline completata |
| MIG-001 | F9 | Dry-run privato, mapping, conteggi e riconciliazione | BACKUP-001, domini verificati, backup privati | Da iniziare al gate dati reali |
| REL-001 | F9 | Build candidata, ripristino, rollback e passaggio | MIG-001, AUTH-001, SYNC-001, UX-001 | Da iniziare; passaggio non autorizzato |
| REL-002 | F9 | Stabilizzazione sui dispositivi e consegna gestione | REL-001 | Da iniziare |

## 4. Prossimi tre incrementi concreti

INC-01 attua il piano nella sorgente unica; INC-02 prepara i contratti dati e legacy, verificati anche in CI. Il prossimo blocco funzionale è INC-03. Non riaprire da zero scelta del framework o audit generale. Nessun collegamento ai dati reali è autorizzato da questo avanzamento.

### INC-01 — Istituire il progetto applicativo e il controllo qualità

**Esito:** completato e verificato in locale Windows e CI Ubuntu sul codice `81e909a`. [Scheda di consegna](increments/INC-01.md), avvio in `app/README.md`. Il primo difetto emerso in CI è corretto, con scenario di regressione nella suite. Il prossimo lavoro è INC-02.

**Comprende:** ARCH-001, ARCH-002 e QA-001; contratti iniziali DATA-001.

**Operazioni:** selezionare versioni compatibili; creare progetto e lockfile; trasferire il core puro con test, senza inglobare l’HTML; montare shell/route e componenti minimi; esporre script di verifica e preview della build. Registrare ogni pezzo recuperato. Aggiornare i punti d’ingresso perché nessuno continui a sviluppare il vecchio laboratorio come app definitiva.

**Dimostrazione richiesta:** installazione pulita → typecheck/lint/test/build → avvio della build → navigazione e gestione errore; ambiente sintetico e nessuna connessione alla produzione.

### INC-02 — Contratto Task V1, date e adattatori

**Comprende:** DATA-001, LEG-001 e parte DATA-002.

**Avanzamento corrente:** [prima consegna](increments/INC-02.md) e [continuazione catalogo/emulatore](increments/INC-02-catalog-emulator.md). DEC-006 definita sul sorgente; mapper Agenda e catalogo conservativi, schema 2, repository locale e contratto RTDB su emulatore ufficiale con stessi test. L'app non importa automaticamente dati V1 né legge backup privati. Cartelle/archivio/tipo/ordine sono conservati nel report di migrazione, non ancora funzioni UI. Il percorso completo INC-03 segue questi contratti; F2 resta aperta.

**Operazioni:** usare le funzioni Agenda/progetto già catalogate; associare i casi a righe della baseline; decidere task libere/progetto, identità, date e orfani; creare fixture sintetiche che riproducano il formato V1; implementare trasformazione deterministica e repository in memoria/locale. Provare il contratto remoto in emulatore senza dati reali.

**Dimostrazione richiesta:** stesso input → stessi ID/mapping; nessun record perso o inventato; casi invalidi segnalati; record riletti dopo riapertura; secondo import senza duplicazioni.

### INC-03 — Primo percorso utente persistente

**Comprende:** TASK-001, TASK-002 e minimo CAPTURE-001.

**Operazioni:** collegare form e viste ai casi d’uso; creare, modificare, completare, pianificare e spostare; introdurre bulk con gestione errore; mostrare lo stato del salvataggio. Lavorare su dati sintetici nella forma legacy e nel modello nuovo.

**Dimostrazione richiesta:** cattura → progetto → Agenda → modifica → salvataggio → chiusura/riapertura → ricerca del medesimo record → export/ripristino. Verificare giorni/timezone, errori e doppio invio. Il risultato viene chiamato “percorso verificato localmente”, non “migrazione privata completata”.

Dopo INC-03 aggiornare l’ordine dettagliato di F3–F9 con le informazioni ottenute. Se un problema di storage o modello emerge, correggere il contratto prima di replicarlo negli altri domini.

## 5. Questioni da chiudere al momento giusto

| ID | Punto | Quando | Come procedere prima della chiusura |
|---|---|---|---|
| DEC-006 | Task senza progetto e semantica dei record orfani | Decisione fissata in INC-02 | Task libere ammesse; orfani in quarantena con originale, nessun progetto generico inventato |
| DEC-007 | Autorità locale/remota e revisione/conflitti | Contratto INC-02, consolidamento F7 | Implementare e testare le porte, senza promettere sync reale |
| DEC-008 | Preview della build e hosting finale | INC-01 / prima di F9 | Usare preview locale; niente deploy sulla produzione attuale |
| DEC-009 | Ambiente remoto, utenti e regole di accesso | Emulatore contratto F2 verificato; auth F7 ancora aperta | Progetto demo e regole non produttive limitate al sottoalbero di prova; nessun accesso alla produzione |
| NUM-001 | Conversione monetaria e arrotondamenti legacy | Prima di FIN-001 | Preservare gli originali nei fixture e rendere espliciti i casi ambigui |
| DATA-PRIVATE-001 | Provenienza/validità dei backup privati | Prima di MIG-001 | Sviluppare e verificare con fixture sintetiche |

Le decisioni ordinarie si documentano e si attuano entro l’ambito autorizzato. Chiedere all’utente solo quando manca una scelta di prodotto sostanziale o serve nuova autorità su dati, servizi o rilascio.

## 6. Rischi principali e risposta prevista

| ID | Rischio | Risposta / prova |
|---|---|---|
| R-01 | Tornare a produrre demo invece della migrazione | Sorgente unica, ID di backlog e criteri del piano per ogni commit |
| R-02 | Perdere capacità nascoste in callback/registry | Copertura supplementare legata al modulo e fixture di caratterizzazione |
| R-03 | Trasformare le semplificazioni LAB in restrizioni V1 | Confronto con sorgente/contratti, differenze deliberate registrate |
| R-04 | Perdere dati in reload, errore o conflitto | Storage duraturo, test di riavvio/errore, coda e ripristino |
| R-05 | Duplicare incassi/spese o ricostruire saldi falsi | Ledger, idempotenza, opening balance e riconciliazione |
| R-06 | Inventare storico fitness/nutrizione | Provenienza, snapshot futuri e limiti legacy espliciti |
| R-07 | Divergenza tra documenti e implementazione | Registro aggiornato nello stesso incremento e avvisi sui documenti storici |
| R-08 | Fine del lavoro rinviata da nuove idee | Baseline obbligatoria distinta dal backlog P1/P2 |
| R-09 | Confondere preview e produzione | Ambiente/build identificati e passaggio esplicitamente autorizzato |

## 7. Modello di scheda per una capacità

Quando una voce entra in lavorazione, aggiungere una scheda con questi campi qui o in un documento di dominio collegato:

```text
ID / titolo:
Fase e dipendenze:
Capacità V1 e riferimento alla baseline:
Input/dati legacy e risultato atteso:
Materiale recuperato dal laboratorio:
Nuovi moduli/casi d’uso/adattatori:
Scenari di accettazione e casi di errore:
Implementazione / Dati / Parità / Rilascio:
Prove eseguite (comando, scenario o report) e risultato:
Commit / preview della build:
Limiti, difetti e differenze deliberate:
Prossimo passo:
```

## 8. Regole di aggiornamento

Aggiornare questo file nello stesso incremento del codice: fase corrente, attività realmente iniziate/chiuse, prove, decisioni emerse, limiti e prossimo blocco. Per la documentazione usare controlli di coerenza e link; per il codice usare i test appropriati alla modifica.

Non riportare “test superati” senza esecuzione; distinguere una prova precedente dalla verifica della modifica corrente. Non ricontrollare tutta l’app dopo un semplice cambiamento di testo. Non annotare dati sensibili nei report pubblici.

Una pausa, un errore o un nuovo requisito non giustificano la riscrittura del piano da zero. Conservare ID e cronologia; cambiare lo stato con motivazione. Non riscrivere gli esiti storici come se fossero sempre stati diversi.

### Registro delle consegne

| Data | Attività | Esito e riferimenti |
|---|---|---|
| 2026-10-20 | Base Batch 14 | Commit `774de73`: separazione modulare e prove sul laboratorio; persistenza e parità completa ancora assenti |
| 2026-10-21 | PLAN-001 | Piano v1.0, registro e istruzioni completati; documenti precedenti riallineati. Verificati 14 documenti, 89 link locali, 10 fasi e 37 ID di backlog univoci; modifiche soltanto documentali. Il commit che introduce il piano identifica la consegna. |
| 2026-10-21 | INC-01 / ARCH-001/002, QA-001, parte DATA-001 | Sorgente unica, recupero selettivo del core, componenti/route e contratto repository volatile. Installazione pulita, typecheck/lint, 22 test, build e 35 E2E locali: PASS. Workflow di sola verifica predisposto; esito remoto distinto. Nessuna capacità V1 completa o dato reale migrato. |
| 2026-10-21 | Chiusura QA-001 / INC-01 | Primo CI: caso iniziale hover Chromium Linux individuato. Codice `81e909a`: correzione hover/pin e report sintetici in caso di errore; 22 test e 35 E2E riconfermati Windows e Ubuntu CI, run `39604511767` riuscito. F1 chiusa, nessun cambio ai gate di persistenza/parità/rilascio. |
| 2026-10-21 | Primo blocco INC-02 / DATA-001/002, LEG-001 | Schema 2, caratterizzazione e mapper Agenda circoscritto, IndexedDB locale, conferma dopo commit, Undo di sessione con effetto salvato e gestione conflitti/errori. `pnpm verify`: 33 test e 65 E2E PASS Windows; pin WebKit corretto sulla base degli eventi. Schermate desktop/mobile ispezionate. CI remota in attesa. INC-02/F2 ancora aperte per catalogo/mapping completo e contratto remoto in emulatore; nessun dato reale toccato. |
| 2026-10-23 | Pubblicazione e verifica INC-02 locale | Codice `3c281a6`, [run 39921317118](https://github.com/kuzo17/life-os/actions/runs/39921317118): installazione pulita, typecheck/lint, 33 test, build e 65 E2E PASS Ubuntu. Preview locale della stessa build verificata HTTP 200. `main` e `lifeos-v2` invariati; nessun rilascio o dato reale migrato. Prossimo sotto-blocco: catalogo progetti V1 e contratto remoto in emulatore, prima di INC-03. |
| 2026-10-23 | Catalogo/emulatore INC-02 | Catalogo PD/custom/override, originali e quarantena; repository condiviso e codec RTDB, CAS/replay/inizializzazione ripetuta/ACK incerto su emulatore ufficiale. 43 test e 10 test emulatore PASS; 39 E2E locali PASS, WebKit bloccato dal sistema prima dell'app. CI nuova completa in attesa. Nessuna dipendenza npm aggiunta; Java portabile solo cache; prossima implementazione INC-03. |
| 2026-10-23 | Chiusura checkpoint contratti INC-02 | Prima CI: app 43/65 PASS, selettore Java corretto. Verifiche rese indipendenti in due job; codice app invariato dopo `fdf02a3`. [Run finale 39927033049](https://github.com/kuzo17/life-os/actions/runs/39927033049), pipeline `d9ba206`: 43 test, 10 test emulatore e 65 E2E PASS Ubuntu. Preview HTTP 200 con build finale; branch protetti invariati. Prossimo: INC-03; F2, dati privati e rilascio restano aperti. |
