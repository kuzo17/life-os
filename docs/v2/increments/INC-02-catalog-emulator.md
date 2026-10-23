# INC-02 — Catalogo progetti e contratto emulatore

**Stato:** checkpoint verificato in locale e CI Ubuntu · 23 ottobre 2026 · LEG-001, DATA-002, contratto iniziale DEC-007/009/011. Non chiude F2 o la migrazione dell'app.

## Ambito e decisioni prima del codice

Fonte V1 `e58a77e3`: PD/override/activeProjs 1010–1038; ordinamento 1503–1506; cartelle 1605–1639; creazione/cancellazione/rinomina 1649–1683; archivio/priorità 1697–1705; spostamento 1710–1727; colore 7212–7218.

- Catalogo puro su estratti sintetici, con defaults PD espliciti e non eseguiti dall'HTML. Merge seed/custom, esclusione `deletedPD`, archivio, override e ordine. ID dei progetti conservati; ID cartelle deterministici nello stesso snapshot. Duplicati/valori ambigui bloccano il relativo record, senza progetto generico o legame arbitrario.
- Override tag/folder del boot si applicano ai seed; i custom mantengono i propri campi. Colore/priorità sono letti per ID. Folder override seed non valido: fallback V1 al default, con avviso e originale conservato. Folder mancante non viene inventata: nome legacy conservato e riferimento nullo con avviso.
- Report conserva tutti gli originali, mapping, metadati (tipo, archivio, folder, ordine) e contenuti differiti `tasks0/goals0/note0`. Schema applicativo 2 invariato: la UI non acquisisce ancora cartelle/archivio o un import di backup. Il report completo non viene ridotto e scritto automaticamente nel workspace.
- Riutilizzare il repository transazionale con una factory condivisa, mantenendo il wrapper locale. Aggiungere durata `emulated`, distinta da `local` e `remote`; Undo resta di sessione, non è una strategia di sync.
- Prova RTDB via REST condizionale ETag/If-Match su un solo documento di contratto. Solo `http://127.0.0.1:8900`, namespace fisso `demo-lifeos-contract`; rifiuto di host/namespace diversi e redirect. Nessun SDK o adattatore emulatore importato dall'avvio browser.
- Wire format con collezioni indicizzate per ID: RTDB non conserva array/oggetti vuoti come JSON ordinario. Codec esplicito e validazione stretta, incluse collezioni vuote, ordine e campi sconosciuti. Non si riscrive la radice V1 e non si propone questo snapshot come protocollo finanziario futuro.
- Inizializzazione solo su posizione assente tramite `If-Match:null_etag`; doppio avvio non duplica/resetta. Due scritture concorrenti e replay obsoleto: al massimo una conferma, l'altra conflitto; nessun retry cieco o promessa di coda offline.
- Runner dedicato: binario ufficiale RTDB 4.11.2, SHA-256 `b70d99344caf17c98b6f910fa8f6edf32a7c016cb1035e8915f70d38901eb97f`, come nel manifest Firebase CLI v15.34.0. Download solo con comando di installazione, cache ignorata, nessuna CLI Firebase o credenziale. Bind loopback, porta occupata = errore; regole di sola prova limitate al sottoalbero di contratto, resto negato. Non sono le regole di produzione né una prova di autenticazione utenti.
- Java 21 per i test; sul computer un runtime portabile in cache, senza sostituire Java 8 installato. CI con Java 21. Nessuna dipendenza npm aggiuntiva per avviare l'emulatore.

## Accettazione

Fixture seed/custom con override, rinomina, archivio, eliminazione, ordine, folder orfana, collisioni ID, campi sconosciuti; stessi input → stessi mapping, originali intatti, task orfane in quarantena. Stesso contratto repository su memoria/locale/emulatore; su RTDB reale di test: round-trip vuoto/non vuoto, riapertura, inizializzazione ripetuta, CAS concorrente, replay, input invalido, accessi fuori ambito negati. App e CI restano esclusivamente sul branch di laboratorio.

## Fonti tecniche

