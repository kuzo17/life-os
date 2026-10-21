# LifeOS — Piano principale di sviluppo e consegna

**Versione:** 1.1 · **Data:** 21 ottobre 2026 · **Stato:** direzione operativa da applicare e aggiornare durante il lavoro.

**Obiettivo:** trasformare LifeOS esistente in una sola applicazione modulare, affidabile e mantenibile, preservandone le capacità e i dati; successivamente completare il redesign e i miglioramenti di prodotto.

Questo documento governa la sequenza del lavoro fino alla consegna. Il [registro operativo](DELIVERY_STATUS.md) contiene stato, prove, prossime attività, rischi e decisioni aperte. Non si ricomincia l’analisi V1 già svolta: si usa e si completa soltanto dove un’implementazione fa emergere un vuoto concreto.

## 1. Risultato finale atteso

LifeOS rimane un’unica web app utilizzabile da computer e telefono. L’utente deve poter ritrovare le proprie funzioni, usare gli stessi dati in più schermate, salvare e recuperare il lavoro, comprendere lo stato della sincronizzazione e personalizzare l’interfaccia senza alterare i calcoli.

La consegna comprende codice sorgente organizzato, build riproducibile, capacità V1 riconciliate, dati verificati, test dei percorsi critici, documentazione di gestione, backup/ripristino e procedura di rilascio reversibile. Il solo avvio dell’interfaccia non soddisfa questo obiettivo.

### Ordine delle priorità

1. Integrità dei dati e protezione dell’app in uso.
2. Correttezza delle regole e conservazione delle capacità V1.
3. Architettura, manutenzione, test e affidabilità del salvataggio.
4. Usabilità essenziale, mobile e accessibilità durante ogni implementazione.
5. Consolidamento estetico, personalizzazione e miglioramenti P1.
6. Integrazioni esterne e idee nuove soltanto dopo la base completa, con valutazione separata.

L’accessibilità necessaria a usare una funzione non viene rimandata alla fase estetica.

## 2. Fonti e risoluzione delle contraddizioni

| Fonte | Ruolo |
|---|---|
| Richieste e correzioni esplicite dell’utente | Determinano obiettivi, ambito e autorizzazioni |
| Questo piano e decisioni registrate | Sequenza e architettura correnti |
| [Registro operativo](DELIVERY_STATUS.md) | Stato effettivo, prove e prossimo lavoro |
| [Inventario V1](legacy-functions.md) | Riferimenti alle 429 funzioni nominate e copertura supplementare |
| [Matrice di parità](../../design-lab/non-regression-matrix.md) | Capacità da preservare per ogni dominio |
| [Modello dati](data-model.md) | Contratti logici e criticità da consolidare con test |
| [Protocollo di migrazione](migration-plan.md) | Normalizzazione, riconciliazione e protezione dei dati |
| [Audit FitOS](../../design-lab/fitos-focus-parity-audit.md) | Requisiti specifici di allenamento e stretching |
| [Registro dei concept](../../design-lab/master-concept-register.md) | Direzioni di prodotto, idee accettate e backlog futuro |
| Batch e prototipi | Esempi visivi, interazioni e codice da recuperare selettivamente |

La precedente indicazione “design-first” è superata dalla richiesta di consolidamento tecnico prima del redesign. Le precedenti proposte Firestore e sidebar sempre visibile non sono requisiti correnti. Il significato dei dati e le capacità V1 non possono essere cancellati cambiando una priorità di progetto.

Quando due documenti divergono, registrare il punto e risolverlo nel modulo interessato. Esempio già noto: `projectId` facoltativo nel modello logico e obbligatorio nel core demo. La regola del prototipo non deve diventare automaticamente una restrizione della V1.

## 3. Baseline reale e valore del lavoro esistente

**Baseline V1 congelata:** `main@e58a77e3e00445474d93008d15ecf3a171f2a783`, `index.html` di circa 542 KB e 8.932 righe. L’inventario esistente non include ogni closure, callback o metodo del registry: la copertura supplementare viene affrontata insieme alla capacità corrispondente, senza rifare l’intero audit.

**Baseline tecnica del laboratorio:** `774de73d552a2e3e755fdd9713794d66229545de`.

