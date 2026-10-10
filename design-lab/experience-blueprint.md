# LifeOS Experience Blueprint — V2 UX / Batch 03

Status: **proposta progettuale**, non implementazione del prodotto. Target themes selezionati dall'utente: **Aurora Neo-Swiss (notte)** e **Prism Bento (giorno)**. Entrambe sono due modalità della stessa app, non due prodotti separati.

## 1. Obiettivo

Non replicare la UI V1. Mantenere la parità delle capacità essenziali e riprogettare i flussi intorno a quattro attività ricorrenti: **catturare, decidere, eseguire, rivedere**. Tutto ciò che è accessorio resta a un livello secondario.

Principi: chiarezza immediata; azioni frequenti in 1-2 passaggi; gerarchia tipografica Swiss; bento funzionale e non decorativo; stato, origine e conseguenze sempre espliciti; multitouch/keyboard; feedback ottimistico solo dove sicuro; riduzione di attrito e contesto perso; colori per significato, mai come unica codifica. Ridurre le distrazioni, non aumentare la pressione psicologica.

## 2. Architettura informativa proposta

**Navigazione primaria**
- Oggi: cockpit personale e priorità (non un riassunto infinito)
- Progetti: cartelle, progetti, milestone, recurring, obiettivi, debiti, note, spese e storico
- Agenda: calendario e pianificazione cross-project
- FitOS: workout, focus, stretching, alimentazione, ricettario, database alimenti, peso e storico
- Finanze: patrimonio, asset, ledger, ricavi, spese, rate, crypto e risparmio

**Navigazione secondaria**
- Collezioni: Vinted + Carte (con inventario, vendite, valutazioni)
- Inbox: cattura senza classificare; smistamento successivo verso qualsiasi dominio
- Review: revisione settimanale, obiettivi, trend reali
- Ricerca globale / Command Center
- Impostazioni / integrazioni (future) / import-export

Le collezioni e i sottomoduli restano pienamente raggiungibili: nascondere tutto dentro “Altro” senza wayfinding sarebbe un peggioramento.

## 3. Regole del layout

- Desktop: rail laterale stabile 220-260px, ricerca e Quick Add nella topbar, struttura centrale 12 colonne. Sidebar con stato attivo e gruppi.
- Tablet: rail compatto + pannelli adattabili, senza hover obbligatorio.
- Mobile: 4 destinazioni primarie ben etichettate, action (+), un pannello **Altro** accessibile per tutti i moduli; tap target min 44px. Lista verticale ordinata per priorità; nessuna minigriglia illeggibile.
- Bento: un blocco grande per azione/insight principale, blocchi medi per contesto e mini-widget solo per dati con valore; altezza e densità adattate al contenuto.
- Accessibilità: tab order, focus, labels, keyboard, aria-live per conferme, reduced-motion, contrasti target WCAG AA.

## 4. User journeys prioritari

| Intento | V1 indicativo | V2 target | Criterio |
|---|---|---|---|
| Aggiungere task | diversi entry point | Cmd/Ctrl+K o pulsante +, input, Invio | in <= 2 step |
| Segnare ricorrente | progetto / Oggi | Oggi o progetto, un tap | un tap con Undo |
| Spostare task arretrata | Oggi -> sposta | card in Today o drag Agenda | <= 2 azioni |
| Continuare sessione allenamento | percorso dentro FitOS | “Riprendi sessione” contestuale | 1 tap |
| Aggiungere peso | entra in alimentazione | Quick Add / FitOS card | 2 step |
| Registrare spesa e asset | Finanze + modal / Quick Capture | comando tipizzato con preview effetti | 1 form, 1 conferma |
| Pagare spesa pianificata | spesa -> asset | action contestuale, transazione idempotente | 1 conferma esplicita |
| Cercare carta in catalogo | apri progetto carte | ricerca globale -> scheda carta | 1 ricerca |
| Registrare vendita Vinted | inventory view | scheda articolo -> “Vendi”, anteprima incasso | 2-3 step |
| Rivedere obiettivi | progetti multipli | Weekly Review aggregato | 1 vista |

I target sono obiettivi di progettazione, **non metriche misurate**.

## 5. Screen contracts

### Oggi / Daily cockpit
- Gerarchia: primo “cosa devo fare?”, secondo “cosa sto facendo?”, terzo “come sto andando?”.
- Bento hero funzionale: focus principale e due next steps, non slogan dominante.
- Segnalazioni da trattare: arretrate, scadenze, sessione in corso.
- Task da oggi e ricorrenti previste; streak solo contestualizzati, non colpevolizzanti.
- Progressi abitudini, FitOS, finanze sono riepiloghi navigabili.
- Opzione per nascondere/spostare widget non rilevanti (post-MVP).

