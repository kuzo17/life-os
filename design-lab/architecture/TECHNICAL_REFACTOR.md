# LifeOS — rifattorizzazione tecnica prima del redesign

## Obiettivo corretto

Far evolvere l’app esistente conservando capacità osservabili, identità dei record e dati. Prima l’affidabilità tecnica e la parità, poi estetica e funzioni aggiuntive. Le batch UI sono riferimenti e fixture di sviluppo, non prodotti separati da continuare a espandere.

Baseline V1: `main@e58a77e3e00445474d93008d15ecf3a171f2a783`, `index.html` di circa 542 KB e 8.932 righe. Il precedente inventario documenta 429 funzioni nominate, oltre a callback e logica inline da riconciliare. Dimensioni e numero di file non sono metriche di completamento.

## Situazione verificabile

| Oggetto | Stato |
|---|---|
| V1 in uso | Invariata |
| Batch 01–13 | Riferimenti conservati |
| Nuova shell e moduli espliciti | Implementati nella base Batch 14 |
| Store immutabile e comandi atomici | Implementati sul sottoinsieme sintetico |
| Parità completa V1 | Non raggiunta |
| Adattatore per il salvataggio esistente | Da implementare |
| Sincronizzazione/autenticazione/migrazione reali | Non collegate |
| Nuova veste grafica definitiva | Dopo consolidamento tecnico |

Nessuna percentuale del laboratorio rappresenta la quota di V1 trasferita. Una capacità è migrata solo quando il comportamento originale, la struttura dei dati e gli scenari di errore sono verificati nel nuovo percorso.

## Regole della base da evolvere

1. L’HTML iniziale contiene la struttura di avvio; ogni area ha moduli espliciti. Vietato ricreare un unico `app.js` con tutte le responsabilità o un contenitore globale di funzioni.
2. Una task, una sessione o un movimento hanno identità unica. Schermate e ricerca leggono gli stessi record.
3. Le viste presentano e raccolgono input; i servizi applicano le regole; i repository gestiscono il salvataggio. Nessun accesso al database distribuito nei template.
4. Prima di cambiare un comportamento V1, aggiungere esempi e scenari di verifica. Correggere i bug documentando la differenza voluta.
5. Introdurre un repository compatibile con i dati esistenti prima di valutare un cambio di database. Il precedente candidato Firestore non è una decisione approvata per questa rifattorizzazione.
6. Usare fixture sintetiche nel repository. I dati personali e i backup rimangono fuori da GitHub.
7. Continuare sulla base modulare Batch 14. Le prossime consegne sono incrementi della stessa applicazione, senza nuove copie integrali.

## Sequenza operativa

### 1. Portare un percorso V1 completo

Task/Progetto/Agenda è il primo percorso: campi e ID legacy → modello canonico → comandi → viste → repository di prova → rilettura. Coprire date ISO, giorni, priorità, ordinamento, spostamento, duplicazione, completamento e riferimenti. Confrontare con V1 tramite fixture anonimizzate e casi di caratterizzazione.

Il laboratorio dimostra già alcuni comandi e viste; non ha ancora trasferito le strutture persistenti e tutte le regole della V1.

### 2. Collegare il confine dati in un ambiente di prova

Definire caricamento, salvataggio, errori e versione dei dati dietro un’interfaccia repository. Prima adattatore in memoria per test, poi adattatore compatibile con il salvataggio esistente in staging. Verificare rilettura dopo riavvio, errori, assenza di duplicazioni e recupero. La connessione ai dati in uso richiede i controlli privati e il piano di rollback già documentati.

### 3. Trasferire gli altri domini per capacità complete

Habits e ricorrenze; FitOS training/stretching/nutrition/peso; Finance e rate; Cards/Vinted e vendite; Quick Add completo; ricerca, impostazioni e backup. Per ogni dominio: mapping V1, casi di verifica, servizi, adattatore, UI, confronto di parità. Nessun modulo viene dichiarato completo dopo il solo spostamento del markup.

### 4. Consolidare e poi rifinire il prodotto

Controlli statici dei contratti, test tra moduli, errori di caricamento, offline/conflitti, accessibilità e dispositivi. Una volta stabile il percorso reale, applicare il design Aurora/Prism, migliorare i componenti e introdurre nuove capacità concordate.

## Consegna e protezione dell’app in uso

Il lavoro resta sul branch `lifeos-visual-lab`. Nessuna modifica a `main`, `lifeos-v2`, Firebase o backup privati. La sostituzione della V1 avviene solo dopo riconciliazione dei dati e verifica del ripristino, con approvazione esplicita.