| Elemento | Risultato disponibile | Cosa non dimostra |
|---|---|---|
| Documentazione V1 | Inventario, contratti, mapping, audit e concept | Tutte le capacità già trasferite |
| Batch 01–13 | Gerarchie, temi, navigazione e interazioni studiate | Architettura finale o salvataggio reale |
| Batch 14 | Shell separata, 57 moduli ES, store immutabile, comandi e Undo sul sottoinsieme sintetico | Parità completa, TypeScript, persistenza o sincronizzazione |
| Verifiche Batch 14 | 10 test di dominio/architettura; 41 destinazioni e flussi browser controllati | Copertura delle 429 funzioni o validazione dei dati personali |

Si recuperano i documenti, i test utili, le regole indipendenti dalla UI e le decisioni d’interazione. I template di markup e gli handler del laboratorio vengono adattati in componenti e casi d’uso; non diventano automaticamente il codice definitivo. Le metriche fittizie saranno sostituite da selettori sui record veri del relativo ambiente.

## 4. Direzione tecnica scelta per il piano

### 4.1 Una sola sorgente applicativa

La sorgente attiva è `app/`, sul branch `lifeos-visual-lab`, istituita in [INC-01](increments/INC-01.md) con un trasferimento selettivo del nucleo recuperabile della Batch 14 e un punto d’ingresso React/TypeScript. Questo è un solo consolidamento di percorso e strumenti; non avvia una nuova serie di app dimostrative. Il sottoinsieme F1 è sintetico e volatile: non equivale al trasferimento V1 completo.

Le batch precedenti, inclusa la 14, restano riferimenti congelati e riproducibili. Da F1 il codice mantenuto è soltanto quello in `app/`. Niente Batch 15/16 con una copia completa dell’app, niente due implementazioni attive dello stesso dominio. Ogni modulo recuperato ha provenienza e test indicati nel registro; a trasferimento concluso il vecchio modulo non viene più sviluppato.

L’HTML iniziale contiene l’avvio. Un eventuale file grande prodotto automaticamente dalla build è un artefatto distribuibile, distinto dalla struttura modulare dei sorgenti. Non si modifica manualmente il codice generato.

### 4.2 Strumenti e motivazioni

| Area | Direzione | Verifica richiesta in F1 |
|---|---|---|
| Interfaccia | React, componenti per funzione e componenti condivisi essenziali | Componenti isolabili; nessuna logica di database nei componenti |
| Contratti | TypeScript con controlli rigorosi più validazione dei dati in ingresso | Typecheck indipendente dalla build; errori gestiti anche sui dati legacy |
| Sviluppo e build | Vite, un gestore pacchetti e un lockfile | Installazione pulita, build e preview della build riproducibili |
| Navigazione | React Router in Data Mode lato client; hash router per la prima preview statica | Deep link, Back/Forward, route errate, caricamento diretto e stati pending/error |
| Dominio | Funzioni/casi d’uso indipendenti da React e Firebase | Test senza DOM e senza rete |
| Dati | Porte repository, adattatori e migrazioni separati | Stesso contratto verificato su memoria, storage locale ed emulatore |
| Test | Vitest, Testing Library e Playwright | Regole, componenti e percorsi utente verificabili con dati sintetici |
| Automazione qualità | Script di typecheck, lint, test e build; CI sul laboratorio | Un solo comando di verifica e controlli riproducibili |

Le versioni stabili compatibili vengono verificate e fissate nel lockfile al setup; il piano non impone versioni “latest” a ogni esecuzione. Non vengono aggiunti automaticamente state manager, cache di server, librerie grafiche o servizi: una dipendenza deve risolvere un’esigenza documentata ed evitare fonti di verità duplicate.

La scelta client è motivata dall’app personale esistente e dalla distribuzione statica attuale; non richiede oggi rendering server. Il routing e il caricamento dati vengono affidati a strumenti mantenuti, anziché ricostruiti in un framework artigianale. Cambiare questa direzione richiede una decisione con problema, alternative, costo di migrazione ed effetti sui dati, non una preferenza del singolo turno.

### 4.3 Struttura di riferimento

```text
app/
  src/
    app/                 avvio, route, provider, shell, gestione errori
    ui/                  componenti condivisi, temi, accessibilità
    modules/             viste e interazioni per area
    application/         casi d’uso e operazioni tra domini
    domain/              modelli, regole, calcoli, selettori puri
    data/
      ports/             contratti repository
      adapters/          memoria, locale, legacy, backend autorizzato
      migrations/        trasformazioni versionate e riconciliazione
      sync/              coda, revisioni, conflitti, conferme
  tests/                 dominio, contratti, integrazione, parità, E2E
  public/                icone e asset statici
```