### Progetti / Workspace
- Ricerca e filtri per cartella, priorità, stato.
- Switch bento/cards ↔ lista densa con priorità.
- Dettaglio laterale rapido con task, obiettivi, spese, storico senza perdere vista corrente.
- Progetto standard e progetto specializzato: stessi meta-controls, contenuti specifici.
- “Next action” come campo derivato dai task, non secondo sistema parallelo.

### Agenda
- Giorno / settimana / timeline.
- Task di progetto + libere + ricorrenti previste; occorrenze leggibili ma senza duplicazioni salvate.
- Move / duplicate / bulk, date picker e inbox triage; override della ricorrente solo come decisione esplicita.

### FitOS
- Home di sezione con allenamento previsto, sessione recuperabile, log peso e macro.
- Focus allenamento **a schermata dedicata**, accesso a set/storico e recupero.
- Nutrizione: template settimanale distinto da ciò che è stato davvero consumato.
- Stretching dedicato; no calcoli macro dal futuro che riscrivano il passato.

### Finanze
- Patrimonio + variazione esplicita con origine, chart drilldown e asset.
- Movimenti e spese pianificate distinti; un pagamento lega spesa + asset + transazione.
- Valutazioni di Vinted/carte non contate due volte.
- Immissione finanziaria sempre con preview dell'effetto e conferma verificata.

### Collezioni
- Cataloghi Vinted / Carte in vista griglia/lista, saldi valorizzati e vendite.
- Ricerca globale capace di aprire item direttamente.

## 6. Nuove idee da esplorare senza compromettere la V1

**P1 — Inbox universale:** cattura task, note, spese, link, idee prima di scegliere progetto/modulo; smistamento con preview e creazione di comandi canonici. Evitare un altro database di note isolato.

**P1 — Resume Context:** azione contestuale “riprendi da dove eri” per focus FitOS e lavoro incompleto, senza salvataggio implicito di azioni finanziarie.

**P1 — Weekly Review:** agenda della settimana, progetti bloccati, streak, obiettivi, spese previste; guida non coercitiva, senza punire l'utente.

**P1 — Smart views locali:** Oggi, in ritardo, ad alta priorità, questa settimana; solo query sugli stessi record, nessun duplicato.

**P1 — Undo e Cronologia:** per azioni reversibili (check task, archiviazione, spostamento) con feedback immediato; per finanze annullamento come storno, non cancellazione silenziosa.

**P2 — Widgets personalizzabili:** mostra/nascondi e disposizione (bento editor). Evitare complessità prima di capire i flussi reali.

**P2 — Connessioni esterne:** banca solo Open Banking regolamentato read-only, altri servizi API ufficiali o report con consenso. Nessuna credenziale esterna salvata nel client o modifiche ai dati live senza approvazione.

**P2 — Suggerimenti contestuali intelligenti:** consigli basati su regole esplicabili, disattivabili; niente pressione o “score” opachi.

## 7. Design language

### Aurora Neo-Swiss / dark
Canvas blu notte, superfici differenziate, tipografia grande, accent cyan e blu; viola e corallo usati per domini/stati. Pochi gradienti, soprattutto nel KPI principale. Bordo nitido.

### Prism Bento / light
Canvas avorio/grigio neutro, superfici bianche, sezioni color-block cobalt/turquoise/coral, testo profondo e ad alto contrasto. No palette pastello. Aree colorate con proporzione controllata: visibili ma non stancanti.

### Shared tokens
Semantica `info/success/warning/danger` indipendente dal tema; `projectColor` separato dallo stato; typography scale; spaziature 4/8/12/16/24/32; radius proporzionati; componenti identici in entrambi i temi.

## 8. Prototipo Batch 03

Nuovo prototipo concettuale su branch separato. Deve rendere testabili:
- temi dark/light come unica app;
- Oggi action-first con bento e quick capture;
- Agenda e FitOS realmente raggiungibili;
- navigazione ai progetti, finanze, collezioni, inbox e review;
- operazioni solo simulate, dati fittizi, nessun Firebase.

## 9. Cosa non è ancora stato validato

Non sono stati effettuati test d'usabilità su utenti reali, misure dei tempi, analisi di produzione o test automatici multi-device. Le nuove funzioni e le viste di questo blueprint sono proposte. La completa parity checklist V1 rimane necessaria prima del rilascio. 