- [RTDB: richieste condizionali](https://firebase.google.com/docs/database/rest/save-data#section-conditional-requests).
- [Progetti demo ed emulatore](https://firebase.google.com/docs/emulator-suite/connect_rtdb).
- [Manifest ufficiale fissato](https://github.com/firebase/firebase-tools/blob/v15.34.0/src/emulator/downloadableEmulatorInfo.json) e [avvio Java usato dalla CLI](https://github.com/firebase/firebase-tools/blob/v15.34.0/src/emulator/downloadableEmulators.ts).

## Esito e tracciabilità

| Fonte V1 | Risultato | Test |
|---|---|---|
| PD/custom/override/activeProjs 1010–1038, rename 1672–1683 | Merge deterministico, ID conservati, override seed e campi custom senza confonderli | `legacy-projects.test.ts`: rinomina, collisioni, campi sconosciuti e originali |
| Folder/ordine 1503–1506, 1605–1639, 1710–1727 | Folder del medesimo snapshot e ordine riconosciuto; riferimento assente conservato/avvisato | Ordine, folder mancante e override non valido con fallback esplicito V1 |
| Deleted/archive/priority/color 1658–1669, 1697–1705, 7212–7218 | Tombstone nel report, archivio conservato, priorità/colore validati | Agenda a progetto eliminato in quarantena, archivio mantiene il riferimento |
| `tasks0/goals0/note0`, special `hasInv` | Originali preservati, nessuna task o storico inventati | Forme di 14 progetti sintetici, sette tipi speciali; non import dei contenuti personali V1 |
| Nuovo driver emulatore | Codec keyed con prefissi per ID numerici, conteggi/ordine/null; CAS ETag, inizializzazione ripetuta, risposta confrontata | Contratto comune e `tests/emulator/workspace.test.ts` |

Verifiche locali del 23 ottobre: typecheck/lint e build, **43 test unit/component/contratto PASS**; **10 test sull'emulatore RTDB ufficiale PASS**, con Java 21 portabile Windows. Include inizializzazioni simultanee, collezioni vuote/ID numerici, due connessioni concorrenti, replay, conferma persa dopo PUT reale, regole fuori ambito negate, record sconosciuto non riseminato. Una prova ulteriore protegge la cache da una conferma lenta dopo lettura di una revisione successiva.

Il nuovo esito `uncertain` non sostiene che la scrittura sia fallita: chiede rilettura prima del retry. Non implementa una coda duratura né idempotenza generale dei comandi di creazione futuri. `emulated` è distinto da dati locali duraturi e da conferma remota reale; l'architettura verifica che l'adattatore di prova non sia raggiungibile da `main.tsx`.

La matrice locale completa non è verde su Windows: i **26 casi WebKit** non arrivano all'app, perché Code Integrity blocca `ngtcp2.dll` del browser di test (uscita `0xC0E90002`, eventi 3033/3077). Nessuna esclusione o protezione di sistema è stata modificata. I **39 casi Chromium/Firefox/mobile Chromium PASS**, eseguiti separatamente; tutti i **65 casi PASS in CI Ubuntu**, nessuno skip/retry.

Prima CI sul codice `fdf02a3`, [run 39925411607](https://github.com/kuzo17/life-os/actions/runs/39925411607): **43 test e 65 E2E PASS Ubuntu**, compresi i 26 WebKit non avviabili localmente. Il job complessivo è fallito dopo queste prove, perché `setup-java` non risolve la forma abbreviata `21.0.13+9`: il catalogo della action espone `21.0.13+9.0.LTS`. Selettore corretto alla stringa completa disponibile, senza cambiare codice app o disattivare test.

La CI aggiunge Java Temurin `21.0.13+9.0.LTS` con action fissata e i due comandi emulatore; nessun deploy. Il runtime portabile locale è Temurin JRE `21.0.12.1+1`, verificato con SHA-256 e conservato solo in cache; Java installato non è stato sostituito. Nessuna dipendenza npm aggiunta/aggiornata e nessun backup/configurazione privati in Git.

**Affinamento QA prima della modifica workflow:** la ripetizione CI resta a lungo nella preparazione browser, prima del test Java. Separare nello stesso workflow due job indipendenti: controlli app/browser e contratto emulatore. Entrambi devono riuscire; nessun caso viene rimosso. Il job app esegue typecheck/lint/unit/build prima di scaricare i browser. Motivazione: isolamento degli errori e feedback sul contratto indipendente dal download dei browser, non aggiramento dei controlli. Nessun cambiamento al codice applicativo dopo `fdf02a3`.

**Conferma finale:** [run 39927033049](https://github.com/kuzo17/life-os/actions/runs/39927033049), pipeline `d9ba206`, entrambi i job riusciti: **43 test unit/component/contratto, 65 E2E e 10 test emulatore PASS Ubuntu**. La ripetizione intermedia `39925996095` è stata sostituita e annullata automaticamente dal nuovo workflow parallelo. Questa registrazione finale modifica soltanto documenti, non il codice app o il workflow già verificati. Preview della stessa build confermata HTTP 200; schermata mobile light ispezionata. Nessuna modifica a `main` o `lifeos-v2`.

**Stato capacità:** mapping degli estratti e contratto di repository verificati in locale e CI · app ancora solo IndexedDB sintetico · parità V1 parziale · non rilasciata. Import completo dei backup, schema metadata persistente, interfaccia F3, autenticazione, sync multi-device, coda e riconciliazione privata rimangono gate distinti.

**Prossimo incremento:** INC-03, creazione/modifica/pianificazione e operazioni multiple sullo stesso record, Quick Add minimo, prova export/ripristino sintetico. Questi mapper non sono presentati come importatore completo o come merge tra backup V1 successivi.