Il dettaglio delle sottocartelle segue i moduli effettivi: non creare decine di cartelle vuote. Le viste chiamano i casi d’uso; i casi d’uso applicano regole e usano porte dati; gli adattatori implementano le porte. Il dominio non importa React, DOM, SDK Firebase o componenti di altre aree. Le operazioni trasversali, come pagare una spesa o registrare una vendita con incasso, hanno un orchestratore esplicito.

Lo stato UI comprende filtri, pannelli, selezioni e bozze. Lo stato applicativo comprende i record canonici. Il salvataggio e la sincronizzazione hanno stati propri: nessuno di questi tre sostituisce gli altri. Un Context o uno store globale non deve diventare un nuovo monolite.

## 5. Regole dei dati e del comportamento

1. ID stabili e riferimenti espliciti. Rinominare o spostare un contenitore non scollega i record.
2. Un record può comparire in molte viste; nessuna duplicazione di task tra Agenda, Oggi e progetto.
3. Date di calendario in formato ISO con timezone configurata; istanti e durate distinti. Testare cambio giorno, anno, ora legale, fine mese e settimane.
4. Importi canonici in centesimi e valuta esplicita, con regola di conversione/arrotondamento verificata sui valori V1. Quantità, peso e macro richiedono regole numeriche adatte al dominio.
5. Comandi validati, esiti espliciti ed errori recuperabili. Operazioni composte atomiche; doppia conferma o ritrasmissione non duplicano l’effetto.
6. Undo in memoria, recupero persistente e storno finanziario sono strumenti diversi. Una sincronizzazione già confermata non si annulla rimettendo in memoria uno snapshot vecchio di tutto il database.
7. Scheda pianificata, sessione eseguita e storico FitOS sono distinti. Modificare un template non riscrive il passato.
8. Inventario, costo, valore stimato, ricavo, credito e incasso restano distinti. Un cambio di stato dell’articolo non accredita implicitamente denaro.
9. Nessuno storico viene inventato: registri troncati, riepiloghi esercizio e pasti storici incompleti conservano i propri limiti e la provenienza.
10. Import/export versionati; trasformazioni deterministiche; record sconosciuti o ambigui conservati in una quarantena privata, senza scarto silenzioso.
11. Dati non validi non vengono corretti con valori arbitrari, progetti generici o saldi iniziali zero.
12. Le notifiche distinguono modifica in memoria, salvataggio locale duraturo e conferma remota.

### Persistenza e compatibilità

Il contratto repository è definito subito. L’adattatore locale duraturo con fixture sintetiche precede la prova di reload; l’adattatore legacy preserva significati e riferimenti V1. La persistenza locale scelta deve permettere transazioni e versionamento; IndexedDB è la destinazione prevista per la prova locale, con gestione esplicita di indisponibilità e quota.

Il database di produzione non viene sostituito nel corso della rifattorizzazione. Il primo adattatore remoto deve essere compatibile con il sistema esistente, validato su emulatore e poi su un ambiente di prova autorizzato. Firestore resta un’eventuale decisione successiva, non una condizione per usare React o TypeScript.

