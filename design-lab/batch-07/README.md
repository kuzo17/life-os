# LifeOS Visual Lab — Batch 07: scheletro strutturale

**Obiettivo:** continuare a costruire le fondamenta UI/UX, senza perdere i requisiti V1 e senza fare release o migrazione.

## Anteprima
- [Apri Batch 07 nel browser](https://raw.githack.com/kuzo17/life-os/lifeos-visual-lab/design-lab/batch-07/index.html)
- [Codice sorgente Batch 07](https://github.com/kuzo17/life-os/blob/lifeos-visual-lab/design-lab/batch-07/index.html)

## Cosa è stato realizzato nel LAB

### Routing unico (profondità reale)
- Hash routes che descrivono **livello di pagina**, non solo il modulo aperto.
- `#/projects` cartelle → `#/projects/folder/zjpc` → `#/projects/workspace/kdp/tasks`
- `#/agenda/week/3` → `#/fitos/train/day/2` → `#/finance/source/kdp` → `#/collections/vinted`.
- `history.pushState` per le azioni di navigazione, `popstate` e `hashchange` per Back/Forward.
- Ricerca rapida estesa a cartelle, progetti, task e fonti economiche, con destinazione nel giusto livello.
- **Limitazione nota:** la demo usa ancora alcune date relative e alcuni stati locali non serializzati. Tutto questo va formalizzato con date ISO e tipi nel router definitivo.

### Cartelle / progetti con ID stabili
- Five cartelle principali della V1 in una vista folder-first (nomi di riferimento, non dati privati).
- Ogni cartella usa `id` distinto dal nome; ogni progetto ha `folderId` stabile.
- Gestione in UI: crea/rinomina/ordina cartelle; crea/modifica/sposta/archivia progetti. Cartelle non vuote o originali sono protette dalla cancellazione demo.
- Spostare/archiviare un progetto **non cancella le task**. Un'unica vista filtrata determina task e progresso.
- Progetti demo FitOS sono rappresentati nel loro modulo, non come falsa sesta cartella.
- **Non** sono state importate cartelle personalizzate o task dal JSON dell'utente, e i contenuti del progetto restano sintetici.

### Collezioni come modulo reale di navigazione
- Carte e Vinted possiedono elenchi inventario con ricerca e filtri su disponibile/venduto.
- Scheda del singolo articolo in pannello finale con identificativo stabile, quantità, costo, stima, prezzo richiesto e status.
- Creazione e modifica funziona *solo in memoria*. Nessuna scrittura nel conto e nessuna registrazione reale di vendita, perché senza una riconciliazione corretta introdurrebbe doppio conteggio.
- La vera V2 manterrà tutte le proprietà originali degli item (carte per copia, lingua, condizioni, set; stock Vinted, prezzi e storico) e offrirà filtri più avanzati.

### Architettura applicativa separata dal rendering
- [Blueprint dell'app modulare](../architecture/APP_ARCHITECTURE.md) con routing, dominio, servizi, repository, migrazione e non regressione.
- [workspace-core.mjs](../architecture/workspace-core.mjs): piccolo servizio **puro e indipendente da Firebase** per cartelle, progetti e task, con comandi immutabili e selettori unici.
- [workspace-core.test.mjs](../architecture/workspace-core.test.mjs): test delle invarianti ID, relazioni, archiviazione, date ISO e blocco dei dati invalidi.
- **Il core dimostrativo non è ancora connesso alla UI Batch 07**, che conserva il suo stato locale: è un primo passo verso la modularizzazione, non un'app V2 funzionante.

## Validazione tecnica eseguita
- Sintassi JS del prototipo: valida.
- 53 viste/sottoviste rese staticamente e controllate per tag HTML bilanciati: nessuna incongruenza nel campione.
- Deep-link round-trip fra route e stato: i percorsi principali testati sono coerenti.
- Rinomina cartella: mantiene l'ID e le associazioni ai progetti.
- Servizio puro: test di creazione stato e di comandi/validazioni, con rifiuto di task orfane, date impossibili e rimozione di cartelle piene.
- Dati finanziari demo: coerenti fra maturato, incassato e residuo nelle fonti testate.
- **Non è stato completato un test browser visivo/E2E, né un test su dispositivo iPhone.** Servono prima dell'approvazione finale dei componenti.

## Principali gap da affrontare nelle iterazioni successive
1. Sostituire i riferimenti a date relative con task `dueDate` ISO e settimana calendario effettiva, conservando time zone/ricorrenti V1.
2. Collegare davvero la UI al core di dominio e introdurre repository/staging, con backup e test senza dati personali nel repo.
3. Espandere Goal, Ricorrenti, Note e Spese: sono ancora cornici UX, non equivalenti funzionali V1.
4. FitOS: collegamento scheda selezionata → Focus completo → log serie/storico → recovery, senza perdere nutrizione/ricette/stretching.
5. Finance: modelli separati asset/source/receivable/payout/inventory e accounting eventi riconciliati.
6. Pagine densità compact/comfortable e UX mobile su materiale reale, senza moltiplicare click.
7. Quick Add: parità completa categorie V1, linguaggio colloquiale più robusto, preview delle ambiguità, progetto/priorità/data canonici.
8. Sincronizzazione per utente, sicurezza accessi, offline/pending/undo, test di riconciliazione.

**Il branch `main` e `lifeos-v2` non vengono modificati nel Visual Lab. La V1 resta il minimo di parità obbligatoria.**