La coda offline deve essere duratura se si promette recupero dopo chiusura. La sola riconnessione dell’SDK non prova questo comportamento: la [documentazione RTDB web](https://firebase.google.com/docs/database/web/read-and-write#work_with_data_offline) specifica il limite di persistenza tra sessioni. Non dichiarare sincronizzato un comando solo perché l’interfaccia lo mostra.

## 6. Sequenza di lavoro e criteri di uscita

Le fasi sono ordinate per dipendenze, non per numero di schermate. Non vengono attribuite durate o percentuali senza misurare i primi percorsi reali. Le attività indipendenti possono essere anticipate quando non aggirano i criteri di uscita; non serve aspettare i dati privati per sviluppare dominio, fixture e test locali.

### F0 — Direzione e continuità

**Da fare:** consolidare questo piano, registro e istruzioni del repository; collegare la documentazione già presente; rendere espliciti i conflitti storici e il valore del codice recuperabile.

**Uscita:** un punto d’ingresso documentale, backlog con ID, stato iniziale onesto e prossimo blocco definito. Nessuna funzione V1 marcata come migrata per il solo fatto di essere documentata.

### F1 — Progetto applicativo stabile

**Da fare:** istituire `app/`; configurare React/TypeScript/Vite, route, shell minima, error boundary, componenti di base e temi essenziali. Trasferire il core puro e i test recuperabili con provenienza. Definire porte dati e confini di import; configurare script, lockfile, CI, ambiente sintetico predefinito e protezione da connessioni involontarie.

**Uscita:** installazione pulita, typecheck/lint/test/build riusciti; prova sulla build; navigazione desktop/mobile e tastiera; zero connessioni ai dati in uso; una sola implementazione applicativa attiva. Il vecchio HTML non viene incorporato in un componente gigante.

### F2 — Primo percorso V1 completo: Task → Progetto → Agenda → salvataggio

**Da fare:** associare le funzioni V1 già catalogate a scenari di caratterizzazione; risolvere task libere/progetto e date; creare modello canonico, adattatore dei formati `agenda_YYYY-MM-DD` e riferimenti di progetto. Implementare creazione, modifica, completamento, priorità/orario, ordinamento, cambio giorno e progetto, gestione scadute, selezione multipla, spostamento, duplicazione ed eliminazione. Collegare Quick Add minimo allo stesso comando.

Realizzare repository in memoria e locale duraturo con gli stessi test; validare un primo contratto di adattatore remoto in emulatore, senza produzione. Riprendere dopo chiusura, trattare errori e doppio invio. Aggiungere test di timezone, identità e record orfani.

**Uscita:** con fixture V1 sintetiche una task viene trasformata una volta, usata in tutte le viste, modificata, salvata, riletta dopo reload e restituita nell’export; errori non causano perdita o duplicazione. Report dei casi coperti e differenze volute dalla V1. La riconciliazione con dati personali resta un gate distinto.

### F3 — Workspace, ricorrenze, obiettivi, abitudini e Oggi

**Da fare:** completare cartelle, ordine, progetti speciali/custom, override, archivio e cancellazione secondo i comportamenti V1. Trasferire obiettivi generali e settimanali, cicli, debiti/recuperi, note/link e spese pianificate come record collegati. Implementare regole ricorrenti, completamenti per data, eccezioni e streak; habits checkbox/min/max, target, correzioni e cronologia. Oggi diventa una vista derivata dei moduli verificati.

**Uscita:** cambi di settimana e giorno, riordini, cancellazioni e rinomine conservano storico e riferimenti; nessun completamento dipende da un indice instabile; le metriche derivano dai record. Persistenza e ripristino verificati per le capacità aggiunte.

### F4 — FitOS completo

Procedere per quattro sotto-moduli con consegne verificabili, usando l’audit già presente.

- **Allenamento:** catalogo, schede su sette giorni, gruppi, serie/reps/carichi, recuperi specifici, consigli, esecuzione guidata, skip/undo, storico e grafici. Separare sessione/template; salvare log e ripresa; gestire sospensione e variazione orologio. I per-set nuovi non vengono attribuiti retroattivamente alla V1.
- **Stretching:** catalogo, routine settimanali, durate personalizzate, focus, pausa, skip/fine anticipata, completamenti, storico e streak.
- **Nutrizione:** alimenti con grammi di riferimento arbitrari, ricette/ingredienti e conversioni, undici slot al giorno, sette giorni di piano, consumi e snapshot, target e correzioni.
- **Peso:** inserimento/correzione per data, unità coerenti, andamento e collegamenti al riepilogo.

**Uscita:** tutti i casi dell’audit coperti; serie, sessioni e pasti sopravvivono a chiusura/riapertura secondo la semantica prevista; i timer sono verificati nel background e al ritorno; modifiche ai piani non alterano lo storico. Calcoli numerici controllati con esempi deterministici.

### F5 — Finanze, fonti di reddito e collezioni

**Da fare in ordine:** prima ledger/asset e transazioni; poi spese/rate e storni; quindi Cards/Vinted e vendite collegate; infine risparmio, crypto, patrimonio e fonti di reddito. Trattare i saldi iniziali senza ricostruirli arbitrariamente dai soli ultimi 200 movimenti V1. Definire pagamento unico di una rata e incasso unico di una vendita.

Preservare copie fisiche Cards, quantità Vinted, acquisto/stima/venduto, note e statistiche; conservare vendite legacy non riconducibili a un articolo senza inventare legami. Distinguere royalty maturate, crediti e payout; il cambio fisso/variabile del negozio ha data di efficacia e conserva il passato. Nessuna API bancaria, KDP o marketplace è implicita.

**Uscita:** riepiloghi riconciliati sulle fixture; doppio invio e retry non duplicano pagamenti; costi e commissioni espliciti; inventario non contato due volte nel patrimonio; rate a fine mese e correzioni verificate; operazioni composte persistenti e recuperabili. L’Undo demo non viene usato come audit finanziario.

### F6 — Copertura trasversale completa

**Da fare:** completare l’intero registry Quick Add/Quick Capture V1 man mano che i domini destinatari sono pronti; form, validazione, riferimenti, preview e commit usano gli stessi servizi delle schermate. Supportare Inbox e smistamento senza perdite. La cattura colloquiale rimane un ingresso aggiuntivo con ambiguità visibili; l’AI non viene presunta.

Completare ricerca e azioni su record originali, impostazioni, preferenze, ordinamenti, export/import, compatibilità delle inizializzazioni e backup/ripristino. Ricercare contenuti appena modificati e riferimenti ad archiviati secondo regole esplicite. Riportare YAML/strumenti avanzati quando coprono una capacità V1, mantenendo semplice l’uso quotidiano.

**Uscita:** ogni categoria V1 ha un esito verificato. Una categoria che parcheggia una bozza in Inbox non viene segnata come creazione operativa di quell’entità. Export → import conserva record e aggregati; import ripetuto non duplica; errori parziali sono visibili e recuperabili.

### F7 — Affidabilità completa, accessi e sincronizzazione

I contratti e i primi test esistono da F1/F2; questa fase consolida tutti i domini.

**Da fare:** completare coda duratura, revisioni, idempotenza e gestione dei conflitti; autenticazione, separazione utenti e regole d’accesso in emulatore. Testare più tab/dispositivi, disconnessione, riavvio con operazioni pendenti, doppia conferma, permessi revocati, storage pieno e fallimenti del salvataggio. Verificare service worker, cache e aggiornamento di versione senza sovrascrivere i dati.

Usare una policy per tipo di operazione: un conflitto finanziario non si risolve riscrivendo tutta la radice o scegliendo automaticamente l’ultimo timestamp del client. Nessun dato privato negli errori, nei log di CI o nelle fixture pubbliche.

**Uscita:** test negativi di accesso, conflitti e recupero; esiti locali/remoti distinguibili; nessuna scrittura cross-user; ripristino provato. L’eventuale staging remoto usa un ambiente dedicato autorizzato, con dati sintetici e senza produzione.

### F8 — Redesign definitivo e utilità

**Da fare:** portare i temi Aurora Neo-Swiss dark e Prism Bento light in token e componenti condivisi; consolidare densità, tabelle, grafici e personalizzazione. Applicare la navigazione compatta/auto-reveal con pin, hover, focus e touch; pagine nei rami e pannelli sulle foglie. Verificare leggibilità, vuoti/errori/caricamento, focus, reduced motion e percorsi rapidi.

Valutare le idee P1 già registrate per beneficio concreto, costo e rischio: prima miglioramenti sui percorsi usati, poi nuove capacità concordate. Separare l’accettazione della baseline V1 dall’elenco opzionale: nuove idee non rendono indefinita la fine dell’app.

**Uscita:** verifica desktop/tablet/mobile e tastiera sui flussi reali; contrasto e accessibilità con obiettivo WCAG 2.2 AA, senza dichiarare una certificazione non eseguita; test di regressione ancora verdi; personalizzare la UI non modifica dati e calcoli.

### F9 — Migrazione privata, rilascio e stabilizzazione

**Da fare:** verificare privatamente i backup disponibili, provenienza/versioni e aggiornamenti rispetto alla baseline; dry-run della migrazione, fingerprint, conteggi, riferimenti e aggregati per dominio. Riconciliare importi, inventario, storici e ambiguità; eseguire import idempotente, export di ritorno e prova di ripristino. Nessun backup privato entra nel repository.

Preparare ambiente di destinazione, build identificata, configurazione, backup precedente al passaggio, procedura di ritorno e gestione delle scritture durante il passaggio. Preferire passaggio coordinato a doppia scrittura V1/V2 non progettata. La prova di rollback deve affrontare anche i nuovi dati creati dopo il passaggio, senza perderli o promettere compatibilità inversa inesistente.

**Uscita per il passaggio:** capacità obbligatorie verificate, dati riconciliati, nessun difetto bloccante, backup ripristinabile, piano di ritorno provato e autorizzazione esplicita dell’utente sul risultato concreto. Dopo il passaggio: prova sui dispositivi effettivi, salvataggio/sync/export verificati e chiusura dei difetti di stabilizzazione concordati.

## 7. Copertura dei domini: vincoli da non perdere

| Dominio | Rischio di regressione da controllare |
|---|---|
| Cartelle e progetti | 14 aree speciali più custom, ordine, override, archivio e figli |
| Task/Oggi/Agenda | Giorno, priorità/orario, scadute, task libere, bulk, identità unica |
| Goals settimanali/debiti | Reset/cicli senza perdita delle associazioni e dello storico |
| Ricorrenze | Regola vs singola occorrenza, completamenti per data, eccezioni |
| Habits | Checkbox/min/max, valori e target, correzioni e streak |
| FitOS training | Recupero del catalogo, programma accessibile, log, storico, resume |
| FitOS stretching | Durate, focus dedicato, completamento e storico |
| Nutrizione/peso | 11 slot, grammi di riferimento, ricette dipendenti, snapshot e trend |
| Finanza | Saldi iniziali, registro troncato, rate, storni e doppio conteggio |
| Fonti KDP/negozio | Maturato/credito/incasso, efficacia dei cambi, nessuna integrazione inventata |
| Cards/Vinted | Copie/quantità, costi, stime, vendite legacy e incassi |
| Capture/Inbox | Tutto il registry, stessa validazione, preview, smistamento senza perdita |
| Ricerca/impostazioni | Deep link, record aggiornati e preferenze salvate |
| Backup/sync/PWA | Versioni, restore, coda dopo chiusura, aggiornamenti cache e conflitti |

I dettagli rimangono nei documenti di dominio già presenti. Questa tabella ne presidia la copertura, non li sostituisce.

### Tracciabilità della parità

Quando si avvia un dominio, aggiungere una scheda di parità collegata al registro, senza ricopiare l’inventario generale. Per ogni funzione V1 pertinente e per la logica supplementare individuata riportare: riferimento alla baseline, capacità/ID di backlog, scelta **trasferire / accorpare / sostituire con equivalente / obsoleta**, modulo nuovo e scenario che verifica l’esito. Una rimozione “obsoleta” ha una motivazione verificabile e non elimina un’esigenza ancora presente.

Registrare analogamente chiavi dati e prefissi dinamici: origine legacy, trasformazione, proprietario del nuovo record, riferimenti, campi non mappati e regola di riconciliazione. Alla chiusura F7 tutte le voci dell’inventario e della copertura supplementare devono avere una destinazione o una decisione motivata. Le prove con dati personali si aggiungono in F9 e restano private.

## 8. Regola di completamento e misura dei progressi

Per ogni capacità registrare separatamente **implementazione**, **durata dei dati**, **parità**, **rilascio**. Esempio: “dominio verificato; dati volatili; parità parziale; non rilasciato” è uno stato valido e informativo. Non comprimerlo in “completo”.

Una capacità è **verificata localmente** quando:

- Ha riferimenti V1 e casi attesi, comprese le differenze deliberate.
- È implementata tramite i moduli previsti e usa record canonici.
- Ha validazione e gestione degli errori proporzionate al rischio.
- I dati duraturi vengono riletti dopo riavvio e verificati su export/ripristino quando pertinenti.
- I casi critici di dominio, integrazione ed E2E passano.
- È utilizzabile da mobile e tastiera nel suo livello minimo necessario.
- Stato, prove, commit e limiti sono aggiornati nel registro.

Una capacità è **migrata sui dati reali** soltanto dopo riconciliazione privata ed è **rilasciata** soltanto dopo il passaggio autorizzato. Installare un pacchetto, aumentare il numero di moduli, superare test statici o mostrare una pagina non basta per questi stati.

Non usare percentuali globali arbitrarie. Riportare capacità chiuse rispetto a un elenco stabile e prove disponibili. Le 429 definizioni nominali sono un inventario del sorgente, non 429 funzionalità di uguale peso. Nuovi casi emersi vengono aggiunti al denominatore con motivazione, senza riscrivere il passato.

## 9. Protocollo di lavoro per ogni incremento

1. Leggere piano, registro e riferimenti del dominio; verificare branch e modifiche locali.
2. Scegliere un blocco identificato, con dipendenze risolte e risultato dimostrabile. Mantenere un blocco principale attivo; le correzioni necessarie rientrano nello stesso contesto.
3. Riutilizzare audit e codice già verificato; integrare soltanto i casi mancanti emersi dal sorgente.
4. Definire scenari di accettazione e trasformazioni prima di cambiare strutture persistenti.
5. Implementare un percorso completo di dimensione revisionabile. Gli stub inevitabili rimangono etichettati e non chiudono il requisito.
6. Eseguire i controlli pertinenti al rischio; la CI controlla typecheck/lint/test/build, gli E2E coprono il flusso modificato. Evitare test che ricopiano l’implementazione senza verificare un comportamento.
7. Rivedere diff, contratti e confini; aggiornare il registro e gli eventuali documenti di dominio.
8. Salvare un commit coerente e pubblicare sul solo branch consentito. Verificare il commit remoto e la preview della build quando l’incremento modifica l’app.
9. Comunicare cosa funziona, con quali dati, cosa è stato testato e cosa manca. Identificare il prossimo blocco; non chiedere nuovamente autorizzazione per normali attività già comprese nell’obiettivo.

Cambiare il piano è ammesso quando una prova lo giustifica. Registrare decisione, motivazione, alternative scartate, conseguenze, dipendenze e attività coinvolte prima di proseguire nel nuovo indirizzo. Le nuove idee vanno nel backlog; non sostituiscono silenziosamente il blocco attivo.

## 10. Qualità, verifica e distribuzione

| Livello | Prova richiesta |
|---|---|
| Dominio | Calcoli, invarianti, dati invalidi, limiti e conversioni con fixture deterministiche |
| Repository | Stesso contratto su memoria/locale/emulatore, errori, revisioni e idempotenza |
| Migrazione | Golden fixture V1, trasformazione ripetuta, conteggi, riferimenti e round-trip |
| Componenti | Input, validazione, feedback, focus e stato visibile all’utente |
| Integrazione | Pagamenti/vendite, task condivise, completamenti, piani vs storico |
| E2E | Crea → modifica → salva → chiudi/riapri → ritrova; errori e recupero |
| Sicurezza/sync | Accessi negati, utenti separati, retry e conflitti multi-client |
| Distribuzione | Build identificata, deep link, base path, cache aggiornabile e prova di ritorno |

Usare test isolati, orologio controllabile per calendario/timer e fixture sintetiche. Gli screenshot integrano la verifica del comportamento; non sostituiscono calcoli o salvataggio. Tenere i dati personali fuori da log, screenshot condivisi, CI e servizi di anteprima.

La CI di verifica non distribuisce automaticamente in produzione. Prevedere una preview della build in ambiente separato; un proxy di sorgenti e il server di sviluppo non equivalgono a hosting di produzione. L’attivazione di hosting, permessi, costi o servizi nuovi rimane un’azione separata da autorizzare quando necessaria.

### Prestazioni, dispositivi e manutenzione

In F1 definire una matrice riproducibile di browser e viewport; includere motori Chromium, Firefox e WebKit per i percorsi supportati. In F8/F9 affiancare verifiche sui dispositivi reali di destinazione, compresi i vincoli Safari/iOS quando supportato. Segnalare esplicitamente ciò che è stato emulato e ciò che è stato provato su hardware reale.

Misurare tempi di apertura, risposta a filtri/ricerca, consumo di memoria e durata delle operazioni su fixture sintetiche di volume realistico; fissare i budget prima di ottimizzare, indicando dispositivo e condizioni. Quando si conoscono privatamente le dimensioni V1, usare conteggi anonimizzati per verificare volumi maggiori senza pubblicare contenuti. Caricare per route, evitare letture dell’intera base per ogni modifica e non aggiornare l’intera app a ogni tick di un timer. Introdurre paginazione o virtualizzazione quando la misura lo richiede.

La consegna include istruzioni per ambiente, dipendenze/lockfile, verifica, build, configurazione, backup e ripristino. Ogni cambiamento di schema prevede versione e test di migrazione; ogni aggiornamento importante di dipendenza viene verificato sul percorso interessato. L’aggiornamento del codice non deve richiedere una manipolazione manuale dei dati da parte dell’utente.

## 11. Decisioni fissate e decisioni da chiudere

| ID | Decisione | Stato |
|---|---|---|
| DEC-001 | Prima architettura e parità, poi redesign e P1 | Fissata dalla richiesta utente |
| DEC-002 | Un’unica sorgente `app/`; batch congelate dopo consolidamento F1 | Attuata in INC-01; capacità successive solo nella sorgente unica |
| DEC-003 | React + TypeScript + Vite, con componenti e dominio indipendente | Configurati in INC-01; versioni e lockfile in `app/` |
| DEC-004 | Nessun cambio automatico da RTDB a Firestore | Fissata per la rifattorizzazione |
| DEC-005 | Date/identità/importi canonici; compatibilità tramite adattatori | Direzione fissata; dettagli e conversioni testati per modulo |
| DEC-006 | Semantica task senza progetto e record orfani | Da chiudere sul sorgente e fixture in F2 |
| DEC-007 | Autorità locale/remota, revisioni e conflitti per tipo di comando | Contratto iniziale in F1/F2; verifica completa F7 |
| DEC-008 | Strategia di preview/build e hosting finale | INC-01: build locale, hash router e base relativa; hosting finale prima di F9 |
| DEC-009 | Account, mapping utente, ambiente remoto e accessi | Emulatore predisposto; ambiente reale solo autorizzato |
| DEC-010 | Design Aurora/Prism, sidebar compatta e navigazione accessibile | Direzioni di prodotto da conservare |

Le scelte tecniche del piano non sono dichiarazioni di implementazione né autorizzazioni a toccare dati o servizi in uso.

## 12. Condizioni di chiusura dell’app

La prima release completa è pronta quando tutte le capacità obbligatorie hanno prove di parità e persistenza, i dati reali sono riconciliati, sicurezza e sincronizzazione sono verificate, UI e dispositivi superano l’accettazione, il backup è ripristinabile e il rilascio è identificato e autorizzato. Non devono esserci difetti aperti che causino perdita/corruzione di dati, accesso improprio, calcoli economici errati o impossibilità di un percorso fondamentale.

I difetti minori eventualmente accettati hanno impatto e rimedio documentati. Dopo la stabilizzazione si separano manutenzione e nuove evoluzioni: “fine app” non viene rinviata indefinitamente dall’aggiunta di idee opzionali.

## 13. Riferimenti tecnici verificati

Consultati il 21 ottobre 2026; supportano le scelte degli strumenti, mentre l’architettura e le priorità sono decisioni di progetto.

- [React: costruire un’app e responsabilità della toolchain](https://react.dev/learn/build-a-react-app-from-scratch).
- [TypeScript: migrazione incrementale da JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html).
- [Vite: build, preview e distribuzione statica](https://vite.dev/guide/static-deploy.html).
- [React Router: modalità disponibili](https://reactrouter.com/start/modes).
- [Vitest: configurazione dei test](https://vitest.dev/guide/).
- [Testing Library: verificare l’uso dei componenti](https://testing-library.com/docs/guiding-principles/).
- [Playwright: comportamento visibile e isolamento dei test](https://playwright.dev/docs/best-practices).
- [Firebase RTDB web: capacità offline e limiti](https://firebase.google.com/docs/database/web/offline-capabilities).
- [Firebase RTDB web: scritture e persistenza fuori dalla sessione](https://firebase.google.com/docs/database/web/read-and-write#work_with_data_offline).
- [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## 14. Cronologia del piano

| Versione | Data | Cambiamento |
|---|---|---|
| 1.0 | 2026-10-21 | Consolidamento della direzione tecnica, sorgente unica, sequenza F0–F9 e criteri di avanzamento; supera il processo storico design-first |
| 1.1 | 2026-10-21 | INC-01 istituisce `app/`, congela le batch e attua toolchain/preview; parità V1, storage duraturo e backend restano gate separati |
